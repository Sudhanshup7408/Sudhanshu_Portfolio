import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../data/profile'
import { useEscape, useScrollSpy } from '../hooks'
import Icon from './Icon'

/* Sections that live on the home page, in document order. */
export const SECTIONS = [
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Skills' },
  { id: 'playground', label: 'Playground' },
  { id: 'bots',       label: 'Bots' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contact',    label: 'Contact' },
]

/* Sections that live on their own route. Kept separate because these are page
   navigations, not in-page scrolls, and the scroll spy must not track them. */
export const PAGES = [
  { path: '/ai', label: 'AI' },
]

const IDS = SECTIONS.map((s) => s.id)
/* Module-level so the "nothing to spy on" case passes a stable reference.
   An inline [] would be a fresh array every render, re-running the observer
   effect on every render of every non-home page. */
const NO_IDS = []

export default function Nav({ scrolled, theme, onToggleTheme, onOpenPalette }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  // Spying on hash sections only makes sense while they are actually mounted.
  const spied = useScrollSpy(onHome ? IDS : NO_IDS)
  const active = onHome ? spied : null

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
  }, [active, pathname])

  useEscape(menuOpen, () => setMenuOpen(false))

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="brand" onClick={close}>
        <span className="brand-mark">SP</span>
        <span className="brand-text">Sudhanshu<span className="dot">.</span>Pal</span>
      </Link>

      <nav
        className={`nav-links${menuOpen ? ' open' : ''}`}
        ref={listRef}
        aria-label="Section navigation"
      >
        {SECTIONS.map((s) => {
          const cls = `nav-link${active === s.id ? ' active' : ''}`
          const current = active === s.id ? 'true' : undefined

          // On the home page these are in-page jumps; from any other route they
          // have to go home first, which is a real navigation.
          return onHome ? (
            <a key={s.id} href={`#${s.id}`} className={cls} aria-current={current} onClick={close}>
              {s.label}
            </a>
          ) : (
            <Link key={s.id} to={`/#${s.id}`} className={cls} onClick={close}>
              {s.label}
            </Link>
          )
        })}

        {PAGES.map((p) => (
          <Link
            key={p.path}
            to={p.path}
            className={`nav-link${pathname === p.path ? ' active' : ''}`}
            aria-current={pathname === p.path ? 'page' : undefined}
            onClick={close}
          >
            {p.label}
          </Link>
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
