import type { FaceAction } from '../store/useCVStore'

/**
 * Face landmark indices (MediaPipe FaceLandmarker convention):
 * Uses blendshapes from FaceLandmarker for reliable action detection
 * rather than raw landmark positions.
 */

interface Blendshape {
  categoryName: string
  score: number
}

const BLINK_THRESHOLD = 0.4
const SMILE_THRESHOLD = 0.5
const WINK_THRESHOLD = 0.4
const WINK_OPEN_THRESHOLD = 0.2

/**
 * Detect face action from FaceLandmarker blendshapes.
 * Blendshapes provide calibrated 0-1 scores for facial expressions.
 */
export function detectFaceAction(blendshapes: Blendshape[]): FaceAction {
  if (blendshapes.length === 0) return 'none'

  const scores = new Map(blendshapes.map((b) => [b.categoryName, b.score]))

  const eyeBlinkLeft = scores.get('eyeBlinkLeft') ?? 0
  const eyeBlinkRight = scores.get('eyeBlinkRight') ?? 0
  const mouthSmileLeft = scores.get('mouthSmileLeft') ?? 0
  const mouthSmileRight = scores.get('mouthSmileRight') ?? 0

  // Smile: both corners up
  const smileScore = (mouthSmileLeft + mouthSmileRight) / 2
  if (smileScore > SMILE_THRESHOLD) return 'smile'

  // Both eyes blink
  if (eyeBlinkLeft > BLINK_THRESHOLD && eyeBlinkRight > BLINK_THRESHOLD) {
    return 'blink'
  }

  // Left wink: left eye closed, right open
  if (eyeBlinkLeft > WINK_THRESHOLD && eyeBlinkRight < WINK_OPEN_THRESHOLD) {
    return 'wink-left'
  }

  // Right wink: right eye closed, left open
  if (eyeBlinkRight > WINK_THRESHOLD && eyeBlinkLeft < WINK_OPEN_THRESHOLD) {
    return 'wink-right'
  }

  return 'none'
}
