import { useRef, useCallback, useState } from 'react'
import { touchInput } from './touchInput'
import styles from './TouchControls.module.css'

const JOYSTICK_RADIUS = 60
const KNOB_MAX = 38 // max px the knob can travel from center
const DEADZONE = 0.15

export function TouchControls() {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeIdRef = useRef<number | null>(null)
  const centerRef = useRef({ x: 0, y: 0 })
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const updateInput = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - centerRef.current.x
    const dy = clientY - centerRef.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const clamped = Math.min(dist, JOYSTICK_RADIUS)
    const angle = Math.atan2(dy, dx)

    const clampedX = Math.cos(angle) * clamped
    const clampedY = Math.sin(angle) * clamped

    // Knob visual position (capped to visual max)
    const knobX = Math.cos(angle) * Math.min(clamped, KNOB_MAX)
    const knobY = Math.sin(angle) * Math.min(clamped, KNOB_MAX)
    setKnobOffset({ x: knobX, y: knobY })

    // Map to movement: x stays x, screen-y maps to z (forward/back)
    const inputX = (clampedX / JOYSTICK_RADIUS)
    const inputZ = (clampedY / JOYSTICK_RADIUS)

    touchInput.x = Math.abs(inputX) > DEADZONE ? inputX : 0
    touchInput.z = Math.abs(inputZ) > DEADZONE ? inputZ : 0
  }, [])

  const resetInput = useCallback(() => {
    touchInput.x = 0
    touchInput.z = 0
    setKnobOffset({ x: 0, y: 0 })
    setActive(false)
    activeIdRef.current = null
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
    setActive(true)
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
      aria-label="Movement joystick"
      role="application"
    >
      <div className={styles.joystick}>
        <div
          className={`${styles.knob} ${active ? styles.knobActive : ''}`}
          style={{
            transform: `translate(calc(-50% + ${knobOffset.x}px), calc(-50% + ${knobOffset.y}px))`,
          }}
        />
      </div>
    </div>
  )
}
