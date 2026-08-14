import { useCallback, useEffect, useRef, useState } from 'react'
import { channels, chatAssistant, chatScript, messageFlow } from '../data/bots'
import FlowDiagram from './FlowDiagram'
import { useReducedMotion } from '../hooks'
import Icon from './Icon'
import Reveal, { SectionHead } from './Reveal'

/* ── Animated WhatsApp demo ─────────────────────────────────── */
function ChatDemo() {
  const [shown, setShown] = useState([])
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef(null)
  const frameRef = useRef(null)
  const runId = useRef(0)
  const reduced = useReducedMotion()

  const play = useCallback(async () => {
    const me = ++runId.current
    setShown([])
    setTyping(false)

    if (reduced) { setShown(chatScript); return }

    const wait = (ms) => new Promise((r) => setTimeout(r, ms))

    for (let i = 0; i < chatScript.length; i++) {
      const m = chatScript[i]
      if (m.from === 'in') {
        setTyping(true)
        await wait(700 + Math.min(m.text.length * 6, 700))
        if (me !== runId.current) return          // a newer replay took over
        setTyping(false)
      } else {
        await wait(620)
        if (me !== runId.current) return
      }
      setShown(chatScript.slice(0, i + 1))
      await wait(420)
      if (me !== runId.current) return
    }
  }, [reduced])

  // Keep the transcript pinned to the bottom as it grows.
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown, typing])

  // Start once the phone is actually on screen.
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const io = new IntersectionObserver(([e], obs) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      play()
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [play])

  // Cancel any in-flight run when the component goes away.
  useEffect(() => () => { runId.current++ }, [])

  return (
    <Reveal className="phone-wrap" delay={2}>
      <div className="phone" ref={frameRef}>
        <div className="phone-screen">
          <div className="chat-head">
            <span className="chat-back">‹</span>
            <span className="chat-av">{chatAssistant.avatar}</span>
            <div className="chat-who">
              <strong>{chatAssistant.name}</strong>
              <span>online</span>
            </div>
          </div>

          <div className="chat-body" ref={bodyRef} aria-live="polite"
               aria-label="Demonstration conversation">
            {shown.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <span dangerouslySetInnerHTML={{ __html: m.text }} />
                {m.chips && (
                  <span className="msg-chips">
                    {m.chips.map((c) => <span key={c}>{c}</span>)}
                  </span>
                )}
                {m.meta && <span className="msg-meta">{m.meta}</span>}
              </div>
            ))}
            {typing && <div className="typing"><i /><i /><i /></div>}
          </div>

          <div className="chat-bar">
            <span className="chat-ph">Type a message</span>
            <span className="chat-send">➤</span>
          </div>
        </div>
      </div>

      <button className="btn btn-ghost chat-replay" type="button" onClick={play}>
        <Icon name="replay" /> Replay
      </button>
      <p className="phone-note">Illustration of the live routing flow, not a working service.</p>
    </Reveal>
  )
}

/* ── Section ────────────────────────────────────────────────── */
export default function BotsSection() {
  return (
    <section id="bots" className="section section-alt">
      <div className="container">
        <SectionHead num="04" title="Conversational bots" />

        <Reveal className="ai-intro">
          <p className="lead">
            I build the WhatsApp and web bots that front state government services, plus the CRM
            console the staff behind them work in. Application tracking, service applications, and
            department help desks all run on one multi-tenant Spring Boot backend: same
            conversation engine, three departments, separate flows and separate data.
          </p>
          <div className="ai-pills">
            <span className="pill"><span className="pill-k mono">WhatsApp</span> Meta Cloud API</span>
            <span className="pill"><span className="pill-k mono">Web</span> embeddable widget</span>
            <span className="pill"><span className="pill-k mono">CRM</span> agent and supervisor console</span>
          </div>
        </Reveal>

        <div className="channels-grid">
          {channels.map((c, i) => (
            <Reveal key={c.title} as="article" className="card channel-card" delay={i || undefined}>
              <span className="ai-ico"><Icon name={c.icon} /></span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="bots-grid">
          <Reveal>
            <h3 className="sub-title">What happens to one inbound message</h3>
            <ol className="flow-steps">
              {messageFlow.map(([title, body], i) => (
                <li key={title}>
                  <span className="fs-n mono">{String(i + 1).padStart(2, '0')}</span>
                  <div><strong>{title}</strong><span>{body}</span></div>
                </li>
              ))}
            </ol>
          </Reveal>

          <ChatDemo />
        </div>

        <FlowDiagram />
      </div>
    </section>
  )
}
