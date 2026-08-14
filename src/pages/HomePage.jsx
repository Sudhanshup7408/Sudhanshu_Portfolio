import Hero, { Stats } from '../components/Hero'
import Playground from '../components/Playground'
import BotsSection from '../components/BotsSection'
import Challenges from '../components/Challenges'
import Projects from '../components/Projects'
import { About, Contact, Education, Experience, Skills } from '../components/Sections'

/* Section numbering is sequential per page. AI engineering now lives on /ai and
   carries its own numbers, so everything after Skills shifted down by one. */
export default function HomePage({ onCopyEmail }) {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Playground />
      <BotsSection />
      <Challenges />
      <Experience />
      <Projects />
      <Education />
      <Contact onCopyEmail={onCopyEmail} />
    </>
  )
}
