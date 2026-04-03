import { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { isMuted, toggleMute } from '../../utils/soundManager'
import { NavOrbMenu, type OrbMenuPhase } from './NavOrbMenu'
import styles from './Nav.module.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/world', label: 'World' },
  { to: '/about', label: 'About' },
]

export function Nav() {
  const isMobile = useIsMobile()
  const [scrolled, setScrolled] = useState(false)
  const [muted, setMuted] = useState(isMuted)

  // Orb menu state (mobile only)
  const [orbPhase, setOrbPhase] = useState<OrbMenuPhase>('closed')

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // Entering → open on next frame (triggers CSS transition)
  useEffect(() => {
    if (orbPhase !== 'entering') return
    let raf1: number, raf2: number
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setOrbPhase('open')
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [orbPhase])

  const canToggleOrbs = orbPhase === 'closed' || orbPhase === 'open'

  const toggleOrbMenu = () => {
    if (!canToggleOrbs) return
    if (orbPhase === 'closed') {
      setOrbPhase('entering')
    } else {
      setOrbPhase('exiting')
    }
  }

  const closeOrbMenu = () => {
    if (orbPhase === 'open') {
      setOrbPhase('exiting')
    }
  }

  const handleOrbTransitionEnd = () => {
    if (orbPhase === 'exiting') {
      setOrbPhase('closed')
    }
  }

  const orbMenuOpen = orbPhase !== 'closed'

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <NavLink to="/" className={styles.logo} onClick={closeOrbMenu}>
          sean<span className={styles.logoAccent}>tokuzo</span>
        </NavLink>

        <button
          className={styles.menuButton}
          onClick={toggleOrbMenu}
          disabled={!canToggleOrbs}
          aria-label={orbMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={orbMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {orbMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        <div className={styles.links}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            className={styles.muteButton}
            onClick={() => setMuted(toggleMute())}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {muted ? (
                <>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              ) : (
                <>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {isMobile && (
        <NavOrbMenu
          phase={orbPhase}
          onTransitionEnd={handleOrbTransitionEnd}
          onNavigate={closeOrbMenu}
        />
      )}
    </>
  )
}
