import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PalmTreeProps {
  position: [number, number, number]
  scale?: number
  lean?: number
}

function PalmTree({ position, scale = 1, lean = 0 }: PalmTreeProps) {
  const frondGroupRef = useRef<THREE.Group>(null)

  // Deterministic per-tree droop values — stable across re-renders
  const frondDroops = useMemo(
    () => {
      const seed = Math.abs(position[0] * 13 + position[2] * 7)
      return Array.from({ length: 7 }, (_, i) => -0.6 - (((i * 7 + seed) % 10) * 0.03))
    },
    [position]
  )

  // Gentle sway animation
  useFrame((state) => {
    if (!frondGroupRef.current) return
    const t = state.clock.elapsedTime
    frondGroupRef.current.rotation.z =
      lean + Math.sin(t * 0.5 + position[0]) * 0.03
    frondGroupRef.current.rotation.x =
      Math.sin(t * 0.4 + position[2]) * 0.02
  })

  const trunkHeight = 6 * scale
  const trunkCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(lean * 0.5, trunkHeight * 0.3, 0),
      new THREE.Vector3(lean * 1.2, trunkHeight * 0.7, 0),
      new THREE.Vector3(lean * 1.5, trunkHeight, 0),
    ])
    return new THREE.TubeGeometry(curve, 12, 0.12 * scale, 6, false)
  }, [lean, trunkHeight, scale])

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh geometry={trunkCurve} castShadow>
        <meshStandardMaterial color="#8B6914" roughness={0.95} metalness={0} />
      </mesh>

      {/* Fronds cluster at top */}
      <group
        ref={frondGroupRef}
        position={[lean * 1.5, trunkHeight, 0]}
      >
        {frondDroops.map((droop, i) => {
          const angle = (i / 7) * Math.PI * 2
          return (
            <mesh
              key={i}
              rotation={[droop, angle, 0]}
              castShadow
            >
              <planeGeometry args={[0.5 * scale, 3 * scale]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#2d6a4f' : '#40916c'}
                side={THREE.DoubleSide}
                roughness={0.8}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// Predefined palm tree positions along the beach
const PALM_POSITIONS: PalmTreeProps[] = [
  { position: [-15, 0, -5], scale: 1.1, lean: 0.3 },
  { position: [-10, 0, -3], scale: 0.9, lean: -0.2 },
  { position: [-6, 0, -6], scale: 1.0, lean: 0.15 },
  { position: [2, 0, -4], scale: 1.2, lean: -0.25 },
  { position: [8, 0, -7], scale: 0.85, lean: 0.35 },
  { position: [14, 0, -5], scale: 1.05, lean: -0.1 },
  { position: [20, 0, -3], scale: 0.95, lean: 0.2 },
  { position: [-20, 0, -8], scale: 1.15, lean: -0.3 },
  { position: [25, 0, -6], scale: 0.9, lean: 0.15 },
  { position: [-3, 0, -9], scale: 1.0, lean: -0.15 },
  { position: [12, 0, -10], scale: 1.1, lean: 0.25 },
  { position: [-18, 0, -12], scale: 0.95, lean: -0.2 },
]

export function PalmTrees() {
  return (
    <group>
      {PALM_POSITIONS.map((props, i) => (
        <PalmTree key={i} {...props} />
      ))}
    </group>
  )
}
