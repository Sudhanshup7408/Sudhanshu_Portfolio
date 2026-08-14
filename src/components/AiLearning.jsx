import { useMemo, useState } from 'react'
import { aiLearning, aiNotes, aiResources } from '../data/aiNotes'
import Icon from './Icon'
import Reveal, { SectionHead } from './Reveal'

const STATE_META = {
  learning: { label: 'Working through it now', icon: 'pulse' },
  next:     { label: 'Queued next',            icon: 'clock' },
  solid:    { label: 'Comfortable shipping it', icon: 'check' },
}

const STATE_ORDER = ['learning', 'next', 'solid']

const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

function Tracker() {
  const grouped = useMemo(() => {
    const by = new Map(STATE_ORDER.map((s) => [s, []]))
    aiLearning.forEach((item) => by.get(item.state)?.push(item))
    return STATE_ORDER.map((s) => [s, by.get(s)]).filter(([, items]) => items.length)
  }, [])

  return (
    <div className="track-grid">
      {grouped.map(([state, items], i) => (
        <Reveal key={state} as="article" className={`card track-card ${state}`} delay={i || undefined}>
          <h3 className="track-head">
            <span className="track-ico"><Icon name={STATE_META[state].icon} /></span>
            {STATE_META[state].label}
            <span className="track-count mono">{items.length}</span>
          </h3>
          <ul className="track-list">
            {items.map((item) => <li key={item.topic}>{item.topic}</li>)}
          </ul>
        </Reveal>
      ))}
    </div>
  )
}

function Note({ note }) {
  return (
    <Reveal as="article" className="card ai-note" id={`note/${note.slug}`}>
      <div className="note-top">
        <span className="note-tag mono">{note.tag}</span>
        <time className="note-date mono" dateTime={note.date}>{fmtDate(note.date)}</time>
      </div>

      <h3 className="note-title">{note.title}</h3>

      {note.body.trim().split(/\n\s*\n/).map((para, i) => (
        <p className="note-body" key={i}>{para.replace(/\s+/g, ' ').trim()}</p>
      ))}

      <p className="note-take">
        <span className="note-take-k mono">Takeaway</span>
        {note.takeaway}
      </p>
    </Reveal>
  )
}

export default function AiLearning() {
  const [tag, setTag] = useState('All')

  const tags = useMemo(() => {
    const counts = new Map()
    aiNotes.forEach((n) => counts.set(n.tag, (counts.get(n.tag) || 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [])

  // Newest first, so the top of the list is always the most recent thing learned.
  const visible = useMemo(() => {
    const sorted = [...aiNotes].sort((a, b) => b.date.localeCompare(a.date))
    return tag === 'All' ? sorted : sorted.filter((n) => n.tag === tag)
  }, [tag])

  return (
    <section id="learning" className="section section-alt">
      <div className="container">
        <SectionHead num="02" title="Learning notes" />

        <Reveal className="ai-intro">
          <p className="lead">
            A running log of what I am learning about building with LLMs. Each entry is one
            thing that turned out to matter in practice, written down so I do not have to
            rediscover it.
          </p>
        </Reveal>

        <Tracker />

        <Reveal className="filter-bar" role="group" aria-label="Filter notes by topic">
          <button
            type="button" className="filter-chip"
            aria-pressed={tag === 'All'} onClick={() => setTag('All')}
          >
            All<span className="count">{aiNotes.length}</span>
          </button>
          {tags.map(([t, n]) => (
            <button
              key={t} type="button" className="filter-chip"
              aria-pressed={tag === t} onClick={() => setTag(t)}
            >
              {t}<span className="count">{n}</span>
            </button>
          ))}
        </Reveal>

        <div className="notes-list">
          {visible.map((n) => <Note key={n.slug} note={n} />)}
          {!visible.length && <p className="filter-empty">No notes under that topic yet.</p>}
        </div>

        <Reveal as="aside" className="card res-card">
          <h3 className="card-title">
            <Icon name="doc" /> Worth going back to
          </h3>
          <ul className="res-list">
            {aiResources.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener noreferrer">
                  {r.label} <Icon name="external" />
                </a>
                <span>{r.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
