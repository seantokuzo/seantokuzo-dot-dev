import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useCVStore } from '../store/useCVStore'
import styles from './CameraPreview.module.css'

const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 240

// MediaPipe hand connections for drawing skeleton
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
]

export interface CameraPreviewHandle {
  updateLandmarks: (landmarks: { x: number; y: number; z: number }[][]) => void
}

interface CameraPreviewProps {
  video: HTMLVideoElement | null
}

export const CameraPreview = forwardRef<CameraPreviewHandle, CameraPreviewProps>(
  function CameraPreview({ video }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const landmarksRef = useRef<{ x: number; y: number; z: number }[][]>([])
    const gesture = useCVStore((s) => s.gesture)
    const faceAction = useCVStore((s) => s.faceAction)

    useImperativeHandle(ref, () => ({
      updateLandmarks: (landmarks) => {
        landmarksRef.current = landmarks
      },
    }))

    // Draw loop
    useEffect(() => {
      if (!video || !canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let animId: number

      const draw = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        // Mirror video horizontally for selfie view
        ctx.save()
        ctx.scale(-1, 1)
        ctx.drawImage(video, -CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.restore()

        // Draw hand landmarks
        const landmarks = landmarksRef.current
        if (landmarks.length > 0) {
          for (const hand of landmarks) {
            ctx.strokeStyle = '#00f5d4'
            ctx.lineWidth = 2
            for (const [a, b] of HAND_CONNECTIONS) {
              if (hand[a] && hand[b]) {
                ctx.beginPath()
                ctx.moveTo(
                  CANVAS_WIDTH - hand[a].x * CANVAS_WIDTH,
                  hand[a].y * CANVAS_HEIGHT
                )
                ctx.lineTo(
                  CANVAS_WIDTH - hand[b].x * CANVAS_WIDTH,
                  hand[b].y * CANVAS_HEIGHT
                )
                ctx.stroke()
              }
            }

            ctx.fillStyle = '#00b4d8'
            for (const lm of hand) {
              ctx.beginPath()
              ctx.arc(
                CANVAS_WIDTH - lm.x * CANVAS_WIDTH,
                lm.y * CANVAS_HEIGHT,
                3,
                0,
                Math.PI * 2
              )
              ctx.fill()
            }
          }
        }

        animId = requestAnimationFrame(draw)
      }

      draw()
      return () => cancelAnimationFrame(animId)
    }, [video])

    const activeLabel = gesture !== 'none' ? gesture : faceAction !== 'none' ? faceAction : null

    return (
      <div className={styles.container}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={styles.canvas}
        />
        {activeLabel && <div className={styles.label}>{activeLabel}</div>}
      </div>
    )
  }
)
