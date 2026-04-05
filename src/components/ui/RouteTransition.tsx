import { useState, useRef, useEffect, useCallback, type AnimationEvent } from 'react'
import { useLocation, useOutlet } from 'react-router'
import styles from './RouteTransition.module.css'

type TransitionPhase = 'idle' | 'exiting' | 'entering'

/**
 * Animated route transitions with enter/exit CSS animations.
 * Keeps old route content mounted during exit, then swaps to new content.
 * Uses useOutlet() internally — do not wrap with <Outlet />.
 */
export function RouteTransition() {
  const location = useLocation()
  const currentOutlet = useOutlet()

  const [phase, setPhase] = useState<TransitionPhase>('entering')
  const [frozenOutlet, setFrozenOutlet] = useState(currentOutlet)
  const prevPathRef = useRef(location.pathname)

  // Detect route changes → start exit; keep outlet in sync when idle
  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname
      setPhase('exiting')
    } else if (phase === 'idle') {
      setFrozenOutlet(currentOutlet)
    }
  }, [location.pathname, currentOutlet, phase])

  const handleAnimationEnd = useCallback(
    (e: AnimationEvent) => {
      // Ignore bubbled animation events from descendants
      if (e.target !== e.currentTarget) return

      if (phase === 'exiting') {
        setFrozenOutlet(currentOutlet)
        setPhase('entering')
      } else if (phase === 'entering') {
        setPhase('idle')
      }
    },
    [phase, currentOutlet]
  )

  const phaseClass =
    phase === 'exiting'
      ? styles.exiting
      : phase === 'entering'
        ? styles.entering
        : ''

  return (
    <div
      className={`${styles.transition} ${phaseClass}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {frozenOutlet}
    </div>
  )
}
