import { useCallback, useEffect, useRef, useState } from 'react'
import { builds } from '../data/builds'
import { useReducedMotion } from '../hooks'
import Icon from './Icon'
import Reveal, { Tags } from './Reveal'

const SWIPE_PX = 45

export default function Carousel() {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  const regionRef = useRef(null)
  const touchX = useRef(null)

  const count = builds.length
  const go = useCallback((next) => setI(((next % count) + count) % count), [count])

  // Arrow keys only steer the carousel while it actually holds focus, so they
  // still scroll the page everywhere else.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(i - 1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) }
  }

  useEffect(() => {
    const el = regionRef.current
    if (!el) return
    const start = (e) => { touchX.current = e.touches[0].clientX }
    const end = (e) => {
      if (touchX.current == null) return
      const dx = e.changedTouches[0].clientX - touchX.current
      if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? i + 1 : i - 1)
      touchX.current = null
    }
    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('touchend', end, { passive: true })
    return () => {
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchend', end)
    }
  }, [i, go])

  return (
    <Reveal className="car-wrap">
      <div className="car-head">
        <div>
          <h3 className="sub-title">What I built on the platform</h3>
          <p className="car-sub">
            Four pieces, one multi-tenant backend. Same shape each time: the problem, what I
            built, what changed.
          </p>
        </div>

        <div className="car-nav">
          <button
            type="button" className="icon-action" onClick={() => go(i - 1)}
            aria-label="Previous build" title="Previous"
          >
            <Icon name="chevron" className="chev-prev" />
          </button>
          <span className="car-count mono" aria-hidden="true">
            {String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <button
            type="button" className="icon-action" onClick={() => go(i + 1)}
            aria-label="Next build" title="Next"
          >
            <Icon name="chevron" className="chev-next" />
          </button>
        </div>
      </div>

      <div
        className="car-viewport"
        ref={regionRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Builds on the citizen services platform"
        onKeyDown={onKeyDown}
      >
        <div
          className={`car-track${reduced ? ' no-anim' : ''}`}
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {builds.map((b, idx) => (
            <article
              className="car-slide"
              key={b.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${count}: ${b.title}`}
              aria-hidden={idx !== i}
            >
              <div className="card car-card">
                <div className="car-card-head">
                  <span className="car-ico"><Icon name={b.icon} /></span>
                  <div className="car-id">
                    <span className="car-kind">{b.kind}</span>
                    <h4>{b.title}</h4>
                    <p className="mono">{b.sub}</p>
                  </div>
                  <span className="car-index mono" aria-hidden="true">{b.index}</span>
                </div>

                <dl className="car-body">
                  <div>
                    <dt>Problem</dt>
                    <dd>{b.problem.replace(/\s+/g, ' ').trim()}</dd>
                  </div>
                  <div>
                    <dt>Built</dt>
                    <dd>{b.built.replace(/\s+/g, ' ').trim()}</dd>
                  </div>
                  <div>
                    <dt>Result</dt>
                    <dd>{b.result.replace(/\s+/g, ' ').trim()}</dd>
                  </div>
                </dl>

                <ul className="car-metrics">
                  {b.metrics.map(([k, v]) => (
                    <li key={k}>
                      <span className="cm-k">{k}</span>
                      <span className="cm-v mono">{v}</span>
                    </li>
                  ))}
                </ul>

                <Tags items={b.stack} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="car-dots" role="tablist" aria-label="Choose a build">
        {builds.map((b, idx) => (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={idx === i}
            className={`car-dot${idx === i ? ' on' : ''}`}
            onClick={() => go(idx)}
          >
            <span className="car-dot-bar" aria-hidden="true" />
            <span className="car-dot-label">{b.title}</span>
          </button>
        ))}
      </div>

      <p className="car-live" role="status" aria-live="polite">
        {`Showing ${builds[i].title}, ${i + 1} of ${count}.`}
      </p>
    </Reveal>
  )
}
