// import './lecture.css'            // optional: styles only this lecture needs
import { Callout, Code, Figure, PauseBadge, Reveal, Section, Step } from '../../design-system'
import { Cpu, Laptop } from '../../design-system/illustrations'

export default function Lecture() {
  return (
    <>
      <Section id="intro" eyebrow="Warm-up" title="A question to hook the class" intro="One or two sentences." tone="alt">
        <Reveal className="card">
          <p>Put an interactive warm-up here.</p>
        </Reveal>
      </Section>

      {/* steps={3}: in guided mode the instructor reveals each <Step> with → */}
      <Section id="concept" eyebrow="Core concept" title="Explain the big idea" steps={3}>
        <div className="split">
          <Step n={1}>
            <p className="lead">Point one, revealed first…</p>
            <Figure caption="A picture helps">
              <Laptop size={120} />
            </Figure>
          </Step>
          <Step n={2}>
            <Code lines={['// …then the code', 'console.log("Hello, Catalyst!");']} />
            <Cpu size={72} />
          </Step>
        </div>
        <Callout step={3}>Connect it to their work as developers.</Callout>
        <PauseBadge />
      </Section>
    </>
  )
}
