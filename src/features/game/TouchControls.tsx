import { useRef, useCallback, useEffect } from 'react'
import { touchInput } from './touchInput'
import styles from './TouchControls.module.css'

const JOYSTICK_RADIUS = 60
const KNOB_MAX = 38 // max px the knob can travel from center
const DEADZONE = 0.15

export function TouchControls() {
  const containerRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const activeIdRef = useRef<number | null>(null)
  const centerRef = useRef({ x: 0, y: 0 })

  const resetInput = useCallback(() => {
    touchInput.x = 0
    touchInput.z = 0
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(-50%, -50%)'
      knobRef.current.classList.remove(styles.knobActive)
    }
    activeIdRef.current = null
  }, [])

  // Clean up on unmount so player doesn't keep moving
  useEffect(() => resetInput, [resetInput])

  const updateInput = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - centerRef.current.x
    const dy = clientY - centerRef.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const clamped = Math.min(dist, JOYSTICK_RADIUS)
    const angle = Math.atan2(dy, dx)

    const clampedX = Math.cos(angle) * clamped
    const clampedY = Math.sin(angle) * clamped

    // Knob visual position via ref (no React re-render)
    const knobX = Math.cos(angle) * Math.min(clamped, KNOB_MAX)
    const knobY = Math.sin(angle) * Math.min(clamped, KNOB_MAX)
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`
    }

    // Map to movement: x stays x, screen-y maps to z (forward/back)
    const inputX = clampedX / JOYSTICK_RADIUS
    const inputZ = clampedY / JOYSTICK_RADIUS

    touchInput.x = Math.abs(inputX) > DEADZONE ? inputX : 0
    touchInput.z = Math.abs(inputZ) > DEADZONE ? inputZ : 0
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (activeIdRef.current !== null) return
    activeIdRef.current = e.pointerId
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    const rect = containerRef.current!.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    knobRef.current?.classList.add(styles.knobActive)
    updateInput(e.clientX, e.clientY)
  }, [updateInput])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== activeIdRef.current) return
    updateInput(e.clientX, e.clientY)
  }, [updateInput])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== activeIdRef.current) return
    resetInput()
  }, [resetInput])

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
      aria-label="Movement joystick"
      role="group"
    >
      <div className={styles.joystick}>
        <div ref={knobRef} className={styles.knob} />
      </div>
    </div>
  )
}
