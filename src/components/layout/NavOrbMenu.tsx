import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useNavigate, useLocation } from 'react-router'
import * as THREE from 'three'
import { SIMPLEX_NOISE_3D } from '../../features/atom/noiseGlsl'
import styles from './Nav.module.css'

export type OrbMenuPhase = 'closed' | 'entering' | 'open' | 'exiting'

const NAV_ITEMS = [
  { to: '/', label: 'Home', color: '#c084fc' },
  { to: '/projects', label: 'Projects', color: '#818cf8' },
  { to: '/about', label: 'About', color: '#a78bfa' },
]

// Camera constants
const CAMERA_FOV = 50
const CAMERA_Z = 5

// Label dimensions in 3D units (approximate)
const LABEL_GAP = 0.25
const LABEL_TEXT_3D = 0.12

// Frustum-derived layout — scales with item count
const VISIBLE_HEIGHT = 2 * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180)) * CAMERA_Z
const USABLE_HEIGHT = VISIBLE_HEIGHT * 0.85
const SLOT_HEIGHT = USABLE_HEIGHT / NAV_ITEMS.length
// Radius: sphere diameter + label must fit in slot, /2.4 leaves ~17% gap between units
const ORB_RADIUS = Math.min(Math.max((SLOT_HEIGHT - LABEL_GAP - LABEL_TEXT_3D) / 2.4, 0.15), 0.65)
const LABEL_OFFSET = -(ORB_RADIUS + LABEL_GAP)
// Nudge all orbs up so each orb+label unit is visually centered in its slot
const LABEL_NUDGE = (LABEL_GAP + LABEL_TEXT_3D) / 2

function createOrbMaterial(
  color: string,
  shaderRef: React.MutableRefObject<{ uniforms: Record<string, { value: number }> } | null>
) {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.6,
  })

  const id = THREE.MathUtils.generateUUID()
  mat.customProgramCacheKey = () => id

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDisplaceAmp = { value: 0.03 }
    shader.uniforms.uTime = { value: 0 }

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `
      uniform float uDisplaceAmp;
      uniform float uTime;
      ${SIMPLEX_NOISE_3D}
      void main() {
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      /* glsl */ `
      #include <begin_vertex>
      float dn = snoise(transformed * 8.0 + uTime * 2.5);
      transformed += normal * dn * uDisplaceAmp;
      `
    )

    shaderRef.current = shader
  }

  return mat
}

function NavOrb({
  position,
  color,
  label,
  isActive,
  onClick,
}: {
  position: [number, number, number]
  color: string
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const shaderRef = useRef<{ uniforms: Record<string, { value: number }> } | null>(null)
  const [hovered, setHovered] = useState(false)
  const displaceRef = useRef(0.03)

  const matRef = useRef<THREE.MeshStandardMaterial | null>(null)
  if (!matRef.current) {
    matRef.current = createOrbMaterial(color, shaderRef)
  }

  useEffect(() => {
    const mat = matRef.current
    return () => {
      mat?.dispose()
      document.body.style.cursor = 'auto'
    }
  }, [])

  useFrame((state, delta) => {
    const targetDisp = hovered ? 0.1 : isActive ? 0.05 : 0.03
    displaceRef.current += (targetDisp - displaceRef.current) * 6 * Math.min(delta, 0.05)

    if (shaderRef.current) {
      shaderRef.current.uniforms.uDisplaceAmp.value = displaceRef.current
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }

    if (matRef.current) {
      matRef.current.emissiveIntensity = hovered ? 1.0 : isActive ? 0.6 : 0.3
    }
  })

  return (
    <group position={position}>
      <mesh
        material={matRef.current!}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[ORB_RADIUS, 24, 24]} />
      </mesh>

      <Html position={[0, LABEL_OFFSET, 0]} center>
        <span
          className={`${styles.orbLabel} ${isActive ? styles.orbLabelActive : ''}`}
          style={{ color }}
        >
          {label}
        </span>
      </Html>
    </group>
  )
}

interface NavOrbMenuProps {
  phase: OrbMenuPhase
  onTransitionEnd: () => void
  onNavigate: () => void
}

export function NavOrbMenu({ phase, onTransitionEnd, onNavigate }: NavOrbMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()

  if (phase === 'closed') return null

  const containerClass = `${styles.orbMenu} ${
    phase === 'open' ? styles.orbMenuOpen : phase === 'exiting' ? styles.orbMenuExiting : ''
  }`

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return
    onTransitionEnd()
  }

  return (
    <>
      <div className={styles.orbBackdrop} onClick={onNavigate} />
      <div
        className={containerClass}
        onTransitionEnd={handleTransitionEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <Canvas
          camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          onPointerMissed={onNavigate}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 0, 3]} intensity={0.8} color="#b967ff" />

          {NAV_ITEMS.map((item, i) => {
            const y = ((NAV_ITEMS.length - 1) / 2 - i) * SLOT_HEIGHT + LABEL_NUDGE
            return (
              <NavOrb
                key={item.to}
                position={[0, y, 0]}
                color={item.color}
                label={item.label}
                isActive={
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to)
                }
                onClick={() => {
                  navigate(item.to)
                  onNavigate()
                }}
              />
            )
          })}
        </Canvas>
      </div>
    </>
  )
}
