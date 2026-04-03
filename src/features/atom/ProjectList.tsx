import { projects, type Project, type ProjectStatus } from '../../data/projects'
import styles from './ProjectList.module.css'

const STATUS_LABELS: Record<ProjectStatus, string> = {
  'released': 'Released',
  'in-development': 'In Development',
  'early-stage': 'Early Stage',
}

interface ProjectListProps {
  onSelectProject: (project: Project) => void
}

export function ProjectList({ onSelectProject }: ProjectListProps) {
  return (
    <div className={styles.list}>
      <h2 className={styles.heading}>Projects</h2>
      <div className={styles.grid}>
        {projects.map((project) => (
          <button
            key={project.id}
            className={styles.card}
            type="button"
            onClick={() => onSelectProject(project)}
          >
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{project.title}</h3>
              {project.isPrivate && (
                <svg
                  className={styles.lockIcon}
                  width="13"
                  height="13"
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
              <span className={styles.statusBadge} data-status={project.status}>
                {STATUS_LABELS[project.status]}
              </span>
            </div>
            <p className={styles.description}>{project.description}</p>
            <div className={styles.tech}>
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
