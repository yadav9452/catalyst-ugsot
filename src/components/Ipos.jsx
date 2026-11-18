import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Reveal, Section } from './ui'

const STEPS = ['input', 'processing', 'storage', 'output']
const NODE = {
  input: { n: '01', t: 'Input', d: 'Data goes in' },
  processing: { n: '02', t: 'Processing', d: 'The CPU works on it' },
  output: { n: '03', t: 'Output', d: 'Results come out' },
  storage: { n: '04', t: 'Storage', d: 'Kept for later use' },
}

const scenarios = {
  chat: {
    label: '💬 Send a chat message',
    input: 'You type “See you at 5!” on the keyboard.',
    processing: 'The CPU turns each key press into letters and prepares the message.',
    storage: 'The message is held in RAM and saved in your chat history.',
    output: 'The message appears on your screen, and on your friend’s phone.',
  },
  photo: {
    label: '📷 Take a photo',
    input: 'The camera sensor captures the light in front of it.',
    processing: 'The processor turns that light into an image and sharpens it.',
    storage: 'The photo is saved to storage so it’s there tomorrow.',
    output: 'The photo shows up in your gallery.',
  },
  add: {
    label: '➕ Add two numbers',
    input: 'You type 7, then 5.',
    processing: 'The CPU adds them: 7 + 5.',
    storage: 'Both numbers and the result, 12, are held in RAM.',
    output: '12 appears on the screen.',
  },
}

function Node({ id, active, onClick }) {
  const n = NODE[id]
  const on = active === id
  return (
    <motion.button
      type="button"
      className={`ipos-node ipos-${id} ${on ? 'is-active' : ''}`}
      onClick={onClick}
      animate={{ scale: on ? 1.05 : 1 }}
      aria-pressed={on}
    >
      <span className="ipos-num">{n.n}</span>
      <strong>{n.t}</strong>
      <span className="ipos-desc">{n.d}</span>
      {on && <motion.span layoutId="packet" className="packet" transition={{ type: 'spring', stiffness: 220, damping: 24 }} />}
    </motion.button>
  )
}

function IposCycle() {
  const [scenario, setScenario] = useState('chat')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2200)
    return () => clearInterval(t)
  }, [playing])

  const active = STEPS[step]
  const s = scenarios[scenario]

  return (
    <div className="ipos">
      <div className="segmented" role="tablist" aria-label="Choose an example">
        {Object.entries(scenarios).map(([k, v]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={scenario === k}
            className={scenario === k ? 'is-on' : ''}
            onClick={() => {
              setScenario(k)
              setStep(0)
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="ipos-diagram">
        <Node id="input" active={active} onClick={() => setStep(0)} />
        <span className="ipos-arrow" aria-hidden="true">→</span>
        <Node id="processing" active={active} onClick={() => setStep(1)} />
        <span className="ipos-arrow" aria-hidden="true">→</span>
        <Node id="output" active={active} onClick={() => setStep(3)} />
        <span className="ipos-arrow-v" aria-hidden="true">⇅</span>
        <Node id="storage" active={active} onClick={() => setStep(2)} />
      </div>

      <div className="ipos-caption" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p key={scenario + active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <strong>{NODE[active].t}:</strong> {s[active]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="ipos-controls">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep((x) => (x + STEPS.length - 1) % STEPS.length)}>
          ← Back
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setPlaying((p) => !p)}>
          {playing ? '❚❚ Pause' : '▶ Play the cycle'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep((x) => (x + 1) % STEPS.length)}>
          Next →
        </button>
      </div>
    </div>
  )
}

const details = {
  input: {
    title: 'Input: getting data in',
    lead: 'Any data or instruction you give to the computer.',
    items: [
      ['Keyboard', 'Typing text and shortcuts'],
      ['Mouse / trackpad', 'Clicking, dragging, scrolling'],
      ['Touchscreen', 'Taps, swipes and pinches'],
      ['Microphone', 'Voice commands to an assistant'],
      ['Camera', 'Photos, video calls, QR codes'],
      ['Sensors', 'GPS location, fingerprint, motion'],
    ],
    dev: 'On a website, input is a form field, a button click or a search box.',
  },
  processing: {
    title: 'Processing: working on the data',
    lead: 'Done mainly by the CPU, the brain of the computer. We open it up in Lecture 2.',
    items: [
      ['Calculate', 'total = price * qty'],
      ['Decide', 'if the password is right → log in'],
      ['Execute', 'step 1 → step 2 → step 3, in order'],
    ],
    dev: 'Every calculation, if/else and loop you write is processing.',
  },
  output: {
    title: 'Output: getting results out',
    lead: 'The result the computer gives back after processing.',
    items: [
      ['Screen', 'Text, images and video'],
      ['Speakers', 'Music, alerts and voices'],
      ['Printer', 'Paper copies of documents'],
      ['Vibration', 'Phone notifications you can feel'],
    ],
    dev: 'The web page your code builds is output, displayed by the browser.',
  },
  storage: {
    title: 'Storage: keeping data for later',
    lead: 'Two kinds: short-term RAM and long-term storage. Try the simulator below.',
    items: [
      ['RAM (memory)', 'Your desk: fast, holds what you’re using now, cleared at power-off'],
      ['Storage (SSD / HDD)', 'Your cupboard: slower, keeps files even when switched off'],
    ],
    dev: 'Your code and project files live in storage; the program you’re running lives in RAM.',
  },
}

function StepDetails() {
  const [tab, setTab] = useState('input')
  const d = details[tab]
  return (
    <div className="details">
      <div className="tabs" role="tablist" aria-label="IPOS steps">
        {['input', 'processing', 'output', 'storage'].map((k, i) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>
            <span>0{i + 1}</span> {NODE[k].t}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="details-body" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <h3>{d.title}</h3>
          <p className="intro">{d.lead}</p>
          <div className={`card-grid ${d.items.length > 4 ? 'three' : d.items.length === 4 ? 'four' : d.items.length === 3 ? 'three' : 'two'}`}>
            {d.items.map(([t, x], i) => (
              <motion.div key={t} className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <h4>{t}</h4>
                <p className={tab === 'processing' ? 'mono' : ''}>{x}</p>
              </motion.div>
            ))}
          </div>
          <div className="callout callout-static">
            <span className="callout-label">As a developer</span>
            <p>{d.dev}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Ipos() {
  return (
    <>
      <Section
        id="ipos"
        eyebrow="How it works"
        title="The IPOS cycle"
        intro="Every computer, from a smartwatch to a server, follows the same four steps. Pick an example and press play."
      >
        <Reveal>
          <IposCycle />
        </Reveal>
      </Section>
      <Section id="ipos-steps" eyebrow="Step by step" title="A closer look at each step" tone="alt">
        <Reveal>
          <StepDetails />
        </Reveal>
        <Callout label="Remember">Input → Processing → Output, with Storage keeping things for later. Every program you write follows this.</Callout>
      </Section>
    </>
  )
}
