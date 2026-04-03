import type React from 'react'
import { useEffect, useRef, useCallback } from 'react'
import type { Project } from '../../data/projects'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  exiting: boolean
  onClose: () => void
  onExitComplete: () => void
}

export function ProjectCard({ project, exiting, onClose, onExitComplete }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus close button on mount
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // Escape key closes
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Trap focus within card
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
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

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
      if (exiting && e.target === e.currentTarget) {
        onExitComplete()
      }
    },
    [exiting, onExitComplete]
  )

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${exiting ? styles.exiting : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Project details: ${project.title}`}
      onKeyDown={handleKeyDown}
      onAnimationEnd={handleAnimationEnd}
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
  )
}
