import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from './data/profile'
import { copyText, useReducedMotion, useScrollState, useTheme } from './hooks'

import Nav from './components/Nav'
import CommandPalette from './components/CommandPalette'
import Hero, { Stats } from './components/Hero'
import AiSection from './components/AiSection'
import BotsSection from './components/BotsSection'
import ProblemLog from './components/ProblemLog'
import Projects from './components/Projects'
import { About, Contact, Education, Experience, Footer, Skills } from './components/Sections'
import Icon from './components/Icon'

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
        <Hero />
        <Stats />
        <About />
        <Skills />
        <AiSection />
        <BotsSection />
        <ProblemLog />
        <Experience />
        <Projects />
        <Education />
        <Contact onCopyEmail={copyEmail} />
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
