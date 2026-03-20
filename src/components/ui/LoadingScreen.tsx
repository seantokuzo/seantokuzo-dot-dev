import styles from './LoadingScreen.module.css'

export function LoadingScreen() {
  return (
    <div className={styles.container} role="status" aria-label="Loading">
      <div className={styles.wave} aria-hidden="true">
        <div className={styles.bar} />
        <div className={styles.bar} />
        <div className={styles.bar} />
        <div className={styles.bar} />
        <div className={styles.bar} />
      </div>
      <span className={styles.label}>Loading</span>
    </div>
  )
}
