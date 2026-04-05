import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAtomContext } from '../atom/AtomContext'
import styles from './HomePage.module.css'

export function HomePage() {
  useDocumentTitle('Sean Simpson — seantokuzo.dev')
  const navigate = useNavigate()
  const { triggerUfo } = useAtomContext()

  const [ctaFading, setCtaFading] = useState(false)
  const [ufoLifting, setUfoLifting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const ufoIconRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCtaClick = useCallback(() => {
    if (ctaFading) return // Guard against double-click
    setUfoLifting(true)
    setCtaFading(true)

    // Get the UFO icon's screen position before it lifts off
    const iconRect = ufoIconRef.current?.getBoundingClientRect()
    const screenOrigin = iconRect
      ? { x: iconRect.left + iconRect.width / 2, y: iconRect.top + iconRect.height / 2 }
      : undefined

    timerRef.current = setTimeout(() => {
      triggerUfo(screenOrigin)
      navigate('/projects')
    }, 500)
  }, [ctaFading, triggerUfo, navigate])

  return (
    <div className={styles.page}>
      {/* Top section — grows upward from center */}
      <div className={styles.topSection}>
        <h1 className={styles.title}>Sean Simpson</h1>
        <div className={styles.subtitle}>
          <span>Software Builder</span>
          <span>Full-Stack Software Engineer</span>
        </div>
      </div>

      {/* Atom gap — always at viewport center */}
      <div className={styles.atomSpacer} />

      {/* Bottom section — grows downward from center */}
      <div className={styles.bottomSection}>
        <p className={styles.blurbText}>
          I build things that blend engineering rigor with creative flair — from
          3D portfolio experiences to AI-driven dev tools. Based in Hawaii,
          shipping production-grade software with aloha.
        </p>

        <div className={`${styles.ctaWrap} ${ctaFading ? styles.ctaFading : ''}`}>
        <button
          type="button"
          className={styles.ctaButton}
          onClick={handleCtaClick}
          disabled={ctaFading}
          aria-label="Explore my projects"
        >
          <span
            ref={ufoIconRef}
            className={`${styles.ufoIcon} ${ufoLifting ? styles.ufoLifting : ''}`}
            aria-hidden="true"
          >
            🛸
          </span>
          See my projects
        </button>
        </div>
      </div>
    </div>
  )
}
