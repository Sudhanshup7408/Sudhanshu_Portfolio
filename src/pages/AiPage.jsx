import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AiSection from '../components/AiSection'
import AiLearning from '../components/AiLearning'
import { Contact } from '../components/Sections'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'

export default function AiPage({ onCopyEmail }) {
  useEffect(() => {
    document.title = 'AI engineering · Sudhanshu Pal'
    return () => { document.title = 'Sudhanshu Pal · Senior Backend Engineer' }
  }, [])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal as="p" className="crumb">
            <Link to="/">Portfolio</Link>
            <span className="crumb-sep">/</span>
            <span aria-current="page">AI engineering</span>
          </Reveal>

          <Reveal as="h1" className="page-title" delay={1}>
            AI <span className="grad">engineering</span>
          </Reveal>

          <Reveal as="p" className="page-sub" delay={2}>
            The production LLM work, and the running notes from learning it. Retrieval over
            pgvector, grounded prompts, and streamed answers, built with Spring AI on the same
            Java stack as everything else I ship.
          </Reveal>

          <Reveal className="page-cta" delay={3}>
            <a href="#ai" className="btn btn-primary">
              What runs in production <Icon name="arrowRight" />
            </a>
            <a href="#learning" className="btn btn-ghost">
              <Icon name="list" /> Learning notes
            </a>
          </Reveal>
        </div>
      </section>

      <AiSection />
      <AiLearning />
      <Contact onCopyEmail={onCopyEmail} />
    </>
  )
}
