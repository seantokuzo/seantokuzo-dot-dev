import { useState, useRef, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import { Nucleus } from './Nucleus'
import { ElectronOrbit } from './ElectronOrbit'
import { ProjectOrb } from './ProjectOrb'
import { Starfield } from './Starfield'
import { Ufo } from './Ufo'
import { CameraController, type FocusPhase } from './CameraController'
import { projects, type Project } from '../../data/projects'
import type { AtomMode } from './AtomContext'

type OrbitConfig = {
  radius: number
  tilt: [number, number, number]
  speed: number
  color: string
}

// Desktop: wider, more horizontal orbits
const ORBITS_DESKTOP: OrbitConfig[] = [
  { radius: 2.4, tilt: [0.3, 0, 0.2], speed: 0.4, color: '#a855f7' },
  { radius: 3.2, tilt: [-0.5, 0.4, -0.1], speed: -0.3, color: '#6366f1' },
  { radius: 4.0, tilt: [0.1, -0.3, 0.6], speed: 0.2, color: '#38bdf8' },
]

// Mobile: tighter radii (75% of desktop) + vertical tilts for portrait
const ORBITS_MOBILE: OrbitConfig[] = [
  { radius: 1.8, tilt: [0.8, 0, 0.3], speed: 0.4, color: '#a855f7' },
  { radius: 2.4, tilt: [-1.0, 0.3, -0.2], speed: -0.3, color: '#6366f1' },
  { radius: 3.0, tilt: [0.6, -0.2, 0.8], speed: 0.2, color: '#38bdf8' },
]

// Tablet: intermediate radii + moderate tilts between mobile/desktop
const ORBITS_TABLET: OrbitConfig[] = [
  { radius: 2.1, tilt: [0.5, 0, 0.25], speed: 0.4, color: '#a855f7' },
  { radius: 2.8, tilt: [-0.75, 0.35, -0.15], speed: -0.3, color: '#6366f1' },
  { radius: 3.5, tilt: [0.35, -0.25, 0.7], speed: 0.2, color: '#38bdf8' },
]

const CAMERA_Y = 3
const CAMERA_Z_DESKTOP = 8
const HOME_CAMERA_DISTANCE = 80
const ORB_RADIUS = 0.18
const ORB_RADIUS_MOBILE = 0.24

/**
 * Compute camera Z so all orbits + electrons fit within the viewport width.
 * Worst-case horizontal extent of a tilted circle of radius R is R itself
 * (over all camera rotation angles via OrbitControls auto-rotate).
 */
function computeFitCameraZ(
  orbits: OrbitConfig[],
  fov: number,
  cameraY: number,
  orbRadius: number,
  padding = 1.1
): number {
  const aspect = window.innerWidth / window.innerHeight || 1
  const hFovHalf = Math.atan(aspect * Math.tan((fov * Math.PI) / 360))
  const maxExtent = Math.max(...orbits.map((o) => o.radius)) + orbRadius
  const requiredDist = (maxExtent * padding) / Math.tan(hFovHalf)
  return Math.sqrt(Math.max(1, requiredDist * requiredDist - cameraY * cameraY))
}

/** Scene lighting — full brightness in all modes */
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-6, -3, -8]} intensity={0.4} color="#b967ff" />
    </>
  )
}

/** Lerps camera distance between home (far/tiny atom) and projects (normal) */
function CameraZoom({
  isHomeMode,
  controlsRef,
  projectsDistance,
  focusPhase,
}: {
  isHomeMode: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.RefObject<any>
  projectsDistance: number
  focusPhase: FocusPhase
}) {
  const tmpDir = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    // Don't interfere with project focus animation
    if (focusPhase !== 'idle') return

    const controls = controlsRef.current
    if (!controls) return

    const camera = state.camera
    const target = controls.target as THREE.Vector3
    tmpDir.copy(camera.position).sub(target)
    const currentDist = tmpDir.length()
    if (currentDist < 0.01) return

    const targetDist = isHomeMode ? HOME_CAMERA_DISTANCE : projectsDistance
    // Skip if already close enough
    if (Math.abs(currentDist - targetDist) < 0.05) return

    const speed = 2.5 * Math.min(delta, 0.05)
    const newDist = THREE.MathUtils.lerp(currentDist, targetDist, speed)

    tmpDir.normalize().multiplyScalar(newDist)
    camera.position.copy(target).add(tmpDir)
  })

  return null
}

export interface AtomSceneHandle {
  focusProject: (project: Project) => void
  stepToProject: (project: Project) => void
  requestClose: () => void
  startUfo: (onComplete: () => void, screenOrigin?: { x: number; y: number }) => void
}

interface AtomSceneProps {
  atomMode?: AtomMode
  orbitPaused?: boolean
  isMobile?: boolean
  isTablet?: boolean
  onFocusChange?: (focused: boolean) => void
  onFocusedProjectChange?: (project: Project | null) => void
}

export const AtomScene = forwardRef<AtomSceneHandle, AtomSceneProps>(function AtomScene(
  { atomMode = 'projects', orbitPaused = false, isMobile = false, isTablet = false, onFocusChange, onFocusedProjectChange },
  ref
) {
  const isHomeMode = atomMode === 'home'
  const orbits = isMobile ? ORBITS_MOBILE : isTablet ? ORBITS_TABLET : ORBITS_DESKTOP
  const cameraFov = isMobile ? 60 : 50
  const orbRadius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS
  const cameraZ = isMobile || isTablet
    ? computeFitCameraZ(orbits, cameraFov, CAMERA_Y, orbRadius)
    : CAMERA_Z_DESKTOP
  const polarAngle = Math.acos(CAMERA_Y / Math.sqrt(CAMERA_Y ** 2 + cameraZ ** 2))

  const orbitProjects = useMemo(
    () => orbits.map((_, idx) => projects.filter((_, i) => i % orbits.length === idx)),
    [orbits]
  )

  const [focusedProject, setFocusedProject] = useState<Project | null>(null)
  const [focusPhase, setFocusPhase] = useState<FocusPhase>('idle')

  const focusTargetRef = useRef(new THREE.Vector3())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null)
  const focusPhaseRef = useRef<FocusPhase>('idle')
  focusPhaseRef.current = focusPhase

  // Notify parent of focus state changes
  useEffect(() => {
    const active = focusPhase !== 'idle' && focusPhase !== 'unfocusing'
    onFocusChange?.(active)
  }, [focusPhase, onFocusChange])

  const handleSelectProject = useCallback((project: Project) => {
    if (focusPhaseRef.current !== 'idle') return
    setFocusedProject(project)
    setFocusPhase('focusing')
    if (controlsRef.current) {
      controlsRef.current.enabled = false
    }
  }, [])

  const handleStepToProject = useCallback((project: Project) => {
    if (focusPhaseRef.current !== 'focused') return
    setFocusedProject(project)
    setFocusPhase('stepping')
  }, [])

  const requestClose = useCallback(() => {
    if (focusPhaseRef.current !== 'focused') return
    setFocusPhase('card-exit')
  }, [])

  const handleFocusComplete = useCallback(() => {
    setFocusPhase('focused')
  }, [])

  const handleCardExitComplete = useCallback(() => {
    setFocusPhase('unfocusing')
  }, [])

  const handleUnfocusComplete = useCallback(() => {
    setFocusPhase('idle')
    setFocusedProject(null)
  }, [])

  useEffect(() => {
    onFocusedProjectChange?.(focusedProject)
  }, [focusedProject, onFocusedProjectChange])

  // UFO flight state
  const [ufoFlying, setUfoFlying] = useState(false)
  const ufoCompleteRef = useRef<(() => void) | null>(null)
  const ufoScreenOriginRef = useRef<{ x: number; y: number } | null>(null)

  const startUfo = useCallback((onComplete: () => void, screenOrigin?: { x: number; y: number }) => {
    ufoCompleteRef.current = onComplete
    ufoScreenOriginRef.current = screenOrigin ?? null
    setUfoFlying(true)
  }, [])

  const handleUfoComplete = useCallback(() => {
    setUfoFlying(false)
    ufoCompleteRef.current?.()
    ufoCompleteRef.current = null
  }, [])

  useImperativeHandle(ref, () => ({
    focusProject: handleSelectProject,
    stepToProject: handleStepToProject,
    requestClose,
    startUfo,
  }), [handleSelectProject, handleStepToProject, requestClose, startUfo])

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, CAMERA_Y, cameraZ], fov: cameraFov }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      onPointerMissed={requestClose}
    >
      <AdaptiveDpr pixelated />

      {/* Starfield background */}
      <Starfield />

      <SceneLighting />

      {/* Nucleus */}
      <Nucleus />

      {/* Orbits + Project Orbs */}
      {orbits.map((orbit, orbitIdx) => (
        <group key={orbitIdx}>
          <ElectronOrbit
            radius={orbit.radius}
            tilt={orbit.tilt}
            color={orbit.color}
          />
          {orbitProjects[orbitIdx].map((project, projIdx) => {
            const angleSpread =
              (Math.PI * 2) / Math.max(orbitProjects[orbitIdx].length, 1)
            return (
              <ProjectOrb
                key={project.id}
                project={project}
                orbitRadius={orbit.radius}
                orbitTilt={orbit.tilt}
                speed={orbit.speed}
                startAngle={projIdx * angleSpread}
                onSelect={handleSelectProject}
                selectedProjectId={focusedProject?.id ?? null}
                focusPhase={focusPhase}
                focusTargetRef={focusTargetRef}
                onRequestClose={requestClose}
                onCardExitComplete={handleCardExitComplete}
                isMobile={isMobile}
                orbitPaused={orbitPaused}
                showLabel={!isHomeMode}
              />
            )
          })}
        </group>
      ))}

      {/* UFO flight */}
      {ufoFlying && <Ufo onComplete={handleUfoComplete} screenOrigin={ufoScreenOriginRef.current} />}

      {/* Camera animation controller */}
      <CameraController
        phase={focusPhase}
        targetRef={focusTargetRef}
        controlsRef={controlsRef}
        onFocusComplete={handleFocusComplete}
        onUnfocusComplete={handleUnfocusComplete}
        isMobile={isMobile}
      />

      {/* Home/projects camera zoom lerp */}
      <CameraZoom
        isHomeMode={isHomeMode}
        controlsRef={controlsRef}
        projectsDistance={Math.sqrt(CAMERA_Y ** 2 + cameraZ ** 2)}
        focusPhase={focusPhase}
      />

      {/* Controls — Y-axis rotation only (polar angle locked) */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={!isHomeMode}
        enableRotate={!isHomeMode}
        minDistance={4}
        maxDistance={isHomeMode ? HOME_CAMERA_DISTANCE + 10 : (isMobile ? 18 : 14)}
        minPolarAngle={polarAngle}
        maxPolarAngle={polarAngle}
        autoRotate={!orbitPaused && focusPhase === 'idle'}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
})
