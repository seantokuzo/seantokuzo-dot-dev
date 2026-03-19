import styles from './AtomPage.module.css'

export function AtomPage() {
  return (
    <div className={styles.page}>
      <div className={styles.placeholder}>
        <h1 className={styles.title}>Atom Portfolio</h1>
        <p className={styles.subtitle}>
          3D atom with a Hawaiian mini-planet nucleus. Coming in Phase 2.
        </p>
      </div>
    </div>
  )
}
