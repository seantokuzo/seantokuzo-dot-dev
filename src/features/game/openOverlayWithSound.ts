import { useGameStore, type InteractableId } from '../../store/useGameStore'
import { playInteract } from '../../utils/soundManager'

/**
 * Opens an interaction overlay AND plays the interact sound.
 * Call from user-gesture contexts (keydown, click) so AudioContext is allowed.
 */
export function openOverlayWithSound(id: InteractableId): void {
  playInteract()
  useGameStore.getState().openOverlay(id)
}
