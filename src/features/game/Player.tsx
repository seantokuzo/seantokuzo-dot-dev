import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { touchInput } from './touchInput'
import { useGameStore } from '../../store/useGameStore'

const MOVE_SPEED = 5
const CAMERA_OFFSET = new THREE.Vector3(0, 8, 15)
const CAMERA_LOOK_OFFSET = new THREE.Vector3(0, 1, 0)

// Preallocated vectors to avoid GC pressure in frame loop
const _targetCameraPos = new THREE.Vector3()
const _targetLookAt = new THREE.Vector3()

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const { camera } = useThree()
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  // Keyboard listeners
  useEffect(() => {
    const isEditable = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.right = true
          break
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          if (!isEditable(e)) e.preventDefault()
          keysRef.current.right = false
          break
      }
    }

    const onInteract = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const nearby = useGameStore.getState().nearbyInteractable
        if (nearby) {
          useGameStore.getState().openOverlay(nearby)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('keydown', onInteract)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('keydown', onInteract)
    }
  }, [])

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return

    const keys = keysRef.current
    const velocity = rigidBodyRef.current.linvel()

    // Movement direction — keyboard OR touch joystick
    let moveX = 0
    let moveZ = 0

    if (touchInput.x !== 0 || touchInput.z !== 0) {
      // Touch joystick (already normalized 0..1)
      moveX = touchInput.x
      moveZ = touchInput.z
    } else {
      // Keyboard
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
    }

    // Apply velocity — preserve Y for gravity, only wake on input
    const hasInput = moveX !== 0 || moveZ !== 0
    rigidBodyRef.current.setLinvel(
      { x: moveX * MOVE_SPEED, y: velocity.y, z: moveZ * MOVE_SPEED },
      hasInput
    )

    // Camera follow — reuse preallocated vectors
    const pos = rigidBodyRef.current.translation()
    _targetCameraPos.set(
      pos.x + CAMERA_OFFSET.x,
      pos.y + CAMERA_OFFSET.y,
      pos.z + CAMERA_OFFSET.z
    )
    _targetLookAt.set(
      pos.x + CAMERA_LOOK_OFFSET.x,
      pos.y + CAMERA_LOOK_OFFSET.y,
      pos.z + CAMERA_LOOK_OFFSET.z
    )

    camera.position.lerp(_targetCameraPos, 5 * delta)
    camera.lookAt(_targetLookAt)
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 2, 5]}
      enabledRotations={[false, false, false]}
      linearDamping={4}
      mass={1}
      colliders={false}
    >
      <CapsuleCollider args={[0.4, 0.3]} />
      <mesh castShadow>
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
