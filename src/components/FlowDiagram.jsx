import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import Reveal from './Reveal'

/* A generic conversation-design tree: welcome menu → three intents → the
   step each needs → its terminal state, plus the return-to-menu path.
   Drawn rather than screenshotted so it carries no client content. */
export default function FlowDiagram() {
  const scrollRef = useRef(null)
  const [state, setState] = useState({ scrollable: false, atEnd: false })

  const sync = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const scrollable = el.scrollWidth - el.clientWidth > 4
    setState({
      scrollable,
      atEnd: scrollable && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    document.fonts?.ready.then(sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const cls = `card diagram-card${state.scrollable ? ' is-scrollable' : ''}${state.atEnd ? ' at-end' : ''}`

  // [x, y, title, subtitle]
  const NODES = [
    [224, 48, 'Track an application', 'intent'],
    [434, 48, 'Ask for reference no.', 'slot fill'],
    [644, 48, 'Status + timeline', 'resolved'],

    [224, 158, 'Apply for a service', 'intent'],
    [434, 158, 'Choose department', 'slot fill'],
    [644, 158, 'Submit + reference', 'resolved'],

    [224, 268, 'Talk to an agent', 'intent'],
    [434, 268, 'Queue + SLA ticket', 'escalation'],
    [644, 268, 'Live agent', 'handed off'],
  ]

  return (
    <Reveal as="figure" className={cls}>
      <figcaption className="diagram-cap">
        <h3>Conversation design: one department's flow</h3>
        <p>Every branch, the slots each intent needs filled, and the escalation path out.</p>
      </figcaption>

      <div className="diagram-viewport">
        <div className="diagram-scroll" ref={scrollRef} onScroll={sync}>
          <svg
            className="rag-svg" viewBox="0 0 920 440" role="img"
            aria-label="Conversation flow. A welcome menu offers three intents. Track an application asks for a reference number and returns a status and timeline. Apply for a service asks which department, then submits and returns a reference. Talk to an agent raises an SLA-tracked ticket and hands off to a live agent. Any terminal state returns to the main menu. Unrecognised input reprompts twice before handing off, and inactivity ends the session."
          >
            <defs>
              <marker id="flowArrow" viewBox="0 0 10 10" refX="9" refY="5"
                      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path className="dg-head" d="M0 0 L10 5 L0 10 z" />
              </marker>
            </defs>

            <text className="t-lane" x="14" y="24">CITIZEN SERVICES BOT · FLOW TREE</text>

            {/* welcome menu */}
            <rect className="dg-store" x="14" y="158" width="180" height="54" rx="12" />
            <text className="t-title" x="104" y="181" textAnchor="middle">Welcome menu</text>
            <text className="t-sub" x="104" y="199" textAnchor="middle">3 options</text>

            {/* menu → each intent */}
            <path className="dg-line" d="M194 185 H 209 V 75 H 218" markerEnd="url(#flowArrow)" />
            <path className="dg-line" d="M194 185 H 218" markerEnd="url(#flowArrow)" />
            <path className="dg-line" d="M194 185 H 209 V 295 H 218" markerEnd="url(#flowArrow)" />

            {NODES.map(([x, y, title, sub]) => (
              <g key={title}>
                <rect className="dg-box" x={x} y={y} width="180" height="54" rx="12" />
                <text className="t-title" x={x + 90} y={y + 23} textAnchor="middle">{title}</text>
                <text className="t-sub" x={x + 90} y={y + 41} textAnchor="middle">{sub}</text>
              </g>
            ))}

            {/* step → step, per row */}
            {[75, 185, 295].map((y) => (
              <g key={y}>
                <path className="dg-line" d={`M404 ${y} H 428`} markerEnd="url(#flowArrow)" />
                <path className="dg-line" d={`M614 ${y} H 638`} markerEnd="url(#flowArrow)" />
              </g>
            ))}

            {/* any terminal state returns to the menu */}
            <path className="dg-line dg-return" d="M824 295 H 860 V 372 H 104 V 218"
                  markerEnd="url(#flowArrow)" />
            <text className="t-edge" x="470" y="394" textAnchor="middle">back to main menu</text>

            <text className="t-edge" x="14" y="428">
              fallback · unrecognised input reprompts twice, then hands off · inactivity ends the session
            </text>
          </svg>
        </div>
      </div>

      <p className="diagram-hint">
        <Icon name="arrowRight" /> Drag the diagram sideways to follow the full tree
      </p>
    </Reveal>
  )
}
