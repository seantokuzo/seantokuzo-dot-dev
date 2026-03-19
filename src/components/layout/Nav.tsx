import { useState } from 'react'
import { NavLink } from 'react-router'
import styles from './Nav.module.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/world', label: 'World' },
  { to: '/about', label: 'About' },
]

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        sean<span className={styles.logoAccent}>tokuzo</span>
      </NavLink>

      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
