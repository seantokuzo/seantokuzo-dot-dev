import { useState, useRef, useEffect, useCallback } from 'react'
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

  // Detect route changes and start exit transition
  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname
      setPhase('exiting')
    }
  }, [location.pathname])

  // Keep outlet in sync when not mid-transition
  useEffect(() => {
    if (phase === 'idle') {
      setFrozenOutlet(currentOutlet)
    }
  }, [currentOutlet, phase])

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
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
