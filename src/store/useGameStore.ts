import { create } from 'zustand'

export type InteractableId = 'surfboard' | 'campfire' | 'beach-hut' | 'tiki-sign'

interface GameState {
  nearbyInteractable: InteractableId | null
  activeOverlay: InteractableId | null

  setNearbyInteractable: (id: InteractableId | null) => void
  openOverlay: (id: InteractableId) => void
  closeOverlay: () => void
}

export const useGameStore = create<GameState>((set) => ({
  nearbyInteractable: null,
  activeOverlay: null,

  setNearbyInteractable: (nearbyInteractable) => set({ nearbyInteractable }),
  openOverlay: (activeOverlay) => set({ activeOverlay }),
  closeOverlay: () => set({ activeOverlay: null }),
}))
