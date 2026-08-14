import { award, certifications, education, focusAreas, profile, publication } from '../data/profile'
import { skills } from '../data/skills'
import { experience } from '../data/experience'
import Icon from './Icon'
import Reveal, { SectionHead, Tags } from './Reveal'

/* ── About ──────────────────────────────────────────────────── */
export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHead num="01" title="About me" />

        <div className="about-grid">
          <Reveal className="about-copy">
            <p className="lead">
              I'm a backend engineer who likes the unglamorous half of the stack: the queues,
              the retries, the idempotency keys, the dashboard that tells you at 2 a.m. exactly
              which consumer fell behind.
            </p>
            <p>
              Over the last four years I've shipped production systems at <strong>NPCI</strong>,{' '}
              <strong>Newgen</strong>, <strong>Paytm</strong>, and now{' '}
              <strong>PeLocal Fintech</strong>: payment rails moving a million transactions a
              day, document pipelines that replaced $15K/year of licensed software, and
              multi-tenant government portals serving three departments off one Spring Boot
              backend.
            </p>
            <p>
              Lately I've been shipping <strong>Spring AI</strong> to production: a RAG pipeline
              over <strong>pgvector</strong> embeddings with semantic search that cut support
              queries by ~40%, and token-by-token LLM streaming to clients over WebSocket and SSE.
            </p>

            <ul className="about-facts">
              <li><Icon name="pin" /> {profile.location}</li>
              <li><Icon name="badge" /> B.Tech CSE, DIT University</li>
              <li><Icon name="star" /> Pinnacle Performance Award, Newgen</li>
            </ul>
          </Reveal>

          <Reveal as="aside" className="about-side" delay={2}>
            <div className="card focus-card">
              <h3 className="card-title">What I focus on</h3>
              <ul className="focus-list">
                {focusAreas.map((f) => (
                  <li key={f.title}>
                    <span className="focus-ico">◈</span>
                    <div><strong>{f.title}</strong><span>{f.body}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Skills ─────────────────────────────────────────────────── */
export function Skills() {
  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <SectionHead num="02" title="Technical skills" />
        <div className="skills-grid">
          {skills.map((s, i) => (
            <Reveal key={s.title} as="article" className="card skill-card" delay={(i % 4) || undefined}>
              <div className="skill-top">
                <span className="skill-ico"><Icon name={s.icon} /></span>
                <h3>{s.title}</h3>
              </div>
              <Tags items={s.tags} hot={s.hot} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Experience ─────────────────────────────────────────────── */
const renderPoint = (parts, key) => (
  <li key={key}>
    {parts.map((p, i) => (typeof p === 'string' ? p : <b key={i}>{p.b}</b>))}
  </li>
)

export function Experience() {
  return (
    <section id="experience" className="section section-alt">
      <div className="container">
        <SectionHead num="06" title="Experience" />

        <div className="timeline">
          {experience.map((job) => (
            <Reveal key={job.company} as="article" className="tl-item">
              <div className="tl-node"><span className="tl-ring" /></div>
              <div className="card tl-card">
                <div className="tl-head">
                  <div>
                    <h3 className="tl-company">{job.company}</h3>
                    <p className="tl-role">{job.role}</p>
                  </div>
                  <div className="tl-meta">
                    <span className={`chip${job.current ? ' chip-live' : ''}`}>
                      {job.current && <span className="pulse" />}{job.dates}
                    </span>
                    <span className="tl-loc">{job.location}</span>
                  </div>
                </div>
                <ul className="tl-points">
                  {job.points.map((p, i) => renderPoint(p, i))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Education ──────────────────────────────────────────────── */
export function Education() {
  return (
    <section id="education" className="section section-alt">
      <div className="container">
        <SectionHead num="08" title="Education, recognition & research" />

        <div className="edu-grid">
          <Reveal className="card edu-card">
            <span className="edu-ico"><Icon name="cap" /></span>
            <h3>{education.degree}</h3>
            <p className="edu-org">{education.school}</p>
            <p className="edu-date mono">{education.dates}</p>
          </Reveal>

          <Reveal className="card edu-card" delay={1}>
            <span className="edu-ico gold"><Icon name="trophy" /></span>
            <h3>{award.title}</h3>
            <p className="edu-org">{award.org}</p>
            <p className="edu-date">{award.note}</p>
          </Reveal>

          <Reveal className="card edu-card" delay={2}>
            <span className="edu-ico"><Icon name="list" /></span>
            <h3>Certifications</h3>
            {certifications.map((c) => <p className="edu-org" key={c}>{c}</p>)}
          </Reveal>

          <Reveal as="article" className="card edu-card pub-card" delay={3}>
            <span className="edu-ico"><Icon name="doc" /></span>
            <h3>{publication.title}</h3>
            <p className="edu-org">{publication.authors}</p>
            <p className="edu-date mono">{publication.venue} · {publication.date}</p>
            <p className="pub-note">{publication.note.replace(/\s+/g, ' ').trim()}</p>
            <a
              className="pub-link"
              href={publication.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read on IEEE Xplore <Icon name="external" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Contact ────────────────────────────────────────────────── */
export function Contact({ onCopyEmail }) {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <Reveal className="contact-wrap">
          <p className="eyebrow center"><span className="pulse" /> Open to opportunities</p>
          <h2 className="contact-title">
            Let's build something<br /><span className="grad">that stays up.</span>
          </h2>
          <p className="contact-sub">
            Looking for a backend engineer who's comfortable with high-throughput systems,
            event-driven architecture, and production ownership? I'd like to hear about it.
          </p>

          {/* Three identical boxes on one baseline. The previous mix of two
              wide btn-lg pills and one square icon button could not line up. */}
          <div className="contact-actions">
            <a
              className="icon-action lg primary"
              href={`mailto:${profile.email}`}
              aria-label={`Email ${profile.email}`}
              title="Send an email"
            >
              <Icon name="mail" />
            </a>
            <a
              className="icon-action lg"
              href={profile.phoneHref}
              aria-label={`Call ${profile.phone}`}
              title="Call"
            >
              <Icon name="phone" />
            </a>
            <button
              className="icon-action lg"
              type="button"
              onClick={onCopyEmail}
              aria-label="Copy email address to clipboard"
              title="Copy email address"
            >
              <Icon name="copy" />
            </button>
          </div>

          {/* The icons say "how"; this says "what". Selectable, so the address
              is still readable and copyable without clicking anything. */}
          <p className="contact-detail mono">
            <span>{profile.email}</span>
            <span className="sep" aria-hidden="true">·</span>
            <span>{profile.phone}</span>
          </p>

          <div className="contact-links">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="sep">·</span>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="sep">·</span>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer">Download résumé</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="mono">© {new Date().getFullYear()} {profile.name}</span>
        <span className="mono muted">Built with React, Vite and hand-written CSS.</span>
      </div>
    </footer>
  )
}
