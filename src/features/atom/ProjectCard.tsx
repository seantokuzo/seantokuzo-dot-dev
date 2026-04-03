import type React from 'react'
import { useEffect, useRef, useCallback } from 'react'
import { STATUS_LABELS, type Project } from '../../data/projects'
import { LockIcon } from '../../components/ui/LockIcon'
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

      <div className={styles.header}>
        <h2 className={styles.title}>
          {project.title}
          {project.isPrivate && (
            <LockIcon size={14} className={styles.lockIcon} />
          )}
        </h2>
        <span
          className={styles.statusBadge}
          data-status={project.status}
        >
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      <p className={styles.description}>
        {project.longDescription || project.description}
      </p>

      {project.media && (
        <div className={styles.media}>
          {project.media.type === 'video' ? (
            <video
              src={project.media.src}
              controls
              className={styles.mediaContent}
              aria-label={project.media.alt || `${project.title} video`}
            />
          ) : (
            <img
              src={project.media.src}
              alt={project.media.alt || `${project.title} preview`}
              className={styles.mediaContent}
            />
          )}
        </div>
      )}

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
