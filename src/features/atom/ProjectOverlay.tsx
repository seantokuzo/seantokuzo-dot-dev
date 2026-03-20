import type { Project } from '../../data/projects'
import styles from './ProjectOverlay.module.css'

interface ProjectOverlayProps {
  project: Project
  onClose: () => void
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
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
