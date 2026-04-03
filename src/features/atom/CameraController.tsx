import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type FocusPhase = 'idle' | 'focusing' | 'focused' | 'card-exit' | 'unfocusing'

interface CameraControllerProps {
  phase: FocusPhase
  targetRef: React.MutableRefObject<THREE.Vector3>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.MutableRefObject<any>
  onFocusComplete: () => void
  onUnfocusComplete: () => void
  isMobile?: boolean
}

// Camera sits behind the electron (radially outward from nucleus)
const FOCUS_OFFSET = 1.0
const FOCUS_OFFSET_MOBILE = 1.5
const FOCUS_HEIGHT = 0.4
// On mobile, look below the electron so it sits in the upper third of the screen
const MOBILE_LOOK_BELOW = 0.25

// Base lerp speeds — modulated by smoothstep ease-in ramp
// desiredPos velocity ≈ orbit_v * (1 + FOCUS_OFFSET / orbit_r) — up to ~1.36 u/s
// Steady-state error = desiredPos_velocity / lerp_speed, must be < ARRIVE_THRESHOLD
const LERP_FOCUS = 10
const LERP_TRACK = 12
const LERP_RETURN = 3

// Ease-in ramp duration (seconds) — camera gradually accelerates from 0
const EASE_IN_FOCUS = 0.7
const EASE_IN_RETURN = 0.4

const ARRIVE_THRESHOLD = 0.15

function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x))
  return t * t * (3 - 2 * t)
}

export function CameraController({
  phase,
  targetRef,
  controlsRef,
  onFocusComplete,
  onUnfocusComplete,
  isMobile = false,
}: CameraControllerProps) {
  const { camera } = useThree()

  // Working vectors — reused each frame to avoid GC
  const lookAtPos = useRef(new THREE.Vector3())
  const savedCamPos = useRef(new THREE.Vector3())
  const savedCtrlTarget = useRef(new THREE.Vector3())
  const desiredPos = useRef(new THREE.Vector3())
  const dirVec = useRef(new THREE.Vector3())
  const lookTargetVec = useRef(new THREE.Vector3())

  // Animation timing for ease-in ramp
  const phaseStartTime = useRef(-1)

  // Snapshot camera + controls state when zoom begins so we can return to it
  useEffect(() => {
    if (phase === 'focusing') {
      savedCamPos.current.copy(camera.position)
      if (controlsRef.current) {
        savedCtrlTarget.current.copy(controlsRef.current.target)
      }
      lookAtPos.current.copy(savedCtrlTarget.current)
    }
    // Reset animation timer for new phases
    if (phase === 'focusing' || phase === 'unfocusing') {
      phaseStartTime.current = -1
    }
  }, [phase, camera, controlsRef])

  useFrame((state, delta) => {
    if (phase === 'idle') return
    const dt = Math.min(delta, 0.05)

    // Initialize start time on first frame of animation
    if (phaseStartTime.current < 0) {
      phaseStartTime.current = state.clock.elapsedTime
    }
    const elapsed = state.clock.elapsedTime - phaseStartTime.current

    if (phase === 'focusing' || phase === 'focused' || phase === 'card-exit') {
      const orbPos = targetRef.current
      const focusOffset = isMobile ? FOCUS_OFFSET_MOBILE : FOCUS_OFFSET

      // Desired position: behind the electron, offset radially outward from nucleus
      dirVec.current.copy(orbPos).normalize()
      desiredPos.current.copy(orbPos).addScaledVector(dirVec.current, focusOffset)
      desiredPos.current.y += FOCUS_HEIGHT

      // Ease-in ramp: speed starts at 0 and smoothly ramps to full
      const ramp = phase === 'focusing' ? smoothstep(elapsed / EASE_IN_FOCUS) : 1
      const speed = (phase === 'focusing' ? LERP_FOCUS : LERP_TRACK) * ramp
      camera.position.lerp(desiredPos.current, speed * dt)

      // On mobile, look below the electron to shift it into the upper third
      if (isMobile) {
        lookTargetVec.current.copy(orbPos)
        lookTargetVec.current.y -= MOBILE_LOOK_BELOW
        lookAtPos.current.lerp(lookTargetVec.current, speed * dt)
      } else {
        lookAtPos.current.lerp(orbPos, speed * dt)
      }
      camera.lookAt(lookAtPos.current)

      if (phase === 'focusing') {
        if (camera.position.distanceTo(desiredPos.current) < ARRIVE_THRESHOLD) {
          onFocusComplete()
        }
      }
    } else if (phase === 'unfocusing') {
      // Ease-in ramp for smooth start on the return journey
      const ramp = smoothstep(elapsed / EASE_IN_RETURN)
      const speed = LERP_RETURN * ramp
      camera.position.lerp(savedCamPos.current, speed * dt)
      lookAtPos.current.lerp(savedCtrlTarget.current, speed * dt)
      camera.lookAt(lookAtPos.current)

      if (camera.position.distanceTo(savedCamPos.current) < ARRIVE_THRESHOLD) {
        // Re-enable OrbitControls synced to saved state
        if (controlsRef.current) {
          controlsRef.current.target.copy(savedCtrlTarget.current)
          controlsRef.current.enabled = true
          controlsRef.current.update()
        }
        onUnfocusComplete()
      }
    }
  })

  return null
}
