import { createContext, useContext, type RefObject } from 'react'
import type { AtomSceneHandle } from './AtomScene'
import type { Project } from '../../data/projects'

export type AtomMode = 'full' | 'ambient' | 'hidden'
export type ViewMode = 'atom' | 'list'

interface AtomContextValue {
  sceneRef: RefObject<AtomSceneHandle | null>
  atomMode: AtomMode
  focusedProject: Project | null
  sceneFocused: boolean
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  orbitPaused: boolean
  setOrbitPaused: (paused: boolean) => void
  canRender3D: boolean
  hasCamera: boolean
  isLanding: boolean
  triggerUfo: () => void
}

const AtomContext = createContext<AtomContextValue | null>(null)

export function useAtomContext() {
  const ctx = useContext(AtomContext)
  if (!ctx) throw new Error('useAtomContext must be used within AtomProvider')
  return ctx
}

export { AtomContext }
