import { useState, useCallback, useMemo, useRef } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useGestureControls } from '../../hooks/useGestureControls'
import { AtomScene, type AtomSceneHandle } from './AtomScene'
import { ProjectList } from './ProjectList'
import { ProjectOverlay } from './ProjectOverlay'
import { CVToggle } from './CVToggle'
import { ProjectStepper } from './ProjectStepper'
import { projects, type Project } from '../../data/projects'
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
  const sceneRef = useRef<AtomSceneHandle>(null)
  const [focusedProject, setFocusedProject] = useState<Project | null>(null)

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

  // Stepper callbacks (mobile only)
  const handleExplore = useCallback(() => {
    sceneRef.current?.focusProject(projects[0])
  }, [])

  const handleStepNext = useCallback(() => {
    if (!focusedProject) return
    const idx = projects.findIndex((p) => p.id === focusedProject.id)
    const next = projects[(idx + 1) % projects.length]
    sceneRef.current?.stepToProject(next)
  }, [focusedProject])

  const handleStepPrev = useCallback(() => {
    if (!focusedProject) return
    const idx = projects.findIndex((p) => p.id === focusedProject.id)
    const prev = projects[(idx - 1 + projects.length) % projects.length]
    sceneRef.current?.stepToProject(prev)
  }, [focusedProject])

  const handleStepClose = useCallback(() => {
    sceneRef.current?.requestClose()
  }, [])

  const handleFocusedProjectChange = useCallback((project: Project | null) => {
    setFocusedProject(project)
  }, [])

  return (
    <div className={styles.page}>
      {/* View toggle + CV toggle — fade during electron focus */}
      <div className={`${styles.controls} ${sceneFocused ? styles.controlsHidden : ''}`}>
        {canRender3D && !(isMobile && viewMode === 'atom') && (
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
      </div>

      {/* Main content */}
      {viewMode === 'atom' && canRender3D ? (
        <div className={styles.canvasWrap}>
          <AtomScene
            ref={sceneRef}
            orbitPaused={orbitPaused}
            isMobile={isMobile}
            onFocusChange={setSceneFocused}
            onFocusedProjectChange={handleFocusedProjectChange}
          />
          <div className={`${styles.heroText} ${sceneFocused ? styles.heroHidden : ''}`}>
            <h1 className={styles.title}>Sean Simpson</h1>
            <p className={styles.subtitle}>
              Full-Stack Developer · Creative Technologist
            </p>
          </div>
          {isMobile && (
            <div className={styles.mobileBottom}>
              <ProjectStepper
                focusedProject={focusedProject}
                onExplore={handleExplore}
                onNext={handleStepNext}
                onPrev={handleStepPrev}
                onClose={handleStepClose}
              />
              <button
                className={`${styles.listViewBtn} ${sceneFocused ? styles.controlsHidden : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="Switch to list view"
              >
                ☰ List View
              </button>
            </div>
          )}
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
