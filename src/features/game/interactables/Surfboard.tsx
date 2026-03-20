import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { Interactable } from './Interactable'

export function Surfboard() {
  const groupRef = useRef<Group>(null)

  // Gentle hover bob
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y =
      0.3 + Math.sin(state.clock.elapsedTime * 1.2) * 0.05
  })

  return (
    <Interactable id="surfboard" position={[8, 0, 6]} sensorSize={[2, 2, 2]}>
      <group ref={groupRef} rotation={[0.3, 0.4, 0.1]}>
        {/* Board body — elongated rounded shape */}
        <mesh castShadow>
          <capsuleGeometry args={[0.15, 1.8, 4, 12]} />
          <meshStandardMaterial color="#00b4d8" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Stripe */}
        <mesh position={[0, 0, 0.16]}>
          <capsuleGeometry args={[0.04, 1.4, 4, 8]} />
          <meshStandardMaterial color="#f9c74f" roughness={0.4} />
        </mesh>
        {/* Fin */}
        <mesh position={[0, -0.7, -0.1]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.06, 0.2, 4]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
        </mesh>
      </group>
    </Interactable>
  )
}
