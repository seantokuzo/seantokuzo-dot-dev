import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const MOVE_SPEED = 5
const CAMERA_OFFSET = new THREE.Vector3(0, 8, 15)
const CAMERA_LOOK_OFFSET = new THREE.Vector3(0, 1, 0)

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  // Keyboard listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = true
          break
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return

    const keys = keysRef.current
    const velocity = rigidBodyRef.current.linvel()

    // Movement direction
    let moveX = 0
    let moveZ = 0
    if (keys.forward) moveZ -= 1
    if (keys.backward) moveZ += 1
    if (keys.left) moveX -= 1
    if (keys.right) moveX += 1

    // Normalize diagonal movement
    if (moveX !== 0 && moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ)
      moveX /= len
      moveZ /= len
    }

    // Apply velocity — preserve Y for gravity
    rigidBodyRef.current.setLinvel(
      { x: moveX * MOVE_SPEED, y: velocity.y, z: moveZ * MOVE_SPEED },
      true
    )

    // Camera follow
    const pos = rigidBodyRef.current.translation()
    const targetCameraPos = new THREE.Vector3(
      pos.x + CAMERA_OFFSET.x,
      pos.y + CAMERA_OFFSET.y,
      pos.z + CAMERA_OFFSET.z
    )
    const targetLookAt = new THREE.Vector3(
      pos.x + CAMERA_LOOK_OFFSET.x,
      pos.y + CAMERA_LOOK_OFFSET.y,
      pos.z + CAMERA_LOOK_OFFSET.z
    )

    camera.position.lerp(targetCameraPos, 5 * delta)
    camera.lookAt(targetLookAt)
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 2, 5]}
      enabledRotations={[false, false, false]}
      linearDamping={4}
      mass={1}
      colliders="ball"
    >
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial
          color="#fefae0"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </RigidBody>
  )
}
