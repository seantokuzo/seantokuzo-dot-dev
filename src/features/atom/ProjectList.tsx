import { projects, STATUS_LABELS, type Project } from '../../data/projects'
import { LockIcon } from '../../components/ui/LockIcon'
import styles from './ProjectList.module.css'

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
                <LockIcon size={13} strokeWidth={2.5} className={styles.lockIcon} />
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
