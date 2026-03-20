import { useEffect } from 'react'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { WorldScene } from './WorldScene'
import styles from './GamePage.module.css'

export function GamePage() {
  const { hasWebGL2 } = useDeviceCapabilities()

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Island World — seantokuzo.dev'
    return () => {
      document.title = previousTitle
    }
  }, [])

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
      <div className={styles.controls}>
        <span className={styles.controlHint}>WASD / Arrows to explore</span>
      </div>
    </div>
  )
}
