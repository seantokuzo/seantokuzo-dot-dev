import { useEffect, useRef } from 'react'
import { useCVStore, type Gesture } from '../store/useCVStore'

interface GestureControlsOptions {
  onPauseOrbit?: (paused: boolean) => void
  onCycleShell?: (direction: 'next' | 'prev') => void
}

/**
 * Maps CV gestures to atom page actions.
 * Debounces rapid gesture changes to prevent flickering.
 */
export function useGestureControls(options: GestureControlsOptions): void {
  const gesture = useCVStore((s) => s.gesture)
  const isCVEnabled = useCVStore((s) => s.isCVEnabled)
  const lastGestureRef = useRef<Gesture>('none')
  const orbitPausedRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isCVEnabled) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (gesture === lastGestureRef.current) return
      lastGestureRef.current = gesture

      switch (gesture) {
        case 'open-palm':
          orbitPausedRef.current = true
          options.onPauseOrbit?.(true)
          break
        case 'swipe-left':
          options.onCycleShell?.('prev')
          break
        case 'swipe-right':
          options.onCycleShell?.('next')
          break
        case 'none':
          // Resume orbit when hand is removed, regardless of prior gesture
          if (orbitPausedRef.current) {
            orbitPausedRef.current = false
            options.onPauseOrbit?.(false)
          }
          break
      }
    }, 100)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [gesture, isCVEnabled, options])
}
