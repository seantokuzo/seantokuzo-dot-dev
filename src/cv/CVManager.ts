import { HandTracker } from './HandTracker'
import { FaceTracker } from './FaceTracker'
import { useCVStore } from '../store/useCVStore'

const HAND_INTERVAL = 1000 / 15  // 15fps
const CAMERA_WIDTH = 320
const CAMERA_HEIGHT = 240

type FrameCallback = (landmarks: { x: number; y: number; z: number }[][]) => void

/**
 * Manages camera, hand and face trackers.
 * Ensures hand and face never process in the same frame.
 */
export class CVManager {
  private handTracker = new HandTracker()
  private faceTracker = new FaceTracker()
  private stream: MediaStream | null = null
  private video: HTMLVideoElement | null = null
  private handTimer: ReturnType<typeof setInterval> | null = null
  private faceTimer: ReturnType<typeof setInterval> | null = null
  private onFrame: FrameCallback | null = null

  /**
   * Initialize models (can be slow — downloads WASM + model files).
   */
  async init(): Promise<void> {
    await Promise.all([
      this.handTracker.init(),
      this.faceTracker.init(),
    ])
  }

  /**
   * Request camera permission and start video stream.
   */
  async startCamera(): Promise<HTMLVideoElement> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: CAMERA_WIDTH },
        height: { ideal: CAMERA_HEIGHT },
        facingMode: 'user',
      },
      audio: false,
    })

    this.stream = stream
    useCVStore.getState().setCameraPermission(true)

    const video = document.createElement('video')
    video.srcObject = stream
    video.setAttribute('playsinline', '')
    video.muted = true
    video.width = CAMERA_WIDTH
    video.height = CAMERA_HEIGHT
    await video.play()

    this.video = video
    return video
  }

  /**
   * Start processing frames. Alternates between hand and face detection.
   * Callback receives hand landmarks for overlay drawing.
   */
  startTracking(onFrame?: FrameCallback): void {
    if (!this.video) return
    this.onFrame = onFrame ?? null

    let isHandFrame = true

    // Interleaved scheduling: hand frames at 15fps, face frames at 10fps
    // Never both in same frame — use a single timer at hand rate,
    // process face every ~3rd frame (15/10 ≈ 1.5, so every other)
    let frameCount = 0

    this.handTimer = setInterval(() => {
      if (!this.video || this.video.readyState < 2) return

      const timestamp = performance.now()

      if (isHandFrame) {
        // Hand detection + get landmarks for drawing
        const landmarks = this.handTracker.detectWithLandmarks(
          this.video!,
          timestamp
        )
        if (this.onFrame) this.onFrame(landmarks)
      } else {
        // Face detection (no visual overlay needed)
        this.faceTracker.detect(this.video!, timestamp)
      }

      frameCount++
      // Process face roughly every 3rd frame to achieve ~10fps from 15fps timer
      isHandFrame = frameCount % 3 !== 0
    }, HAND_INTERVAL)
  }

  /**
   * Stop tracking but keep camera alive.
   */
  stopTracking(): void {
    if (this.handTimer) {
      clearInterval(this.handTimer)
      this.handTimer = null
    }
    if (this.faceTimer) {
      clearInterval(this.faceTimer)
      this.faceTimer = null
    }
    this.onFrame = null
    useCVStore.getState().setGesture('none')
    useCVStore.getState().setFaceAction('none')
  }

  /**
   * Stop everything and release camera.
   */
  dispose(): void {
    this.stopTracking()
    this.handTracker.dispose()
    this.faceTracker.dispose()

    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop())
      this.stream = null
    }
    if (this.video) {
      this.video.srcObject = null
      this.video = null
    }

    useCVStore.getState().setCVEnabled(false)
    useCVStore.getState().setCameraPermission(false)
  }

  getVideo(): HTMLVideoElement | null {
    return this.video
  }
}
