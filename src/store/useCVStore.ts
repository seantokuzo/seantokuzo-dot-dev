import { create } from 'zustand'

export type Gesture = 'none' | 'pinch' | 'point' | 'swipe-left' | 'swipe-right' | 'open-palm'
export type FaceAction = 'none' | 'blink' | 'wink-left' | 'wink-right' | 'smile'

interface CVState {
  gesture: Gesture
  faceAction: FaceAction
  isCVEnabled: boolean
  hasCameraPermission: boolean

  setGesture: (gesture: Gesture) => void
  setFaceAction: (action: FaceAction) => void
  setCVEnabled: (enabled: boolean) => void
  setCameraPermission: (granted: boolean) => void
}

export const useCVStore = create<CVState>((set) => ({
  gesture: 'none',
  faceAction: 'none',
  isCVEnabled: false,
  hasCameraPermission: false,

  setGesture: (gesture) => set({ gesture }),
  setFaceAction: (faceAction) => set({ faceAction }),
  setCVEnabled: (isCVEnabled) => set({ isCVEnabled }),
  setCameraPermission: (hasCameraPermission) => set({ hasCameraPermission }),
}))
