import styles from './GamePage.module.css'

export function GamePage() {
  return (
    <div className={styles.page}>
      <div className={styles.placeholder}>
        <h1 className={styles.title}>Island World</h1>
        <p className={styles.subtitle}>
          Isometric Hawaiian village exploration. Coming in Phase 4.
        </p>
      </div>
    </div>
  )
}
