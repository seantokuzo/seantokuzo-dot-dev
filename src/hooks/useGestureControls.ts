import { useEffect, useRef } from 'react'
import { useCVStore, type Gesture } from '../store/useCVStore'
import type { Project } from '../data/projects'

interface GestureControlsOptions {
  onSelectProject?: (project: Project | null) => void
  onPauseOrbit?: (paused: boolean) => void
  onCycleShell?: (direction: 'next' | 'prev') => void
  onPointMove?: (x: number, y: number) => void
}

/**
 * Maps CV gestures to atom page actions.
 * Debounces rapid gesture changes to prevent flickering.
 */
export function useGestureControls(options: GestureControlsOptions): void {
  const gesture = useCVStore((s) => s.gesture)
  const isCVEnabled = useCVStore((s) => s.isCVEnabled)
  const lastGestureRef = useRef<Gesture>('none')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isCVEnabled) return

    // Debounce gesture changes — require 100ms stability
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (gesture === lastGestureRef.current) return
      const prev = lastGestureRef.current
      lastGestureRef.current = gesture

      switch (gesture) {
        case 'open-palm':
          options.onPauseOrbit?.(true)
          break
        case 'swipe-left':
          options.onCycleShell?.('prev')
          break
        case 'swipe-right':
          options.onCycleShell?.('next')
          break
        case 'none':
          // Resume orbit when hand is removed after open-palm
          if (prev === 'open-palm') {
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
