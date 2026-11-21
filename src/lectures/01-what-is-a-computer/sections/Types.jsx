import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Illo, Reveal, Section, Step, useStep } from '../../../design-system'
import { photos } from '../images'

const types = {
  desktop: {
    label: 'Desktop',
    illo: 'Desktop',
    photo: photos.towerPc2,
    blurb: 'Stays on a desk, with a separate monitor, keyboard and system unit.',
    meters: [
      ['Portability', 1, 'Stays on a desk'],
      ['Performance', 5, 'Highest'],
    ],
    facts: [
      ['Power', 'Wall socket'],
      ['Main input', 'Keyboard + mouse'],
      ['Best for', 'Gaming and design'],
    ],
  },
  laptop: {
    label: 'Laptop',
    illo: 'Laptop',
    photo: photos.laptop,
    blurb: 'Screen, keyboard and processor in one portable device with a battery.',
    meters: [
      ['Portability', 3, 'Fits in a bag'],
      ['Performance', 4, 'High'],
    ],
    facts: [
      ['Power', 'Battery or charger'],
      ['Main input', 'Keyboard + trackpad'],
      ['Best for', 'Coding, study, work'],
    ],
  },
  mobile: {
    label: 'Mobile',
    illo: 'Phone',
    photo: photos.mobile,
    blurb: 'Phones and tablets: tiny, touch-first, packed with sensors.',
    meters: [
      ['Portability', 5, 'Fits in a pocket'],
      ['Performance', 3, 'Good'],
    ],
    facts: [
      ['Power', 'Battery'],
      ['Main input', 'Touch, voice, camera'],
      ['Best for', 'Calls, apps, browsing'],
    ],
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
  ['Smartwatch', 'Smartwatch', ['Wrist motion', 'Count steps', 'Step count on screen']],
  ['Car', 'Car', ['Wheel sensors', 'Detect skidding', 'ABS pumps the brakes']],
  ['WashingMachine', 'Washing machine', ['Load weight', 'Pick water and spin', 'Runs the cycle']],
  ['TrafficLight', 'Traffic signal', ['Timer and road sensors', 'Decide when to switch', 'Lights change']],
]

const order = ['desktop', 'laptop', 'mobile']

function TypesTabs() {
  const [picked, setPicked] = useState('laptop')
  // Guided mode: steps 1–3 walk through desktop, laptop, mobile.
  const { guided, step } = useStep()
  const t = guided && step >= 1 ? order[Math.min(step, 3) - 1] : picked
  const setT = setPicked
  const d = types[t]
  return (
    <div className="types">
      <div className="segmented" role="tablist" aria-label="Computer types">
        {Object.entries(types).map(([k, v]) => (
          <button key={k} type="button" role="tab" aria-selected={t === k} className={t === k ? 'is-on' : ''} onClick={() => setT(k)}>
            <Illo name={v.illo} size={46} />
            {v.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={t}
          className="types-body"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="types-hero">
            <motion.div
              className="types-photo"
              key={d.illo}
              initial={{ scale: 0.8, rotate: -4, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            >
              {d.photo ? <img src={d.photo} alt={`A ${d.label.toLowerCase()} computer`} /> : <Illo name={d.illo} size={250} title={d.label} />}
            </motion.div>
            <p className="lead">{d.blurb}</p>
          </div>
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
    </div>
  )
}

export default function Types() {
  return (
    <>
      <Section
        id="types"
        eyebrow="Types of computers"
        title="Desktop, laptop, mobile"
        intro="Same IPOS cycle, different size, power and purpose."
        steps={4}
      >
        <Reveal>
          <TypesTabs />
        </Reveal>
        <Callout step={4}>Most people will open your websites on a phone first, so we’ll design mobile-first later in this course.</Callout>
      </Section>

      <Section
        id="embedded"
        eyebrow="Hidden computers"
        title="Embedded systems"
        intro="A small computer built into another device to do one job well. Each one still runs the IPOS cycle."
        tone="alt"
        steps={4}
      >
        <div className="card-grid four">
          {embedded.map(([illo, name, ipo], i) => (
            <Step key={name} n={i + 1} className="card embedded" delay={i * 0.08}>
              <span className="embedded-art">
                <Illo name={illo} size={150} />
              </span>
              <h3>{name}</h3>
              <ol className="mini-ipo">
                <li>
                  <span>In</span>
                  {ipo[0]}
                </li>
                <li>
                  <span>Process</span>
                  {ipo[1]}
                </li>
                <li>
                  <span>Out</span>
                  {ipo[2]}
                </li>
              </ol>
            </Step>
          ))}
        </div>
      </Section>
    </>
  )
}
