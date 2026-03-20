import { useMemo } from 'react'
import { useIsMobile } from './useMediaQuery'
import type { QualityTier } from '../store/useAppStore'

interface DeviceCapabilities {
  hasWebGL2: boolean
  hasCamera: boolean
  isMobile: boolean
  isTouch: boolean
  qualityTier: QualityTier
  devicePixelRatio: number
}

function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    return gl !== null
  } catch {
    return false
  }
}

function detectCamera(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

function detectTouch(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function determineQualityTier(isMobile: boolean, hasWebGL2: boolean): QualityTier {
  if (!hasWebGL2) return 'low'
  if (isMobile) return 'medium'

  const cores = navigator.hardwareConcurrency || 2
  if (cores >= 8 && window.devicePixelRatio <= 2) return 'high'
  if (cores >= 4) return 'medium'
  return 'low'
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const isMobile = useIsMobile()

  return useMemo(() => {
    const hasWebGL2 = detectWebGL2()
    return {
      hasWebGL2,
      hasCamera: detectCamera(),
      isMobile,
      isTouch: detectTouch(),
      qualityTier: determineQualityTier(isMobile, hasWebGL2),
      devicePixelRatio: window.devicePixelRatio || 1,
    }
  }, [isMobile])
}
