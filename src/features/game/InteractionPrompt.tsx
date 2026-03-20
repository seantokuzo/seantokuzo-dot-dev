import { useGameStore, type InteractableId } from '../../store/useGameStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import styles from './InteractionPrompt.module.css'

const LABELS: Record<InteractableId, string> = {
  surfboard: 'Projects',
  campfire: 'Skills',
  'beach-hut': 'Contact',
  'tiki-sign': 'About',
}

export function InteractionPrompt() {
  const nearby = useGameStore((s) => s.nearbyInteractable)
  const activeOverlay = useGameStore((s) => s.activeOverlay)
  const isMobile = useIsMobile()

  if (!nearby || activeOverlay) return null

  const label = LABELS[nearby] ?? nearby

  return (
    <div className={styles.prompt}>
      <span className={styles.key}>{isMobile ? 'Tap' : 'E'}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
