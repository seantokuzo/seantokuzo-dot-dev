import { useState, useMemo, useCallback } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useGestureControls } from '../../hooks/useGestureControls'
import { useAtomContext } from './AtomContext'
import { ProjectList } from './ProjectList'
import { CVToggle } from './CVToggle'
import { ProjectStepper } from './ProjectStepper'
import { projects } from '../../data/projects'
import styles from './AtomPage.module.css'

export function AtomPage() {
  useDocumentTitle('Sean Simpson — seantokuzo.dev')
  const isMobile = useIsMobile()
  const {
    sceneRef,
    viewMode,
    setViewMode,
    setOrbitPaused,
    focusedProject,
    sceneFocused,
    canRender3D,
    hasCamera,
    isLanding,
    triggerUfo,
  } = useAtomContext()

  const [ctaFading, setCtaFading] = useState(false)

  // CV gesture controls — desktop only, 3D view only
  const gestureOptions = useMemo(
    () => ({ onPauseOrbit: setOrbitPaused }),
    [setOrbitPaused]
  )
  useGestureControls(gestureOptions)

  const handleCtaClick = useCallback(() => {
    setCtaFading(true)
    // Small delay so the CTA fade-out starts before the UFO appears
    setTimeout(() => triggerUfo(), 250)
  }, [triggerUfo])

  // Stepper callbacks
  const handleExplore = useCallback(() => {
    sceneRef.current?.focusProject(projects[0])
  }, [sceneRef])

  const handleStepNext = useCallback(() => {
    if (!focusedProject) return
    const idx = projects.findIndex((p) => p.id === focusedProject.id)
    if (idx < 0) return
    sceneRef.current?.stepToProject(projects[(idx + 1) % projects.length])
  }, [focusedProject, sceneRef])

  const handleStepPrev = useCallback(() => {
    if (!focusedProject) return
    const idx = projects.findIndex((p) => p.id === focusedProject.id)
    if (idx < 0) return
    sceneRef.current?.stepToProject(
      projects[(idx - 1 + projects.length) % projects.length]
    )
  }, [focusedProject, sceneRef])

  const handleStepClose = useCallback(() => {
    sceneRef.current?.requestClose()
  }, [sceneRef])

  // List view: standard scrollable page
  if (!canRender3D || viewMode === 'list') {
    return (
      <div className={`${styles.page} ${styles.listMode}`}>
        {canRender3D && (
          <div className={styles.viewSwitchTop}>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setViewMode('atom')}
              aria-label="Switch to 3D view"
            >
              ⚛ 3D View
            </button>
          </div>
        )}
        <div className={styles.starfieldBg} />
        <ProjectList />
      </div>
    )
  }

  // 3D view: overlay controls on top of persistent canvas
  return (
    <div className={styles.page}>
      <div
        className={`${styles.heroText} ${sceneFocused ? styles.heroHidden : ''}`}
      >
        <h1 className={styles.title}>Sean Simpson</h1>
        <p className={styles.subtitle}>
          Full-Stack Developer · Creative Technologist
        </p>
      </div>

      {/* UFO CTA — visible during landing, hidden when focused on a project */}
      {isLanding && !sceneFocused && (
        <div className={`${styles.ctaWrap} ${ctaFading ? styles.ctaFading : ''}`}>
          <p className={styles.ctaLabel}>Curious what I&rsquo;m building?</p>
          <button
            type="button"
            className={styles.ctaButton}
            onClick={handleCtaClick}
            disabled={ctaFading}
            aria-label="Launch UFO to explore projects"
          >
            <span className={styles.ctaIcon} aria-hidden="true">
              🛸
            </span>
            See my projects
          </button>
        </div>
      )}

      {/* Project controls — visible after landing or when focused on a project */}
      {(!isLanding || sceneFocused) && (
        <div className={styles.bottomControls}>
          <ProjectStepper
            focusedProject={focusedProject}
            onExplore={handleExplore}
            onNext={handleStepNext}
            onPrev={handleStepPrev}
            onClose={handleStepClose}
          />
          <div
            className={`${styles.secondaryControls} ${sceneFocused ? styles.controlsHidden : ''}`}
          >
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setViewMode('list')}
              aria-label="Switch to list view"
            >
              ☰ List View
            </button>
            {!isMobile && hasCamera && <CVToggle />}
          </div>
        </div>
      )}
    </div>
  )
}
