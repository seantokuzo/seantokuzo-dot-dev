import { useState, useCallback, useMemo } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useGestureControls } from '../../hooks/useGestureControls'
import { AtomScene } from './AtomScene'
import { ProjectList } from './ProjectList'
import { ProjectOverlay } from './ProjectOverlay'
import { CVToggle } from './CVToggle'
import type { Project } from '../../data/projects'
import styles from './AtomPage.module.css'

type ViewMode = 'atom' | 'list'

export function AtomPage() {
  useDocumentTitle('Sean Simpson — seantokuzo.dev')
  const isMobile = useIsMobile()
  const { hasWebGL2, hasCamera } = useDeviceCapabilities()
  const canRender3D = hasWebGL2

  const [viewMode, setViewMode] = useState<ViewMode>(
    canRender3D ? 'atom' : 'list'
  )
  // Selection state — only used for list view overlay
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [orbitPaused, setOrbitPaused] = useState(false)
  // Track whether the 3D scene is focused on an electron
  const [sceneFocused, setSceneFocused] = useState(false)

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project)
  }, [])

  const handleCloseOverlay = useCallback(() => {
    setSelectedProject(null)
  }, [])

  // CV gesture controls — desktop only, 3D view only
  const gestureOptions = useMemo(
    () => ({
      onPauseOrbit: setOrbitPaused,
    }),
    [setOrbitPaused]
  )
  useGestureControls(gestureOptions)

  return (
    <div className={styles.page}>
      {/* View toggle + CV toggle — fade during electron focus */}
      <div className={`${styles.controls} ${sceneFocused ? styles.controlsHidden : ''}`}>
        {canRender3D && (
          <button
            className={`${styles.toggle} ${viewMode === 'atom' ? styles.active : ''}`}
            onClick={() => setViewMode(viewMode === 'atom' ? 'list' : 'atom')}
            aria-label={`Switch to ${viewMode === 'atom' ? 'list' : '3D'} view`}
          >
            {viewMode === 'atom' ? '☰ List View' : '⚛ 3D View'}
          </button>
        )}
        {!isMobile && canRender3D && viewMode === 'atom' && hasCamera && (
          <CVToggle />
        )}
        {isMobile && viewMode === 'atom' && (
          <span className={styles.hint}>Pinch to zoom · Drag to rotate</span>
        )}
      </div>

      {/* Main content */}
      {viewMode === 'atom' && canRender3D ? (
        <div className={styles.canvasWrap}>
          <AtomScene
            orbitPaused={orbitPaused}
            isMobile={isMobile}
            onFocusChange={setSceneFocused}
          />
          <div className={`${styles.heroText} ${sceneFocused ? styles.heroHidden : ''}`}>
            <h1 className={styles.title}>Sean Simpson</h1>
            <p className={styles.subtitle}>
              Full-Stack Developer · Creative Technologist
            </p>
          </div>
        </div>
      ) : (
        <ProjectList onSelectProject={handleSelectProject} />
      )}

      {/* Project detail overlay — list view only */}
      {selectedProject && viewMode === 'list' && (
        <ProjectOverlay
          project={selectedProject}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  )
}
