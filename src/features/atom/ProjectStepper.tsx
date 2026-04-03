import type { Project, ProjectStatus } from '../../data/projects'
import styles from './ProjectStepper.module.css'

const STATUS_LABELS: Record<ProjectStatus, string> = {
  'released': 'Released',
  'in-development': 'In Development',
  'early-stage': 'Early Stage',
}

interface ProjectStepperProps {
  focusedProject: Project | null
  onExplore: () => void
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}

export function ProjectStepper({
  focusedProject,
  onExplore,
  onNext,
  onPrev,
  onClose,
}: ProjectStepperProps) {
  if (!focusedProject) {
    return (
      <div className={styles.stepper} role="navigation" aria-label="Project navigation">
        <button
          type="button"
          className={styles.exploreBtn}
          onClick={onExplore}
          aria-label="Explore projects"
        >
          Explore Projects <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    )
  }

  return (
    <div className={styles.stepper} role="navigation" aria-label="Project navigation">
      <button
        type="button"
        className={styles.navBtn}
        onClick={onPrev}
        aria-label="Previous project"
      >
        <span aria-hidden="true">&larr;</span>
      </button>
      <span className={styles.projectTitle}>
        {focusedProject.isPrivate && (
          <svg
            className={styles.lockIcon}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Private repository"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
        {focusedProject.title}
        <span className={styles.separator} aria-hidden="true">&middot;</span>
        <span className={styles.statusText} data-status={focusedProject.status}>
          {STATUS_LABELS[focusedProject.status]}
        </span>
      </span>
      <button
        type="button"
        className={styles.navBtn}
        onClick={onNext}
        aria-label="Next project"
      >
        <span aria-hidden="true">&rarr;</span>
      </button>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close project view"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}
