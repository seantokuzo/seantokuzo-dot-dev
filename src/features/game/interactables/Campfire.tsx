import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Interactable } from './Interactable'

const EMBER_COUNT = 12
const FLAME_COUNT = 5

export function Campfire() {
  const embersRef = useRef<THREE.InstancedMesh>(null)
  const flamesRef = useRef<THREE.Group>(null)

  // Preallocate ember matrices + random seeds
  const emberSeeds = useMemo(
    () => Array.from({ length: EMBER_COUNT }, (_, i) => ({
      angle: (i / EMBER_COUNT) * Math.PI * 2,
      speed: 0.8 + Math.random() * 1.2,
      radius: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    })),
    []
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Animate embers (floating sparks)
    if (embersRef.current) {
      for (let i = 0; i < EMBER_COUNT; i++) {
        const seed = emberSeeds[i]
        const y = ((t * seed.speed + seed.phase) % 2) * 0.8
        const x = Math.sin(seed.angle + t * 0.5) * seed.radius
        const z = Math.cos(seed.angle + t * 0.5) * seed.radius
        dummy.position.set(x, 0.4 + y, z)
        dummy.scale.setScalar(0.02 * (1 - y / 1.6))
        dummy.updateMatrix()
        embersRef.current.setMatrixAt(i, dummy.matrix)
      }
      embersRef.current.instanceMatrix.needsUpdate = true
    }

    // Animate flame scale
    if (flamesRef.current) {
      flamesRef.current.children.forEach((flame, i) => {
        const flicker = Math.sin(t * 8 + i * 1.5) * 0.15 + 1
        flame.scale.set(flicker, flicker * 1.1, flicker)
      })
    }
  })

  return (
    <Interactable id="campfire" position={[-5, 0, 0]} sensorSize={[2.5, 2, 2.5]}>
      {/* Log ring */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.35, 0.08, Math.sin(a) * 0.35]}
            rotation={[0, a + 0.3, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.07, 0.5, 6]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.95} />
          </mesh>
        )
      })}

      {/* Flame cones */}
      <group ref={flamesRef}>
        {Array.from({ length: FLAME_COUNT }, (_, i) => {
          const a = (i / FLAME_COUNT) * Math.PI * 2
          const r = 0.08
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * r, 0.3, Math.sin(a) * r]}
            >
              <coneGeometry args={[0.08, 0.5, 6]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#e63946' : '#f4845f'}
                emissive={i % 2 === 0 ? '#e63946' : '#f4845f'}
                emissiveIntensity={1.5}
                transparent
                opacity={0.85}
              />
            </mesh>
          )
        })}
      </group>

      {/* Floating embers */}
      <instancedMesh ref={embersRef} args={[undefined, undefined, EMBER_COUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#f9c74f" />
      </instancedMesh>

      {/* Fire light */}
      <pointLight
        position={[0, 0.6, 0]}
        color="#e63946"
        intensity={3}
        distance={8}
        decay={2}
      />
    </Interactable>
  )
}
