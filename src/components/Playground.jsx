import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WANDBOX_ENDPOINT, languages } from '../data/playground'
import { copyText } from '../hooks'
import Icon from './Icon'
import Reveal, { SectionHead } from './Reveal'

const RUN_TIMEOUT_MS = 60_000
const TAB = '    '

/* Line-number gutter kept in a sibling element rather than inside the textarea,
   because a textarea cannot render styled children. Scroll is mirrored by hand. */
function Editor({ lang, code, onChange, onRun }) {
  const taRef = useRef(null)
  const gutterRef = useRef(null)

  const lineCount = useMemo(() => code.split('\n').length, [code])

  const syncScroll = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop
    }
  }

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun()
      return
    }
    // Tab must indent, not leave the field. Shift+Tab still escapes for keyboard users.
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      const el = e.currentTarget
      const { selectionStart: s, selectionEnd: end } = el
      const next = `${code.slice(0, s)}${TAB}${code.slice(end)}`
      onChange(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + TAB.length
      })
    }
  }

  return (
    <div className="pg-editor">
      <div className="pg-gutter mono" ref={gutterRef} aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => <span key={i}>{i + 1}</span>)}
      </div>
      <textarea
        ref={taRef}
        className="pg-code mono"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        aria-label={`${lang.label} source code, editable`}
      />
    </div>
  )
}

function OutputPane({ result, state, elapsed }) {
  if (state === 'running') {
    return (
      <div className="pg-out running">
        <p className="pg-out-line mono dim">
          <span className="pg-spin" aria-hidden="true" /> compiling and running remotely…
        </p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="pg-out">
        <p className="pg-out-line mono bad">{result}</p>
        <p className="pg-out-line mono dim">
          The runner is a third-party service, so this can also just mean it is busy or
          unreachable from your network. Try again in a moment.
        </p>
      </div>
    )
  }

  if (state === 'idle' || !result) {
    return (
      <div className="pg-out">
        {/* Deliberately not .pg-out-line: that rule is a flex row, which turns
            every text node between the <kbd>s into its own wrapping item. */}
        <p className="pg-hint mono">
          Press <kbd>Run</kbd>, or <kbd>Ctrl</kbd> <kbd>Enter</kbd> from inside the editor,
          to compile and execute this buffer.
        </p>
      </div>
    )
  }

  const { compileErr, stdout, stderr, status, signal } = result
  const ok = status === '0' && !compileErr
  const nothing = !compileErr && !stdout && !stderr

  return (
    <div className="pg-out">
      {compileErr && (
        <>
          <p className="pg-out-label mono">compile</p>
          <pre className="pg-stream bad mono"><code>{compileErr}</code></pre>
        </>
      )}

      {stdout && (
        <>
          <p className="pg-out-label mono">stdout</p>
          <pre className="pg-stream mono"><code>{stdout}</code></pre>
        </>
      )}

      {stderr && (
        <>
          <p className="pg-out-label mono">stderr</p>
          <pre className="pg-stream warn mono"><code>{stderr}</code></pre>
        </>
      )}

      {nothing && <p className="pg-out-line mono dim">Ran cleanly, printed nothing.</p>}

      <p className={`pg-status mono${ok ? ' ok' : ' bad'}`}>
        <span className="pg-dot" aria-hidden="true" />
        exit {status}
        {signal ? ` · signal ${signal}` : ''}
        {elapsed != null ? ` · ${elapsed}ms` : ''}
        {compileErr ? ' · did not compile' : ''}
      </p>
    </div>
  )
}

export default function Playground() {
  const [langId, setLangId] = useState(languages[0].id)
  const lang = useMemo(() => languages.find((l) => l.id === langId), [langId])

  // One buffer per language, so switching tabs does not throw away your edits.
  const [buffers, setBuffers] = useState(() =>
    Object.fromEntries(languages.map((l) => [l.id, l.code])))
  const [stdin, setStdin] = useState('')
  const [state, setState] = useState('idle')       // idle | running | done | error
  const [result, setResult] = useState(null)
  const [elapsed, setElapsed] = useState(null)
  const [copied, setCopied] = useState(false)

  const abortRef = useRef(null)
  const code = buffers[langId]
  const dirty = code !== lang.code

  const setCode = useCallback((next) => {
    setBuffers((b) => ({ ...b, [langId]: next }))
  }, [langId])

  // Abandon an in-flight run if the section unmounts.
  useEffect(() => () => abortRef.current?.abort(), [])

  const run = useCallback(async () => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const killer = setTimeout(() => ctrl.abort(), RUN_TIMEOUT_MS)

    setState('running')
    setResult(null)
    setElapsed(null)
    const t0 = performance.now()

    try {
      const res = await fetch(WANDBOX_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: lang.compiler,
          code: buffers[lang.id],
          stdin,
          save: false,
        }),
        signal: ctrl.signal,
      })

      if (!res.ok) throw new Error(`Runner returned HTTP ${res.status}.`)
      const j = await res.json()

      setElapsed(Math.round(performance.now() - t0))
      setResult({
        compileErr: (j.compiler_error || '').trim(),
        stdout: (j.program_output || '').replace(/\s+$/, ''),
        stderr: (j.program_error || '').trim(),
        status: j.status ?? '?',
        signal: j.signal || '',
      })
      setState('done')
    } catch (err) {
      if (ctrl.signal.aborted && err.name === 'AbortError') {
        setState('error')
        setResult(`Timed out after ${RUN_TIMEOUT_MS / 1000}s and was cancelled.`)
      } else {
        setState('error')
        setResult(err.message || 'Could not reach the code runner.')
      }
    } finally {
      clearTimeout(killer)
    }
  }, [lang, buffers, stdin])

  const copy = async () => {
    if (!(await copyText(code))) return
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const reset = () => {
    setCode(lang.code)
    setState('idle')
    setResult(null)
    setElapsed(null)
  }

  return (
    <section id="playground" className="section">
      <div className="container">
        <SectionHead num="03" title="Run my code" />

        <Reveal className="ai-intro">
          <p className="lead">
            Not a screenshot and not a mock. Edit any of these buffers and press Run: the code is
            compiled and executed on a real toolchain, and what comes back is the actual process
            output, exit code included. Each one is a pattern I lean on in production.
          </p>
        </Reveal>

        <Reveal className="pg-shell">
          <div className="pg-tabs" role="tablist" aria-label="Language">
            {languages.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={l.id === langId}
                className={`pg-tab${l.id === langId ? ' on' : ''}`}
                onClick={() => setLangId(l.id)}
              >
                {l.label}
                {buffers[l.id] !== l.code && <span className="pg-dirty" aria-label="edited">•</span>}
              </button>
            ))}
          </div>

          <p className="pg-blurb">{lang.blurb}</p>

          <div className="pg-grid">
            <div className="pg-pane">
              <div className="pg-bar">
                <span className="cw-dot r" /><span className="cw-dot y" /><span className="cw-dot g" />
                <span className="pg-file mono">{lang.file}</span>
                <span className="pg-ver mono">{lang.version}</span>

                <span className="pg-bar-actions">
                  <button
                    type="button" className="icon-action sm"
                    onClick={copy}
                    aria-label="Copy this code to the clipboard"
                    title={copied ? 'Copied' : 'Copy code'}
                  >
                    <Icon name={copied ? 'check' : 'copy'} />
                  </button>
                  <button
                    type="button" className="icon-action sm"
                    onClick={reset}
                    disabled={!dirty}
                    aria-label="Restore the original code"
                    title={dirty ? 'Reset to original' : 'Already the original'}
                  >
                    <Icon name="replay" />
                  </button>
                </span>
              </div>

              <Editor lang={lang} code={code} onChange={setCode} onRun={run} />

              <details className="pg-stdin">
                <summary>
                  <Icon name="chevron" />
                  Standard input
                  {stdin && <span className="pg-stdin-on mono">set</span>}
                </summary>
                <textarea
                  className="mono"
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Anything the program should read from stdin"
                  rows={3}
                  spellCheck="false"
                  aria-label="Standard input"
                />
              </details>
            </div>

            <div className="pg-pane">
              <div className="pg-bar">
                <span className="pg-file mono">output</span>
                <span className="pg-bar-actions">
                  <button
                    type="button"
                    className="btn btn-primary pg-run"
                    onClick={run}
                    disabled={state === 'running'}
                  >
                    {state === 'running'
                      ? <><span className="pg-spin" aria-hidden="true" /> Running</>
                      : <><Icon name="bolt" /> Run</>}
                  </button>
                </span>
              </div>

              <OutputPane result={result} state={state} elapsed={elapsed} />
            </div>
          </div>

          <p className="pg-foot">
            Execution is handled by <a href="https://wandbox.org" target="_blank" rel="noopener noreferrer">
            wandbox.org</a>, a public compiler service, so a run needs network access and takes a
            second or two. Nothing is executed in your browser and nothing you type is stored here.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
