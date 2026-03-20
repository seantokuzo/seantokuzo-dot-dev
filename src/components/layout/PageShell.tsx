import { Outlet } from 'react-router'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { PageTransition } from '../ui/PageTransition'
import styles from './PageShell.module.css'

export function PageShell() {
  return (
    <div className={styles.shell}>
      <Nav />
      <main className={styles.main}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
