import { profile, terminalLines, stats } from '../data/profile'
import { useCountUp, useTypewriter } from '../hooks'
import Icon from './Icon'
import Reveal from './Reveal'

function CodeWindow() {
  return (
    <div className="code-window">
      <div className="cw-bar">
        <span className="cw-dot r" /><span className="cw-dot y" /><span className="cw-dot g" />
        <span className="cw-file mono">OrderEventConsumer.java</span>
      </div>
      <pre className="cw-body mono"><code>
        <Ln /><span className="c-ann">@Service</span>{'\n'}
        <Ln /><span className="c-ann">@RequiredArgsConstructor</span>{'\n'}
        <Ln /><span className="c-kw">public class</span> <span className="c-ty">OrderEventConsumer</span> {'{'}{'\n'}
        <Ln />{'\n'}
        <Ln />{'  '}<span className="c-ann">@KafkaListener</span>(topics = <span className="c-st">"txn.events"</span>,{'\n'}
        <Ln />{'                 '}concurrency = <span className="c-st">"12"</span>){'\n'}
        <Ln />{'  '}<span className="c-kw">public void</span> <span className="c-fn">consume</span>(<span className="c-ty">TxnEvent</span> event) {'{'}{'\n'}
        <Ln />{'    '}idempotency.<span className="c-fn">guard</span>(event.<span className="c-fn">key</span>(), () =&gt; {'{'}{'\n'}
        <Ln />{'      '}ledger.<span className="c-fn">apply</span>(event);{'          '}<span className="c-cm">// PostgreSQL</span>{'\n'}
        <Ln />{'      '}projections.<span className="c-fn">push</span>(event);{'     '}<span className="c-cm">// MongoDB</span>{'\n'}
        <Ln />{'      '}metrics.<span className="c-fn">increment</span>(<span className="c-st">"txn.ok"</span>); <span className="c-cm">// Prometheus</span>{'\n'}
        <Ln />{'    '}{'}'});{'\n'}
        <Ln />{'  '}{'}'}{'\n'}
        <Ln />{'}'}
      </code></pre>
      <div className="cw-status mono">
        <span className="ok">●</span> 1M+ txn/day
        <span className="sep">│</span> p99 &lt; 120ms
        <span className="sep">│</span> 90%+ coverage
      </div>
    </div>
  )
}

const Ln = () => <span className="ln" />

function Stat({ value, suffix = '', prefix = '', label, delay }) {
  const [ref, n] = useCountUp(value)
  return (
    <Reveal className="stat" delay={delay}>
      <span className="stat-num" ref={ref}>{prefix}{n}{suffix}</span>
      <span className="stat-label">{label}</span>
    </Reveal>
  )
}

export function Stats() {
  return (
    <section className="stats-strip" aria-label="Key metrics">
      <div className="container stats-grid">
        {stats.map((s, i) => <Stat key={s.label} {...s} delay={i || undefined} />)}
      </div>
    </section>
  )
}

export default function Hero() {
  const typed = useTypewriter(terminalLines)

  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <Reveal as="p" className="eyebrow">
            <span className="pulse" /> {profile.availability}
          </Reveal>

          <Reveal as="h1" className="hero-title" delay={1}>{profile.name}</Reveal>

          <Reveal as="h2" className="hero-role" delay={2}>
            <span className="grad">{profile.role}</span>
          </Reveal>

          <Reveal as="p" className="hero-type" delay={3}>
            <span className="mono prompt">$</span>
            <span className="mono">{typed}</span>
            <span className="caret" aria-hidden="true" />
          </Reveal>

          <Reveal as="p" className="hero-desc" delay={4}>
            4+ years designing and scaling secure, high-throughput <strong>Java</strong> and{' '}
            <strong>Spring Boot</strong> services across fintech and government platforms.
            I build <strong>event-driven microservices</strong> on <strong>Apache Kafka</strong>{' '}
            and <strong>Redis</strong> at <strong>1M+ daily transaction</strong> scale — with
            REST API design, OAuth 2.0/RBAC security, and PostgreSQL/MongoDB persistence.
          </Reveal>

          <Reveal className="hero-cta" delay={5}>
            <a href="#projects" className="btn btn-primary">
              View my work <Icon name="arrowRight" />
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost">
              <Icon name="mail" /> Get in touch
            </a>
          </Reveal>

          <Reveal className="hero-social" delay={6}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social"><Icon name="github" /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social"><Icon name="linkedin" /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="social"><Icon name="mail" /></a>
            <a href={profile.phoneHref} aria-label="Phone" className="social"><Icon name="phone" /></a>
          </Reveal>
        </div>

        <Reveal className="hero-visual" delay={4}><CodeWindow /></Reveal>
      </div>

      <a href="#about" className="scroll-hint" aria-label="Scroll to about">
        <span className="mouse"><span /></span>
      </a>
    </section>
  )
}
