import { useCVStore } from '../store/useCVStore'
import { detectFaceAction } from './faceActionDetection'
import type { FaceAction } from '../store/useCVStore'

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FaceLandmarkerInstance = any

export class FaceTracker {
  private landmarker: FaceLandmarkerInstance = null
  private lastAction: FaceAction = 'none'

  async init(): Promise<void> {
    // Dynamic import to avoid Vite build issues with malformed exports
    const { FilesetResolver, FaceLandmarker } = await import(
      /* @vite-ignore */ '@mediapipe/tasks-vision'
    )
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
    )
    this.landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: true,
      minFaceDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })
  }

  /**
   * Process a single video frame. Call at 10fps.
   */
  detect(video: HTMLVideoElement, timestamp: number): void {
    if (!this.landmarker) return

    const result = this.landmarker.detectForVideo(video, timestamp)

    if (result.faceBlendshapes && result.faceBlendshapes.length > 0) {
      const action = detectFaceAction(result.faceBlendshapes[0].categories)
      if (action !== this.lastAction) {
        this.lastAction = action
        useCVStore.getState().setFaceAction(action)
      }
    } else if (this.lastAction !== 'none') {
      this.lastAction = 'none'
      useCVStore.getState().setFaceAction('none')
    }
  }

  dispose(): void {
    this.landmarker?.close()
    this.landmarker = null
    this.lastAction = 'none'
  }
}
