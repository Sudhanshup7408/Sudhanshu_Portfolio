import { useCallback, useEffect, useRef, useState } from 'react'

/** Matches a media query and re-renders when it changes. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Dark/light theme, persisted. The initial value is already on <html> from
 *  the inline script in index.html, so read it rather than recomputing. */
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sp-theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle]
}

/** Reports whether the element has scrolled into view yet. Returns [ref, inView].
 *
 *  This is state rather than a classList mutation on purpose: components whose
 *  className changes over time (the RAG diagram, a gallery image that fails to
 *  load) would otherwise have the `in` class overwritten by React on the next
 *  render and silently fade back to opacity 0. */
export function useReveal() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return
        setInView(true)
        obs.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView]
}

/** Counts up to `target` when scrolled into view. Returns [ref, displayValue].
 *
 *  A timer snaps the value to `target` once the animation window has elapsed.
 *  requestAnimationFrame can be starved (a throttled tab, a low-power mode, a
 *  headless renderer), and without the fallback the number would sit on 0
 *  forever, which reads as "0+ years of experience". */
export function useCountUp(target, { duration = 1500 } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let settle = 0

    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return
        obs.disconnect()

        if (reduced) { setValue(target); return }

        let start = null
        const step = (ts) => {
          if (start === null) start = ts
          const p = Math.min((ts - start) / duration, 1)
          setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))   // easeOutCubic
          if (p < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
        settle = setTimeout(() => setValue(target), duration + 300)
      },
      { threshold: 0.6 }
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(settle)
    }
  }, [target, duration, reduced])

  return [ref, value]
}

/** Tracks which section id is currently in view. */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        // The visible section nearest the top of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}

/** Window scroll position plus document scroll progress, rAF-throttled. */
export function useScrollState() {
  const [state, setState] = useState({ y: 0, progress: 0 })

  useEffect(() => {
    let ticking = false
    const read = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setState({ y, progress: max > 0 ? y / max : 0 })
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(read)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    read()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return state
}

/** Cycles through phrases with a typewriter effect. */
export function useTypewriter(phrases, { typeMs = 58, deleteMs = 28, holdMs = 2100 } = {}) {
  const [text, setText] = useState('')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) { setText(phrases[0]); return }

    let phrase = 0
    let char = 0
    let deleting = false
    let timer

    const tick = () => {
      const full = phrases[phrase]
      char += deleting ? -1 : 1
      setText(full.slice(0, char))

      let delay = deleting ? deleteMs : typeMs
      if (!deleting && char === full.length) { delay = holdMs; deleting = true }
      else if (deleting && char === 0) {
        delay = 400
        deleting = false
        phrase = (phrase + 1) % phrases.length
      }
      timer = setTimeout(tick, delay)
    }

    timer = setTimeout(tick, 700)
    return () => clearTimeout(timer)
  }, [phrases, typeMs, deleteMs, holdMs, reduced])

  return text
}

/** Copies text, falling back to execCommand outside a secure context. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text })
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try { ok = document.execCommand('copy') } catch { ok = false }
    ta.remove()
    return ok
  }
}

/** Calls `handler` whenever Escape is pressed and `active` is true. */
export function useEscape(active, handler) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => { if (e.key === 'Escape') handler() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, handler])
}
