import { create } from 'zustand'

export type ControlMode = 'mouse' | 'gesture' | 'keyboard' | 'touch'
export type QualityTier = 'high' | 'medium' | 'low'

interface AppState {
  isLoading: boolean
  qualityTier: QualityTier
  controlMode: ControlMode

  setLoading: (loading: boolean) => void
  setQualityTier: (tier: QualityTier) => void
  setControlMode: (mode: ControlMode) => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  qualityTier: 'high',
  controlMode: 'mouse',

  setLoading: (isLoading) => set({ isLoading }),
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setControlMode: (controlMode) => set({ controlMode }),
}))
