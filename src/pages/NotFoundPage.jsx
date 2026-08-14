import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'

export default function NotFoundPage() {
  return (
    <section className="page-hero nf-hero">
      <div className="container">
        <Reveal as="p" className="nf-code mono">404</Reveal>
        <Reveal as="h1" className="page-title" delay={1}>
          No route <span className="grad">matched.</span>
        </Reveal>
        <Reveal as="p" className="page-sub" delay={2}>
          That path does not exist on this site. The portfolio lives at the root, and the AI
          engineering write-up has its own page.
        </Reveal>
        <Reveal className="page-cta" delay={3}>
          <Link to="/" className="btn btn-primary">
            Back to the portfolio <Icon name="arrowRight" />
          </Link>
          <Link to="/ai" className="btn btn-ghost">
            <Icon name="spark" /> AI engineering
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
