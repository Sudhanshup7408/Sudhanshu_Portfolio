/* The "Challenges I faced" section. Entry data still lives in data/posts.js.

   The CSS class names are all `log-*` because this started life as a problem log;
   they are internal names and renaming them across styles.css would be churn for
   no behaviour change. The user-facing name, the section id, and the deep-link
   prefix are all "challenges". */
import { useEffect, useMemo, useState } from 'react'
import { posts } from '../data/posts'
import Icon from './Icon'
import Reveal, { SectionHead } from './Reveal'

const KIND_ICON = {
  'Production incident': 'alert',
  Build: 'wrench',
  Bug: 'bug',
  Performance: 'pulse',
}

const HASH_PREFIX = 'challenges'

const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

function Entry({ post, open, onToggle }) {
  return (
    <article className={`card log-entry${open ? ' open' : ''}`} id={`${HASH_PREFIX}/${post.slug}`}>
      <h3 className="log-head-wrap">
        <button
          type="button"
          className="log-head"
          aria-expanded={open}
          aria-controls={`challenge-body-${post.slug}`}
          onClick={onToggle}
        >
          <span className={`log-kind ${post.tone}`}>
            <Icon name={KIND_ICON[post.kind] || 'bug'} />
            {post.kind}
          </span>

          <span className="log-title">{post.title}</span>
          <span className="log-summary">{post.summary}</span>

          <span className="log-meta">
            <time className="mono" dateTime={post.date}>{fmtDate(post.date)}</time>
            {post.tags.map((t) => <span key={t} className="log-tag mono">{t}</span>)}
          </span>

          <span className="log-chevron" aria-hidden="true"><Icon name="chevron" /></span>
        </button>
      </h3>

      <div
        className="log-body"
        id={`challenge-body-${post.slug}`}
        hidden={!open}
      >
        <div className="log-body-inner">
          <Block label="Symptom" body={post.symptom} />

          {post.evidence && (
            <div className="log-block">
              <span className="log-label mono">Evidence</span>
              <div className="log-pre">
                <span className="log-pre-label mono">{post.evidence.label}</span>
                <pre className="mono"><code>{post.evidence.body}</code></pre>
              </div>
            </div>
          )}

          <Block label="Root cause" body={post.cause} />

          <div className="log-block">
            <span className="log-label mono">Fix</span>
            <ol className="log-steps">
              {post.fix.map((step, i) => (
                <li key={i}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{step}</li>
              ))}
            </ol>
          </div>

          {post.code && (
            <div className="log-block">
              <span className="log-label mono">Code</span>
              <div className="log-pre">
                <span className="log-pre-label mono">{post.code.label}</span>
                <pre className="mono"><code>{post.code.body}</code></pre>
              </div>
            </div>
          )}

          <Block label="Outcome" body={post.outcome} />

          <div className="log-takeaway">
            <span className="log-label mono">Takeaway</span>
            <p>{post.takeaway}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function Block({ label, body }) {
  return (
    <div className="log-block">
      <span className="log-label mono">{label}</span>
      <p>{body}</p>
    </div>
  )
}

export default function Challenges() {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('All')
  const [openSlug, setOpenSlug] = useState(null)

  const sorted = useMemo(
    () => [...posts].sort((a, b) => b.date.localeCompare(a.date)),
    []
  )

  const tagCounts = useMemo(() => {
    const counts = new Map()
    sorted.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [sorted])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sorted.filter((p) => {
      if (tag !== 'All' && !p.tags.includes(tag)) return false
      if (!q) return true
      return [p.title, p.summary, p.symptom, p.cause, p.takeaway, ...p.tags]
        .join(' ').toLowerCase().includes(q)
    })
  }, [sorted, query, tag])

  // #challenges/<slug> opens that entry and scrolls to it.
  useEffect(() => {
    const openFromHash = () => {
      const m = window.location.hash.match(/^#challenges\/(.+)$/)
      if (!m) return
      const slug = decodeURIComponent(m[1])
      if (!sorted.some((p) => p.slug === slug)) return
      setQuery('')
      setTag('All')
      setOpenSlug(slug)
      requestAnimationFrame(() => {
        // Instant, not smooth: someone arriving on a deep link expects to land
        // there, not to watch the whole page scroll past first.
        document.getElementById(`${HASH_PREFIX}/${slug}`)
          ?.scrollIntoView({ block: 'center', behavior: 'instant' })
      })
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [sorted])

  const toggle = (slug) => {
    setOpenSlug((cur) => {
      const next = cur === slug ? null : slug
      // Keep the URL shareable without pushing a history entry per click.
      history.replaceState(
        null, '',
        next ? `#${HASH_PREFIX}/${next}` : location.pathname + location.search
      )
      return next
    })
  }

  return (
    <section id="challenges" className="section">
      <div className="container">
        <SectionHead num="05" title="Challenges I faced" />

        <Reveal className="log-intro">
          <p className="lead">
            Things that broke in production and what actually fixed them. Written up while the
            details were still fresh: the symptom, the root cause, the fix, and the part worth
            remembering next time.
          </p>
        </Reveal>

        <Reveal className="log-controls">
          <div className="log-search">
            <Icon name="search" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the challenges: Kafka, timeout, Maven…"
              aria-label="Search challenges"
            />
          </div>

          <div className="filter-bar log-filters" role="group" aria-label="Filter by tag">
            <button
              type="button"
              className="filter-chip"
              aria-pressed={tag === 'All'}
              onClick={() => setTag('All')}
            >
              All<span className="count">{sorted.length}</span>
            </button>
            {tagCounts.map(([t, n]) => (
              <button
                key={t}
                type="button"
                className="filter-chip"
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
              >
                {t}<span className="count">{n}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="log-list">
          {visible.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i, 3) || undefined}>
              <Entry
                post={post}
                open={openSlug === post.slug}
                onToggle={() => toggle(post.slug)}
              />
            </Reveal>
          ))}
        </div>

        {!visible.length && (
          <p className="filter-empty">
            No challenge matches that yet.
          </p>
        )}
      </div>
    </section>
  )
}
