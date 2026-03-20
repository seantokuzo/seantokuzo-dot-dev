import { useEffect, useRef, useCallback } from 'react'
import type { Project } from '../../data/projects'
import styles from './ProjectOverlay.module.css'

interface ProjectOverlayProps {
  project: Project
  onClose: () => void
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus close button on mount, restore on unmount
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      prev?.focus()
    }
  }, [])

  // Escape key closes overlay
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Trap focus within the card
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab' || !cardRef.current) return
      const focusable = cardRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    []
  )

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Project details: ${project.title}`}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={cardRef}
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.description}>
          {project.longDescription || project.description}
        </p>

        <div className={styles.tech}>
          {project.tech.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>

        <div className={styles.links}>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Live Site &rarr;
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
