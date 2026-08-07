import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { useEscape, useScrollSpy } from '../hooks'
import Icon from './Icon'

export const SECTIONS = [
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Skills' },
  { id: 'ai',         label: 'AI' },
  { id: 'bots',       label: 'Bots' },
  { id: 'log',        label: 'Log' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contact',    label: 'Contact' },
]

const IDS = SECTIONS.map((s) => s.id)

export default function Nav({ scrolled, theme, onToggleTheme, onOpenPalette }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(IDS)

  const listRef = useRef(null)
  const [indicator, setIndicator] = useState(null)

  // Slide the pill to the active link. Layout effect so it never paints stale.
  useLayoutEffect(() => {
    const move = () => {
      const list = listRef.current
      if (!list || window.innerWidth <= 1080) { setIndicator(null); return }
      const el = list.querySelector('.nav-link.active')
      if (!el) { setIndicator(null); return }
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
    move()
    window.addEventListener('resize', move)
    return () => window.removeEventListener('resize', move)
  }, [active])

  useEscape(menuOpen, () => setMenuOpen(false))

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <a href="#home" className="brand">
        <span className="brand-mark">SP</span>
        <span className="brand-text">Sudhanshu<span className="dot">.</span>Pal</span>
      </a>

      <nav
        className={`nav-links${menuOpen ? ' open' : ''}`}
        ref={listRef}
        aria-label="Section navigation"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`nav-link${active === s.id ? ' active' : ''}`}
            aria-current={active === s.id ? 'true' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {s.label}
          </a>
        ))}
        <span
          className={`nav-indicator${indicator ? ' on' : ''}`}
          aria-hidden="true"
          style={indicator ? {
            width: `${indicator.width}px`,
            transform: `translateX(${indicator.left}px)`,
          } : undefined}
        />
      </nav>

      <div className="nav-actions">
        <button
          className="cmd-trigger"
          type="button"
          onClick={onOpenPalette}
          aria-label="Open command palette"
        >
          <Icon name="search" />
          <span>Jump to…</span>
          <kbd className="mono">Ctrl K</kbd>
        </button>

        <button
          className="icon-btn"
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle colour theme"
          title="Toggle theme"
        >
          <Icon name={theme === 'dark' ? 'moon' : 'sun'} />
        </button>

        <a className="btn btn-ghost nav-resume" href={profile.resume} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>

        <button
          className="burger"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
