import { useState, useCallback } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AtomScene } from './AtomScene'
import { ProjectList } from './ProjectList'
import { ProjectOverlay } from './ProjectOverlay'
import type { Project } from '../../data/projects'
import styles from './AtomPage.module.css'

type ViewMode = 'atom' | 'list'

export function AtomPage() {
  useDocumentTitle('Sean Simpson — seantokuzo.dev')
  const isMobile = useIsMobile()
  const { hasWebGL2 } = useDeviceCapabilities()
  const canRender3D = hasWebGL2

  const [viewMode, setViewMode] = useState<ViewMode>(
    canRender3D ? 'atom' : 'list'
  )
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project)
  }, [])

  const handleCloseOverlay = useCallback(() => {
    setSelectedProject(null)
  }, [])

  return (
    <div className={styles.page}>
      {/* View toggle */}
      <div className={styles.controls}>
        {canRender3D && (
          <button
            className={`${styles.toggle} ${viewMode === 'atom' ? styles.active : ''}`}
            onClick={() => setViewMode(viewMode === 'atom' ? 'list' : 'atom')}
            aria-label={`Switch to ${viewMode === 'atom' ? 'list' : '3D'} view`}
          >
            {viewMode === 'atom' ? '☰ List View' : '⚛ 3D View'}
          </button>
        )}
        {isMobile && viewMode === 'atom' && (
          <span className={styles.hint}>Pinch to zoom · Drag to rotate</span>
        )}
      </div>

      {/* Main content */}
      {viewMode === 'atom' && canRender3D ? (
        <div className={styles.canvasWrap}>
          <AtomScene onSelectProject={handleSelectProject} onClearSelection={handleCloseOverlay} />
          <div className={styles.heroText}>
            <h1 className={styles.title}>Sean Simpson</h1>
            <p className={styles.subtitle}>
              Full-Stack Developer · Creative Technologist
            </p>
          </div>
        </div>
      ) : (
        <ProjectList onSelectProject={handleSelectProject} />
      )}

      {/* Project detail overlay */}
      {selectedProject && (
        <ProjectOverlay
          project={selectedProject}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  )
}
