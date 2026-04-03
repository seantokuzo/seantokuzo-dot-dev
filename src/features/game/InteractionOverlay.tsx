import { useEffect, useRef, useCallback } from 'react'
import type React from 'react'
import { useNavigate } from 'react-router'
import { useGameStore, type InteractableId } from '../../store/useGameStore'
import { projects, type ProjectStatus } from '../../data/projects'
import { skills, skillCategories, type SkillCategory } from '../../data/skills'
import { socialLinks } from '../../data/bio'
import styles from './InteractionOverlay.module.css'

const OVERLAY_LABELS: Record<InteractableId, string> = {
  surfboard: 'Projects',
  campfire: 'Skills',
  'beach-hut': 'Contact',
  'tiki-sign': 'About',
}

export function InteractionOverlay() {
  const activeOverlay = useGameStore((s) => s.activeOverlay)
  const closeOverlay = useGameStore((s) => s.closeOverlay)
  const cardRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!activeOverlay) return
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      prev?.focus()
    }
  }, [activeOverlay])

  useEffect(() => {
    if (!activeOverlay) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [activeOverlay, closeOverlay])

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

  if (!activeOverlay) return null

  return (
    <div
      className={styles.backdrop}
      onClick={closeOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${OVERLAY_LABELS[activeOverlay]} details`}
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
          onClick={closeOverlay}
          aria-label="Close"
        >
          &times;
        </button>

        <OverlayContent id={activeOverlay} />
      </div>
    </div>
  )
}

function OverlayContent({ id }: { id: InteractableId }) {
  switch (id) {
    case 'surfboard':
      return <ProjectsContent />
    case 'campfire':
      return <SkillsContent />
    case 'beach-hut':
      return <ContactContent />
    case 'tiki-sign':
      return <AboutRedirect />
    default:
      return null
  }
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  'released': 'Released',
  'in-development': 'In Development',
  'early-stage': 'Early Stage',
}

function ProjectsContent() {
  return (
    <>
      <h2 className={styles.title}>Projects</h2>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              {project.isPrivate && (
                <svg className={styles.lockIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              <span className={styles.statusBadge} data-status={project.status}>
                {STATUS_LABELS[project.status]}
              </span>
            </div>
            <p className={styles.projectDesc}>{project.description}</p>
            <div className={styles.tags}>
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
            <div className={styles.projectLinks}>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Live &rarr;
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
        ))}
      </div>
    </>
  )
}

function SkillsContent() {
  const grouped = (Object.keys(skillCategories) as SkillCategory[]).map(
    (cat) => ({
      label: skillCategories[cat],
      items: skills.filter((s) => s.category === cat),
    })
  )

  return (
    <>
      <h2 className={styles.title}>Skills & Tech</h2>
      <div className={styles.skillsGrid}>
        {grouped.map(({ label, items }) => (
          <div key={label} className={styles.skillGroup}>
            <h3 className={styles.skillCategory}>{label}</h3>
            <div className={styles.tags}>
              {items.map((s) => (
                <span key={s.name} className={styles.tag}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ContactContent() {
  return (
    <>
      <h2 className={styles.title}>Get In Touch</h2>
      <p className={styles.contactText}>
        Always down to chat about interesting projects, collaboration, or just
        talk story.
      </p>
      <div className={styles.contactLinks}>
        {socialLinks.map(({ label, url }) => (
          <a
            key={label}
            href={url}
            target={url.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={styles.contactLink}
          >
            {label} &rarr;
          </a>
        ))}
      </div>
    </>
  )
}

function AboutRedirect() {
  const navigate = useNavigate()
  const closeOverlay = useGameStore((s) => s.closeOverlay)

  return (
    <>
      <h2 className={styles.title}>About Me</h2>
      <p className={styles.contactText}>
        Want to learn more? Head over to the full about page.
      </p>
      <button
        className={styles.navButton}
        onClick={() => {
          closeOverlay()
          navigate('/about')
        }}
      >
        Go to About &rarr;
      </button>
    </>
  )
}
