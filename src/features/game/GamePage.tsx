import { useEffect } from 'react'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { WorldScene } from './WorldScene'
import { TouchControls } from './TouchControls'
import { InteractionPrompt } from './InteractionPrompt'
import { InteractionOverlay } from './InteractionOverlay'
import { useGameStore } from '../../store/useGameStore'
import { startOceanAmbience, stopOceanAmbience, playInteract } from '../../utils/soundManager'
import styles from './GamePage.module.css'

export function GamePage() {
  const { hasWebGL2 } = useDeviceCapabilities()
  const isMobile = useIsMobile()
  const nearby = useGameStore((s) => s.nearbyInteractable)
  const activeOverlay = useGameStore((s) => s.activeOverlay)
  const openOverlay = useGameStore((s) => s.openOverlay)
  useDocumentTitle('Island World — seantokuzo.dev')

  // Start ocean ambience on first click, stop on unmount
  useEffect(() => {
    if (!hasWebGL2) return

    const start = () => {
      startOceanAmbience()
      window.removeEventListener('click', start)
    }
    window.addEventListener('click', start)
    return () => {
      window.removeEventListener('click', start)
      stopOceanAmbience()
    }
  }, [hasWebGL2])

  // Play sound when an overlay opens
  useEffect(() => {
    if (activeOverlay) playInteract()
  }, [activeOverlay])

  if (!hasWebGL2) {
    return (
      <div className={styles.page}>
        <div className={styles.fallback}>
          <h1 className={styles.title}>Island World</h1>
          <p className={styles.subtitle}>
            This experience requires WebGL2. Try a modern browser on desktop.
          </p>
        </div>
      </div>
    )
  }

  const handleMobileInteract = () => {
    if (nearby) openOverlay(nearby)
  }

  return (
    <div className={styles.page}>
      <WorldScene />
      <InteractionPrompt />
      <InteractionOverlay />
      {isMobile ? (
        <>
          <TouchControls />
          {nearby && (
            <button
              className={styles.interactButton}
              onClick={handleMobileInteract}
              aria-label="Interact"
            >
              Tap
            </button>
          )}
        </>
      ) : (
        <div className={styles.controls}>
          <span className={styles.controlHint}>WASD / Arrows to explore</span>
        </div>
      )}
    </div>
  )
}
