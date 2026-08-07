import { useReveal } from '../hooks'

/** Wraps children in an element that fades up the first time it's scrolled into view. */
export default function Reveal({ as: Tag = 'div', delay, className = '', children, ...rest }) {
  const [ref, inView] = useReveal()
  return (
    <Tag
      ref={ref}
      className={['reveal', inView && 'in', className].filter(Boolean).join(' ')}
      data-delay={delay}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({ num, title }) {
  return (
    <Reveal className="section-head">
      <span className="section-num mono">{num}</span>
      <h2 className="section-title">{title}</h2>
      <span className="section-rule" />
    </Reveal>
  )
}

export function Tags({ items, hot = [] }) {
  return (
    <div className="tags">
      {items.map((t) => (
        <span key={t} className={hot.includes(t) ? 'tag hot' : 'tag'}>{t}</span>
      ))}
    </div>
  )
}
