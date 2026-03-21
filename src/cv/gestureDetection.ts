import type { Gesture } from '../store/useCVStore'

/**
 * Hand landmark indices (MediaPipe convention):
 * 0: WRIST
 * 4: THUMB_TIP, 8: INDEX_TIP, 12: MIDDLE_TIP, 16: RING_TIP, 20: PINKY_TIP
 * 5: INDEX_MCP, 6: INDEX_PIP, 9: MIDDLE_MCP
 */

interface Point3D {
  x: number
  y: number
  z: number
}

const PINCH_THRESHOLD = 0.06
const SWIPE_VELOCITY_THRESHOLD = 0.15

let prevWristX = 0
let prevTimestamp = 0

function distance(a: Point3D, b: Point3D): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function isFingerExtended(tip: Point3D, pip: Point3D, mcp: Point3D): boolean {
  // Finger is extended if tip is further from wrist than PIP
  return tip.y < pip.y && tip.y < mcp.y
}

/**
 * Detect gesture from hand landmarks.
 * Only changes gesture when confidence is clear — avoids flickering.
 */
export function detectGesture(landmarks: Point3D[]): Gesture {
  if (landmarks.length < 21) return 'none'

  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]

  const indexPip = landmarks[6]
  const middlePip = landmarks[10]
  const ringPip = landmarks[14]
  const pinkyPip = landmarks[18]

  const indexMcp = landmarks[5]
  const middleMcp = landmarks[9]
  const ringMcp = landmarks[13]
  const pinkyMcp = landmarks[17]

  const wrist = landmarks[0]

  // Pinch: thumb tip close to index tip
  const pinchDist = distance(thumbTip, indexTip)
  if (pinchDist < PINCH_THRESHOLD) {
    return 'pinch'
  }

  // Check which fingers are extended
  const indexUp = isFingerExtended(indexTip, indexPip, indexMcp)
  const middleUp = isFingerExtended(middleTip, middlePip, middleMcp)
  const ringUp = isFingerExtended(ringTip, ringPip, ringMcp)
  const pinkyUp = isFingerExtended(pinkyTip, pinkyPip, pinkyMcp)

  // Open palm: all fingers extended
  if (indexUp && middleUp && ringUp && pinkyUp) {
    // Check for swipe via wrist velocity
    const now = performance.now()
    const dt = now - prevTimestamp
    if (dt > 0 && prevTimestamp > 0) {
      const velocity = (wrist.x - prevWristX) / (dt / 1000)
      prevWristX = wrist.x
      prevTimestamp = now

      if (velocity > SWIPE_VELOCITY_THRESHOLD) return 'swipe-right'
      if (velocity < -SWIPE_VELOCITY_THRESHOLD) return 'swipe-left'
    } else {
      prevWristX = wrist.x
      prevTimestamp = now
    }

    return 'open-palm'
  }

  // Point: only index extended
  if (indexUp && !middleUp && !ringUp && !pinkyUp) {
    prevWristX = wrist.x
    prevTimestamp = performance.now()
    return 'point'
  }

  prevWristX = wrist.x
  prevTimestamp = performance.now()
  return 'none'
}

/**
 * Reset tracking state (call when tracking stops).
 */
export function resetGestureState(): void {
  prevWristX = 0
  prevTimestamp = 0
}
