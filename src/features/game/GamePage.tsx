import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { WorldScene } from './WorldScene'
import { TouchControls } from './TouchControls'
import styles from './GamePage.module.css'

export function GamePage() {
  const { hasWebGL2 } = useDeviceCapabilities()
  const isMobile = useIsMobile()
  useDocumentTitle('Island World — seantokuzo.dev')

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

  return (
    <div className={styles.page}>
      <WorldScene />
      {isMobile ? (
        <TouchControls />
      ) : (
        <div className={styles.controls}>
          <span className={styles.controlHint}>WASD / Arrows to explore</span>
        </div>
      )}
    </div>
  )
}
