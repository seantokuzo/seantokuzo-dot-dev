import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import { Nucleus } from './Nucleus'
import { ElectronOrbit } from './ElectronOrbit'
import { ProjectOrb } from './ProjectOrb'
import { Starfield } from './Starfield'
import { CameraController, type FocusPhase } from './CameraController'
import { projects, type Project } from '../../data/projects'

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

const CAMERA_Y = 3
const CAMERA_Z_DESKTOP = 8
const ORB_RADIUS = 0.18 // electron radius — must match ProjectOrb

/**
 * Compute camera Z so all orbits + electrons fit within the viewport width.
 * Worst-case horizontal extent of a tilted circle of radius R is R itself
 * (over all camera rotation angles via OrbitControls auto-rotate).
 */
function computeFitCameraZ(
  orbits: OrbitConfig[],
  fov: number,
  cameraY: number,
  padding = 1.1
): number {
  const aspect = window.innerWidth / window.innerHeight || 1
  const hFovHalf = Math.atan(aspect * Math.tan((fov * Math.PI) / 360))
  const maxExtent = Math.max(...orbits.map((o) => o.radius)) + ORB_RADIUS
  const requiredDist = (maxExtent * padding) / Math.tan(hFovHalf)
  return Math.sqrt(Math.max(1, requiredDist * requiredDist - cameraY * cameraY))
}

interface AtomSceneProps {
  orbitPaused?: boolean
  isMobile?: boolean
  onFocusChange?: (focused: boolean) => void
}

export function AtomScene({ orbitPaused = false, isMobile = false, onFocusChange }: AtomSceneProps) {
  const orbits = isMobile ? ORBITS_MOBILE : ORBITS_DESKTOP
  const cameraFov = isMobile ? 60 : 50
  const cameraZ = isMobile
    ? computeFitCameraZ(orbits, cameraFov, CAMERA_Y)
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

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-6, -3, -8]} intensity={0.4} color="#b967ff" />

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
              />
            )
          })}
        </group>
      ))}

      {/* Camera animation controller */}
      <CameraController
        phase={focusPhase}
        targetRef={focusTargetRef}
        controlsRef={controlsRef}
        onFocusComplete={handleFocusComplete}
        onUnfocusComplete={handleUnfocusComplete}
        isMobile={isMobile}
      />

      {/* Controls — Y-axis rotation only (polar angle locked) */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={isMobile ? 18 : 14}
        minPolarAngle={polarAngle}
        maxPolarAngle={polarAngle}
        autoRotate={!orbitPaused && focusPhase === 'idle'}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
