import type { ReactNode } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGameStore, type InteractableId } from '../../../store/useGameStore'

interface InteractableProps {
  id: InteractableId
  position: [number, number, number]
  sensorSize?: [number, number, number]
  children: ReactNode
}

export function Interactable({
  id,
  position,
  sensorSize = [2, 2, 2],
  children,
}: InteractableProps) {
  const setNearby = useGameStore((s) => s.setNearbyInteractable)

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      {/* Visual mesh — no physics collision */}
      {children}

      {/* Proximity sensor — triggers interaction prompt */}
      <CuboidCollider
        args={sensorSize}
        sensor
        onIntersectionEnter={() => setNearby(id)}
        onIntersectionExit={() =>
          useGameStore.setState((s) =>
            s.nearbyInteractable === id ? { nearbyInteractable: null } : s
          )
        }
      />
    </RigidBody>
  )
}
