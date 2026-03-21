import { useCVStore } from '../store/useCVStore'
import { detectGesture, resetGestureState } from './gestureDetection'
import type { Gesture } from '../store/useCVStore'

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandLandmarkerInstance = any

export class HandTracker {
  private landmarker: HandLandmarkerInstance = null
  private lastGesture: Gesture = 'none'

  async init(): Promise<void> {
    // Dynamic import to avoid Vite build issues with malformed exports
    const { FilesetResolver, HandLandmarker } = await import(
      /* @vite-ignore */ '@mediapipe/tasks-vision'
    )
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.33/wasm'
    )
    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })
  }

  /**
   * Process a single video frame and return landmarks for overlay drawing.
   * Call at 15fps.
   */
  detectWithLandmarks(
    video: HTMLVideoElement,
    timestamp: number
  ): { x: number; y: number; z: number }[][] {
    if (!this.landmarker) return []

    const result = this.landmarker.detectForVideo(video, timestamp)

    if (result.landmarks && result.landmarks.length > 0) {
      const gesture = detectGesture(result.landmarks[0])
      if (gesture !== this.lastGesture) {
        this.lastGesture = gesture
        useCVStore.getState().setGesture(gesture)
      }
      return result.landmarks
    }

    if (this.lastGesture !== 'none') {
      this.lastGesture = 'none'
      useCVStore.getState().setGesture('none')
    }
    return []
  }

  dispose(): void {
    this.landmarker?.close()
    this.landmarker = null
    this.lastGesture = 'none'
    resetGestureState()
  }
}
