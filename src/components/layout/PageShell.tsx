import { useState, useRef, useMemo, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { PageTransition } from '../ui/PageTransition'
import { AtomScene, type AtomSceneHandle } from '../../features/atom/AtomScene'
import { AtomContext, type AtomMode, type ViewMode } from '../../features/atom/AtomContext'
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import type { Project } from '../../data/projects'
import styles from './PageShell.module.css'

export function PageShell() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const { hasWebGL2, hasCamera } = useDeviceCapabilities()

  const sceneRef = useRef<AtomSceneHandle>(null)
  const [focusedProject, setFocusedProject] = useState<Project | null>(null)
  const [sceneFocused, setSceneFocused] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('atom')
  const [orbitPaused, setOrbitPaused] = useState(false)

  const canRender3D = hasWebGL2

  const atomMode: AtomMode = useMemo(() => {
    if (location.pathname === '/world') return 'hidden'
    if (location.pathname === '/') return 'full'
    return 'ambient'
  }, [location.pathname])

  const showCanvas = atomMode === 'full' && canRender3D && viewMode === 'atom'

  // Reset scene state when canvas unmounts (navigating away or switching to list)
  useEffect(() => {
    if (!showCanvas) {
      setFocusedProject(null)
      setSceneFocused(false)
    }
  }, [showCanvas])

  const ctxValue = useMemo(() => ({
    sceneRef,
    atomMode,
    focusedProject,
    sceneFocused,
    viewMode,
    setViewMode,
    orbitPaused,
    setOrbitPaused,
    canRender3D,
    hasCamera,
  }), [atomMode, focusedProject, sceneFocused, viewMode, orbitPaused, canRender3D, hasCamera])

  return (
    <AtomContext.Provider value={ctxValue}>
      <div className={styles.shell}>
        <Nav />
        {showCanvas && (
          <div className={styles.canvasLayer}>
            <AtomScene
              ref={sceneRef}
              orbitPaused={orbitPaused}
              isMobile={isMobile}
              isTablet={isTablet && !isMobile}
              onFocusChange={setSceneFocused}
              onFocusedProjectChange={setFocusedProject}
            />
          </div>
        )}
        <main className={styles.main}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
      </div>
    </AtomContext.Provider>
  )
}
