import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.socialLinks}>
          <a
            href="https://github.com/seantokuzo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/seantokuzo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Sean Simpson. Built with aloha.</p>
      </div>
    </footer>
  )
}
