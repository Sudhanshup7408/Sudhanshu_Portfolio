import { useCallback, useEffect, useRef, useState } from 'react'
import { aiCapabilities } from '../data/bots'
import Icon from './Icon'
import Reveal, { SectionHead } from './Reveal'

const Ln = () => <span className="ln" />

function RagDiagram() {
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
    document.fonts?.ready.then(sync)      // fonts change the measurement
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const cls = `card diagram-card${state.scrollable ? ' is-scrollable' : ''}${state.atEnd ? ' at-end' : ''}`

  return (
    <Reveal as="figure" className={cls}>
      <figcaption className="diagram-cap">
        <h3>Retrieval-augmented generation — request path</h3>
        <p>How a citizen question becomes a grounded, streamed answer.</p>
      </figcaption>

      <div className="diagram-viewport">
        <div className="diagram-scroll" ref={scrollRef} onScroll={sync}>
          <svg
            className="rag-svg" viewBox="0 0 920 440" role="img"
            aria-label="RAG architecture. Phase one, batch indexing: source documents are chunked and embedded with Spring AI, then written to a pgvector store. Phase two, per request: a user question is embedded, top-k matching chunks are retrieved from pgvector, assembled into a grounded prompt, and sent to the LLM. The response streams back token-by-token to the client over WebSocket or SSE."
          >
            <defs>
              <marker id="dgArrow" viewBox="0 0 10 10" refX="9" refY="5"
                      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path className="dg-head" d="M0 0 L10 5 L0 10 z" />
              </marker>
            </defs>

            <text className="t-lane" x="14" y="24">01 · INDEX — BATCH</text>

            <rect className="dg-box" x="14" y="42" width="170" height="62" rx="12" />
            <text className="t-title" x="99" y="72" textAnchor="middle">Source documents</text>
            <text className="t-sub" x="99" y="91" textAnchor="middle">PDF · DOCX · FAQ</text>

            <rect className="dg-box" x="214" y="42" width="170" height="62" rx="12" />
            <text className="t-title" x="299" y="72" textAnchor="middle">Chunk + embed</text>
            <text className="t-sub" x="299" y="91" textAnchor="middle">Spring AI</text>

            <path className="dg-line" d="M184 73 H 208" markerEnd="url(#dgArrow)" />
            <path className="dg-line" d="M384 73 H 440 Q 460 73 460 93 V 150" markerEnd="url(#dgArrow)" />

            <rect className="dg-store" x="352" y="160" width="216" height="76" rx="14" />
            <text className="t-title" x="460" y="192" textAnchor="middle">pgvector store</text>
            <text className="t-sub" x="460" y="212" textAnchor="middle">embeddings + metadata</text>

            <path className="dg-line" d="M460 236 V 296" markerEnd="url(#dgArrow)" />
            <text className="t-edge" x="472" y="272">top-k chunks</text>

            <text className="t-lane" x="14" y="286">02 · RETRIEVE + GENERATE — PER REQUEST</text>

            <rect className="dg-box" x="14" y="304" width="157" height="62" rx="12" />
            <text className="t-title" x="92" y="334" textAnchor="middle">User question</text>
            <text className="t-sub" x="92" y="353" textAnchor="middle">WhatsApp · Web</text>

            <rect className="dg-box" x="197" y="304" width="157" height="62" rx="12" />
            <text className="t-title" x="275" y="334" textAnchor="middle">Embed query</text>
            <text className="t-sub" x="275" y="353" textAnchor="middle">Spring AI</text>

            <rect className="dg-box" x="380" y="304" width="157" height="62" rx="12" />
            <text className="t-title" x="458" y="334" textAnchor="middle">Semantic search</text>
            <text className="t-sub" x="458" y="353" textAnchor="middle">similarity + filter</text>

            <rect className="dg-box" x="563" y="304" width="157" height="62" rx="12" />
            <text className="t-title" x="641" y="334" textAnchor="middle">Grounded prompt</text>
            <text className="t-sub" x="641" y="353" textAnchor="middle">context injected</text>

            <rect className="dg-box dg-accent" x="746" y="304" width="157" height="62" rx="12" />
            <text className="t-title" x="824" y="334" textAnchor="middle">LLM</text>
            <text className="t-sub" x="824" y="353" textAnchor="middle">streaming</text>

            <path className="dg-line" d="M171 335 H 191" markerEnd="url(#dgArrow)" />
            <path className="dg-line" d="M354 335 H 374" markerEnd="url(#dgArrow)" />
            <path className="dg-line" d="M537 335 H 557" markerEnd="url(#dgArrow)" />
            <path className="dg-line" d="M720 335 H 740" markerEnd="url(#dgArrow)" />

            <path className="dg-line dg-return" d="M824 366 V 400 H 92 V 374" markerEnd="url(#dgArrow)" />
            <text className="t-edge" x="458" y="424" textAnchor="middle">
              token-by-token response · WebSocket / SSE
            </text>
          </svg>
        </div>
      </div>

      <p className="diagram-hint">
        <Icon name="arrowRight" /> Drag the diagram sideways to follow the full path
      </p>
    </Reveal>
  )
}

function RagCode() {
  return (
    <Reveal className="code-window ai-code" delay={2}>
      <div className="cw-bar">
        <span className="cw-dot r" /><span className="cw-dot y" /><span className="cw-dot g" />
        <span className="cw-file mono">RagChatService.java</span>
      </div>
      <pre className="cw-body mono"><code>
        <Ln /><span className="c-ann">@Service</span>{'\n'}
        <Ln /><span className="c-ann">@RequiredArgsConstructor</span>{'\n'}
        <Ln /><span className="c-kw">public class</span> <span className="c-ty">RagChatService</span> {'{'}{'\n'}
        <Ln />{'\n'}
        <Ln />{'  '}<span className="c-kw">private final</span> <span className="c-ty">VectorStore</span> store;  <span className="c-cm">// pgvector</span>{'\n'}
        <Ln />{'  '}<span className="c-kw">private final</span> <span className="c-ty">ChatClient</span>{'  '}chat;   <span className="c-cm">// Spring AI</span>{'\n'}
        <Ln />{'\n'}
        <Ln />{'  '}<span className="c-kw">public</span> <span className="c-ty">Flux</span>&lt;<span className="c-ty">String</span>&gt; <span className="c-fn">ask</span>(<span className="c-ty">String</span> q, <span className="c-ty">String</span> tenant) {'{'}{'\n'}
        <Ln />{'\n'}
        <Ln />{'    '}<span className="c-kw">var</span> ctx = store.<span className="c-fn">similaritySearch</span>({'\n'}
        <Ln />{'        '}<span className="c-ty">SearchRequest</span>.<span className="c-fn">query</span>(q){'\n'}
        <Ln />{'            '}.<span className="c-fn">withTopK</span>(<span className="c-nm">6</span>){'\n'}
        <Ln />{'            '}.<span className="c-fn">withFilterExpression</span>(<span className="c-fn">scopedTo</span>(tenant)));{'\n'}
        <Ln />{'\n'}
        <Ln />{'    '}<span className="c-kw">return</span> chat.<span className="c-fn">prompt</span>(){'\n'}
        <Ln />{'        '}.<span className="c-fn">system</span>(ANSWER_FROM_CONTEXT_ONLY){'\n'}
        <Ln />{'        '}.<span className="c-fn">user</span>(u -&gt; u.<span className="c-fn">text</span>(q).<span className="c-fn">param</span>(<span className="c-st">"context"</span>, ctx)){'\n'}
        <Ln />{'        '}.<span className="c-fn">stream</span>(){'\n'}
        <Ln />{'        '}.<span className="c-fn">content</span>();{'               '}<span className="c-cm">{'// → WebSocket / SSE'}</span>{'\n'}
        <Ln />{'  '}{'}'}{'\n'}
        <Ln />{'}'}
      </code></pre>
    </Reveal>
  )
}

export default function AiSection() {
  return (
    <section id="ai" className="section">
      <div className="container">
        <SectionHead num="03" title="AI engineering" />

        <Reveal className="ai-intro">
          <p className="lead">
            I ship LLM features the same way I ship payment rails — grounded, observable, and
            boring to operate. The conversational stack at PeLocal runs on{' '}
            <strong>Spring AI</strong> with retrieval over <strong>pgvector</strong>, so answers
            come from the department's own documents rather than the model's memory.
          </p>
          <div className="ai-pills">
            <span className="pill"><span className="pill-k mono">~40%</span> fewer inbound support queries</span>
            <span className="pill"><span className="pill-k mono">pgvector</span> semantic retrieval</span>
            <span className="pill"><span className="pill-k mono">WS / SSE</span> token streaming</span>
          </div>
        </Reveal>

        <RagDiagram />

        <div className="ai-grid">
          <Reveal as="ul" className="ai-caps">
            {aiCapabilities.map((c) => (
              <li className="card ai-cap" key={c.title}>
                <span className="ai-ico"><Icon name={c.icon} /></span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </li>
            ))}
          </Reveal>

          <RagCode />
        </div>
      </div>
    </section>
  )
}
