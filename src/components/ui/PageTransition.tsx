import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import styles from './PageTransition.module.css'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <div key={location.pathname} className={styles.transition}>
      {children}
    </div>
  )
}
