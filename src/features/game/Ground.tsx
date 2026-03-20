import { RigidBody, CuboidCollider } from '@react-three/rapier'

export function Ground() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[40, 0.1, 40]} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#f5e6c8"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </RigidBody>
  )
}
