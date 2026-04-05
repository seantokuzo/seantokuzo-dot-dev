import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { RouteTransition } from '../ui/RouteTransition'
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

  const [isLanding, setIsLanding] = useState(false)
  const canRender3D = hasWebGL2

  const triggerUfo = useCallback((screenOrigin?: { x: number; y: number }) => {
    setIsLanding(true)
    sceneRef.current?.startUfo(() => setIsLanding(false), screenOrigin)
  }, [])

  const atomMode: AtomMode = useMemo(() => {
    if (location.pathname === '/world') return 'hidden'
    if (location.pathname === '/') return 'home'
    if (location.pathname === '/projects') return 'projects'
    return 'ambient'
  }, [location.pathname])

  // Canvas with delayed unmount for fade-out during route transitions
  const wantsCanvas = canRender3D && (atomMode === 'home' || (atomMode === 'projects' && viewMode === 'atom'))
  const [canvasMounted, setCanvasMounted] = useState(wantsCanvas)
  const [canvasFading, setCanvasFading] = useState(false)

  useEffect(() => {
    if (wantsCanvas) {
      setCanvasFading(false)
      setCanvasMounted(true)
    } else {
      setCanvasFading(true)
      const timer = setTimeout(() => {
        setCanvasMounted(false)
        setCanvasFading(false)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [wantsCanvas])

  // Reset scene state when leaving atom views
  useEffect(() => {
    if (atomMode === 'home') {
      setViewMode('atom')
      setFocusedProject(null)
      setSceneFocused(false)
      setOrbitPaused(false)
    } else if (atomMode !== 'projects') {
      setFocusedProject(null)
      setSceneFocused(false)
      setOrbitPaused(false)
    }
  }, [atomMode])

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
    isLanding,
    triggerUfo,
  }), [atomMode, focusedProject, sceneFocused, viewMode, orbitPaused, canRender3D, hasCamera, isLanding, triggerUfo])

  return (
    <AtomContext.Provider value={ctxValue}>
      <div className={styles.shell}>
        <Nav />
        {canvasMounted && (
          <div
            className={`${styles.canvasLayer} ${atomMode === 'home' ? styles.canvasHome : ''} ${canvasFading ? styles.canvasFading : ''}`}
          >
            <AtomScene
              ref={sceneRef}
              atomMode={atomMode}
              orbitPaused={orbitPaused}
              isMobile={isMobile}
              isTablet={isTablet && !isMobile}
              onFocusChange={setSceneFocused}
              onFocusedProjectChange={setFocusedProject}
            />
          </div>
        )}
        <main className={styles.main}>
          <RouteTransition />
        </main>
        <Footer />
      </div>
    </AtomContext.Provider>
  )
}
