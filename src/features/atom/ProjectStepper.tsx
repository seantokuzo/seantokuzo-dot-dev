import type { Project } from '../../data/projects'
import styles from './ProjectStepper.module.css'

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
      <span className={styles.projectTitle}>{focusedProject.title}</span>
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
