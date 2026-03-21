import { HandTracker } from './HandTracker'
import { FaceTracker } from './FaceTracker'
import { useCVStore } from '../store/useCVStore'

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
  private timer: ReturnType<typeof setInterval> | null = null
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
  /**
   * Start processing frames at 25fps total tick rate.
   * Hand runs 3 of every 5 ticks (~15fps), face runs 2 of every 5 ticks (~10fps).
   * Never both in the same frame.
   */
  startTracking(onFrame?: FrameCallback): void {
    if (!this.video) return
    this.onFrame = onFrame ?? null

    // 25fps tick rate = 40ms interval
    // Pattern over 5 ticks: H, H, F, H, F → 3 hand (15fps) + 2 face (10fps)
    const TICK_INTERVAL = 1000 / 25
    const pattern: ('hand' | 'face')[] = ['hand', 'hand', 'face', 'hand', 'face']
    let tickCount = 0

    this.timer = setInterval(() => {
      if (!this.video || this.video.readyState < 2) return

      const timestamp = performance.now()
      const mode = pattern[tickCount % pattern.length]

      if (mode === 'hand') {
        const landmarks = this.handTracker.detectWithLandmarks(
          this.video!,
          timestamp
        )
        if (this.onFrame) this.onFrame(landmarks)
      } else {
        this.faceTracker.detect(this.video!, timestamp)
      }

      tickCount++
    }, TICK_INTERVAL)
  }

  /**
   * Stop tracking but keep camera alive.
   */
  stopTracking(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
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
