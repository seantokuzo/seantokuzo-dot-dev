import { Outlet } from 'react-router'
import { Nav } from './Nav'
import { Footer } from './Footer'
import styles from './PageShell.module.css'

export function PageShell() {
  return (
    <div className={styles.shell}>
      <Nav />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
