import { useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { profile } from './data/profile'
import { copyText, useReducedMotion, useScrollState, useTheme } from './hooks'

import Nav from './components/Nav'
import CommandPalette from './components/CommandPalette'
import { Footer } from './components/Sections'
import Icon from './components/Icon'

import HomePage from './pages/HomePage'
import AiPage from './pages/AiPage'
import NotFoundPage from './pages/NotFoundPage'

function Background() {
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-grid" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="bg-noise" />
    </div>
  )
}

/* Routing moved the sections onto two pages, so scroll position has to be managed
   by hand. A hash means "land on that section" (including when arriving from the
   other page); no hash means "start at the top of the new page". */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    // The target section may still be mounting on a fresh page load.
    const id = decodeURIComponent(hash.slice(1))
    let frames = 0
    let raf
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
        return
      }
      if (frames++ < 30) raf = requestAnimationFrame(tryScroll)
    }
    raf = requestAnimationFrame(tryScroll)
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash, reduced])

  return null
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const { y, progress } = useScrollState()
  const reduced = useReducedMotion()
  const toastTimer = useRef()

  const toast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2400)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // Ctrl/Cmd+K toggles the palette from anywhere.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const copyEmail = useCallback(async () => {
    toast(await copyText(profile.email) ? 'Email copied to clipboard' : profile.email)
  }, [toast])

  return (
    <>
      <Background />
      <ScrollManager />

      <a className="skip-link" href="#main">Skip to content</a>

      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>

      <Nav
        scrolled={y > 24}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage onCopyEmail={copyEmail} />} />
          <Route path="/ai" element={<AiPage onCopyEmail={copyEmail} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      <button
        className={`to-top${y > 520 ? ' show' : ''}`}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
      >
        <Icon name="arrowUp" />
      </button>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={toggleTheme}
        toast={toast}
      />

      <div className={`toast${toastMsg ? ' show' : ''}`} role="status" aria-live="polite">
        {toastMsg}
      </div>
    </>
  )
}
