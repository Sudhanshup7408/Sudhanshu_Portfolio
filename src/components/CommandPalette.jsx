import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { posts } from '../data/posts'
import { copyText, useEscape, useReducedMotion } from '../hooks'
import { SECTIONS } from './Nav'
import Icon from './Icon'

export default function CommandPalette({ open, onClose, onToggleTheme, toast }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const lastFocus = useRef(null)
  const reduced = useReducedMotion()

  const commands = useMemo(() => {
    const goTo = (id) => () =>
      document.getElementById(id)?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })

    return [
      { label: 'Home', hint: 'section', icon: 'section', run: goTo('home') },
      ...SECTIONS.map((s) => ({
        label: s.id === 'log' ? 'Problems & solutions' : s.label,
        hint: 'section',
        icon: 'section',
        run: goTo(s.id),
      })),
      // Every log entry is directly addressable from the palette.
      ...posts.map((p) => ({
        label: p.title,
        hint: 'log entry',
        icon: 'bug',
        run: () => { window.location.hash = `log/${p.slug}` },
      })),
      {
        label: 'Send me an email', hint: 'mailto', icon: 'mail',
        run: () => { window.location.href = `mailto:${profile.email}` },
      },
      {
        label: 'Copy email address', hint: 'clipboard', icon: 'copy',
        run: async () => toast(await copyText(profile.email)
          ? 'Email copied to clipboard' : profile.email),
      },
      {
        label: `Call ${profile.phone}`, hint: 'tel', icon: 'phone',
        run: () => { window.location.href = profile.phoneHref },
      },
      {
        label: 'Open GitHub', hint: 'external', icon: 'github',
        run: () => window.open(profile.github, '_blank', 'noopener'),
      },
      {
        label: 'Open LinkedIn', hint: 'external', icon: 'linkedin',
        run: () => window.open(profile.linkedin, '_blank', 'noopener'),
      },
      {
        label: 'Download résumé (PDF)', hint: 'file', icon: 'doc',
        run: () => window.open(profile.resume, '_blank', 'noopener'),
      },
      {
        label: 'Toggle dark / light theme', hint: 'setting', icon: 'moon',
        run: onToggleTheme,
      },
    ]
  }, [reduced, onToggleTheme, toast])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => { setCursor(0) }, [query])

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    setQuery('')
    setCursor(0)
    inputRef.current?.focus()
    return () => lastFocus.current?.focus?.()
  }, [open])

  useEffect(() => {
    listRef.current?.children[cursor]?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  useEscape(open, onClose)

  if (!open) return null

  const run = (i) => {
    const cmd = matches[i]
    if (!cmd) return
    onClose()
    cmd.run()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (matches.length ? (c + 1) % matches.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (matches.length ? (c - 1 + matches.length) % matches.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(cursor)
    } else if (e.key === 'Tab') {
      e.preventDefault()               // keep focus inside the dialog
      inputRef.current?.focus()
    }
  }

  return (
    <div
      className="cmd-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onKeyDown={onKeyDown}
    >
      <div className="cmd-panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="cmd-input-row">
          <Icon name="search" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section, open a write-up, copy my email…"
            autoComplete="off"
            spellCheck="false"
            aria-label="Search commands"
          />
          <kbd className="mono">Esc</kbd>
        </div>

        <ul className="cmd-list" ref={listRef} role="listbox" aria-label="Results">
          {matches.map((c, i) => (
            <li
              key={`${c.label}-${i}`}
              className="cmd-item"
              role="option"
              aria-selected={i === cursor}
              onClick={() => run(i)}
              onPointerMove={() => setCursor(i)}
            >
              <span className="cmd-ico"><Icon name={c.icon} /></span>
              <span className="cmd-label">{c.label}</span>
              <span className="cmd-hint">{c.hint}</span>
            </li>
          ))}
          {!matches.length && <li className="cmd-none">Nothing matches that.</li>}
        </ul>

        <div className="cmd-foot mono">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
