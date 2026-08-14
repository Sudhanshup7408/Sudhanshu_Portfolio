import { useMemo, useState } from 'react'
import { projects } from '../data/projects'
import Carousel from './Carousel'
import Icon from './Icon'
import Reveal, { SectionHead, Tags } from './Reveal'

export default function Projects() {
  const [filter, setFilter] = useState('All')

  // Chips are derived from the data, so a new tag adds its own chip.
  const tagCounts = useMemo(() => {
    const counts = new Map()
    projects.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [])

  const visible = projects.filter((p) => filter === 'All' || p.tags.includes(filter))

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHead num="07" title="Key projects" />

        {/* Featured first: the four pieces of the platform, one at a time.
            The filterable list of everything else follows underneath. */}
        <Carousel />

        <Reveal className="filter-bar" role="group" aria-label="Filter projects by area">
          <button
            type="button" className="filter-chip"
            aria-pressed={filter === 'All'} onClick={() => setFilter('All')}
          >
            All<span className="count">{projects.length}</span>
          </button>
          {tagCounts.map(([t, n]) => (
            <button
              key={t} type="button" className="filter-chip"
              aria-pressed={filter === t} onClick={() => setFilter(t)}
            >
              {t}<span className="count">{n}</span>
            </button>
          ))}
        </Reveal>

        {!visible.length && <p className="filter-empty">No projects match that filter.</p>}

        <div className="projects-grid">
          {visible.map((p, i) => (
            <Reveal
              key={p.title}
              as="article"
              className={`card project-card${p.feature ? ' feature' : ''} filtering`}
              delay={(i % 4) || undefined}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
              }}
            >
              <div className="pc-glow" aria-hidden="true" />
              <div className="pc-head">
                <span className="pc-index mono">{p.index}</span>
                <span className={`badge ${p.badgeTone || ''}`.trim()}>{p.badge}</span>
              </div>
              <h3 className="pc-title">{p.title}</h3>
              <p className="pc-desc">{p.desc}</p>

              {p.bullets && (
                <ul className="pc-bullets">
                  {p.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}

              <Tags items={p.stack} />

              {p.links?.length > 0 && (
                <div className="pc-links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                      <Icon name={l.icon || 'external'} /> {l.label}
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
