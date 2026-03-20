import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export function Ground() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color={new THREE.Color('#f5e6c8')}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </RigidBody>
  )
}
