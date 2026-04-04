import { useState, useCallback, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useGestureControls } from '../../hooks/useGestureControls'
import { AtomScene, type AtomSceneHandle } from './AtomScene'
import { ProjectList } from './ProjectList'
import { CVToggle } from './CVToggle'
import { ProjectStepper } from './ProjectStepper'
import { Starfield } from './Starfield'
import { projects, type Project } from '../../data/projects'
import styles from './AtomPage.module.css'

type ViewMode = 'atom' | 'list'

function RotatingStarfield() {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015
  })
  return (
    <group ref={ref}>
      <Starfield />
    </group>
  )
}

export function AtomPage() {
  useDocumentTitle('Sean Simpson — seantokuzo.dev')
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const { hasWebGL2, hasCamera } = useDeviceCapabilities()
  const canRender3D = hasWebGL2

  const [viewMode, setViewMode] = useState<ViewMode>(
    canRender3D ? 'atom' : 'list'
  )
  const [orbitPaused, setOrbitPaused] = useState(false)
  // Track whether the 3D scene is focused on an electron
  const [sceneFocused, setSceneFocused] = useState(false)
  const sceneRef = useRef<AtomSceneHandle>(null)
  const [focusedProject, setFocusedProject] = useState<Project | null>(null)

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
    if (idx < 0) return
    const next = projects[(idx + 1) % projects.length]
    sceneRef.current?.stepToProject(next)
  }, [focusedProject])

  const handleStepPrev = useCallback(() => {
    if (!focusedProject) return
    const idx = projects.findIndex((p) => p.id === focusedProject.id)
    if (idx < 0) return
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
      {/* 3D View toggle — only shows in list view */}
      {viewMode === 'list' && canRender3D && (
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

      {/* Main content */}
      {viewMode === 'atom' && canRender3D ? (
        <div className={styles.canvasWrap}>
          <AtomScene
            ref={sceneRef}
            orbitPaused={orbitPaused}
            isMobile={isMobile}
            isTablet={isTablet && !isMobile}
            onFocusChange={setSceneFocused}
            onFocusedProjectChange={handleFocusedProjectChange}
          />

          {/* Hero text — always top center */}
          <div className={`${styles.heroText} ${sceneFocused ? styles.heroHidden : ''}`}>
            <h1 className={styles.title}>Sean Simpson</h1>
            <p className={styles.subtitle}>
              Full-Stack Developer · Creative Technologist
            </p>
          </div>

          {/* Bottom controls — all viewport sizes */}
          <div className={styles.bottomControls}>
            <ProjectStepper
              focusedProject={focusedProject}
              onExplore={handleExplore}
              onNext={handleStepNext}
              onPrev={handleStepPrev}
              onClose={handleStepClose}
            />
            <div className={`${styles.secondaryControls} ${sceneFocused ? styles.controlsHidden : ''}`}>
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setViewMode('list')}
                aria-label="Switch to list view"
              >
                ☰ List View
              </button>
              {!isMobile && hasCamera && (
                <CVToggle />
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {canRender3D && (
            <div className={styles.starfieldBg}>
              <Canvas
                camera={{ position: [0, 0, 0], fov: 75 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: true }}
              >
                <RotatingStarfield />
              </Canvas>
            </div>
          )}
          <ProjectList />
        </>
      )}

    </div>
  )
}
