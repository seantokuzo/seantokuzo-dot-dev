import { projects, type Project } from '../../data/projects'
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
            onClick={() => onSelectProject(project)}
          >
            <h3 className={styles.title}>{project.title}</h3>
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
