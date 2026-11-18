import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section } from './ui'

const types = {
  desktop: {
    label: '🖥 Desktop',
    blurb: 'Stays on a desk, with a separate monitor, keyboard and system unit.',
    meters: [['Portability', 1, 'Stays on a desk'], ['Performance', 5, 'Highest']],
    facts: [['Power', 'Wall socket'], ['Main input', 'Keyboard + mouse'], ['Best for', 'Gaming and design']],
  },
  laptop: {
    label: '💻 Laptop',
    blurb: 'Screen, keyboard and processor in one portable device with a battery.',
    meters: [['Portability', 3, 'Fits in a bag'], ['Performance', 4, 'High']],
    facts: [['Power', 'Battery or charger'], ['Main input', 'Keyboard + trackpad'], ['Best for', 'Coding, study, work']],
  },
  mobile: {
    label: '📱 Mobile',
    blurb: 'Phones and tablets: tiny, touch-first, packed with sensors.',
    meters: [['Portability', 5, 'Fits in a pocket'], ['Performance', 3, 'Good']],
    facts: [['Power', 'Battery'], ['Main input', 'Touch, voice, camera'], ['Best for', 'Calls, apps, browsing']],
  },
}

function Meter({ label, value, text }) {
  return (
    <div className="meter">
      <div className="meter-head">
        <span>{label}</span>
        <strong>{text}</strong>
      </div>
      <div className="meter-track" role="img" aria-label={`${label}: ${value} out of 5`}>
        <motion.div className="meter-fill" initial={{ width: 0 }} animate={{ width: `${value * 20}%` }} transition={{ duration: 0.6 }} />
      </div>
    </div>
  )
}

const embedded = [
  ['⌚', 'Smartwatch', ['Wrist motion', 'Count steps', 'Step count on screen']],
  ['🚗', 'Car', ['Wheel sensors', 'Detect skidding', 'ABS pumps the brakes']],
  ['🧺', 'Washing machine', ['Load weight', 'Pick water and spin', 'Runs the cycle']],
  ['🚦', 'Traffic signal', ['Timer and road sensors', 'Decide when to switch', 'Lights change']],
]

export default function Types() {
  const [t, setT] = useState('laptop')
  const d = types[t]
  return (
    <>
      <Section id="types" eyebrow="Types of computers" title="Desktop, laptop, mobile" intro="Same IPOS cycle, different size, power and purpose.">
        <Reveal className="types">
          <div className="segmented" role="tablist" aria-label="Computer types">
            {Object.entries(types).map(([k, v]) => (
              <button key={k} type="button" role="tab" aria-selected={t === k} className={t === k ? 'is-on' : ''} onClick={() => setT(k)}>
                {v.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={t} className="types-body" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <p className="lead">{d.blurb}</p>
              <div className="types-grid">
                <div>
                  {d.meters.map(([l, v, x]) => (
                    <Meter key={l} label={l} value={v} text={x} />
                  ))}
                </div>
                <dl className="facts">
                  {d.facts.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
        <Callout>Most people will open your websites on a phone first, so we’ll design mobile-first later in this course.</Callout>
      </Section>

      <Section id="embedded" eyebrow="Hidden computers" title="Embedded systems" intro="A small computer built into another device to do one job well. Each one still runs the IPOS cycle." tone="alt">
        <div className="card-grid four">
          {embedded.map(([icon, name, ipo], i) => (
            <Reveal key={name} className="card embedded" delay={i * 0.08}>
              <span className="card-icon" aria-hidden="true">{icon}</span>
              <h3>{name}</h3>
              <ol className="mini-ipo">
                <li><span>In</span>{ipo[0]}</li>
                <li><span>Process</span>{ipo[1]}</li>
                <li><span>Out</span>{ipo[2]}</li>
              </ol>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
