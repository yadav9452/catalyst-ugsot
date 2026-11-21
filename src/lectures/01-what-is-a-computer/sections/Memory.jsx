import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { Callout, Illo, PauseBadge, Reveal, Section, Step, useStep } from '../../../design-system'
import { StepContext } from '../../../design-system/guided'
import { Cpu, Keyboard, Monitor, Ram } from '../../../design-system/illustrations'
import { photos } from '../images'

function SaveSimulator() {
  const [text, setText] = useState('My first web page idea: a portfolio with...')
  const [saved, setSaved] = useState([])
  const [power, setPower] = useState(true)
  const [flash, setFlash] = useState(false)

  function save() {
    if (!text.trim()) return
    setSaved((s) => [{ id: Date.now(), name: `notes-${s.length + 1}.txt`, text }, ...s].slice(0, 4))
  }
  function off() {
    setFlash(true)
    setPower(false)
    setText('')
    setTimeout(() => setFlash(false), 500)
  }

  return (
    <div className={`sim ${power ? '' : 'is-off'}`}>
      <AnimatePresence>
        {flash && <motion.div className="sim-flash" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} />}
      </AnimatePresence>
      <div className="sim-col">
        <p className="sim-label">📝 Notes app · typing</p>
        <textarea
          aria-label="Your note (not saved yet)"
          value={text}
          disabled={!power}
          onChange={(e) => setText(e.target.value)}
          placeholder={power ? 'Type something…' : 'The laptop is switched off.'}
        />
        <div className="sim-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!power}>
            💾 Save (Ctrl / Cmd + S)
          </button>
          {power ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={off}>
              ⏻ Switch off
            </button>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPower(true)}>
              🔌 Switch on
            </button>
          )}
        </div>
      </div>
      <div className="sim-col">
        <p className="sim-label">🗄 Storage · saved files</p>
        <ul className="sim-files">
          <AnimatePresence initial={false}>
            {saved.length === 0 && (
              <motion.li key="empty" className="sim-empty" exit={{ opacity: 0 }}>
                Nothing saved yet
              </motion.li>
            )}
            {saved.map((f) => (
              <motion.li key={f.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <strong>📄 {f.name}</strong>
                <span>
                  {f.text.slice(0, 48)}
                  {f.text.length > 48 ? '…' : ''}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <p className="sim-status" aria-live="polite">
        {power
          ? 'Type a note, press Save, then switch the laptop off and on again. What is still there?'
          : 'Saved files are still in storage. Anything you didn’t save is gone, so save often!'}
      </p>
    </div>
  )
}

const stored = [
  ['Camera', 'Photos & videos', 'Every picture in your gallery'],
  ['Phone', 'Apps', 'WhatsApp, Chrome, VS Code…'],
  ['CodeEditor', 'Documents & code', 'Notes, assignments, your projects'],
  ['Headphones', 'Music & chats', 'Downloads and message history'],
]

/* ---------- Walkthrough: watch 7 + 5 travel through the computer ---------- */

// Where each part sits on the stage, in % of its width and height.
const SPOT = { kb: [17, 50], ram: [50, 76], cpu: [50, 24], screen: [83, 50] }
const WIRES = [
  ['kb', 'ram', [2]],
  ['ram', 'cpu', [3, 4]],
  ['ram', 'screen', [5]],
]
// What travels in each step: [label, from, to]
const moves = (a, b, sum) => ({
  2: [
    [a, 'kb', 'ram'],
    [b, 'kb', 'ram'],
  ],
  3: [
    [a, 'ram', 'cpu'],
    [b, 'ram', 'cpu'],
  ],
  4: [[sum, 'cpu', 'ram']],
  5: [[sum, 'ram', 'screen']],
})

function Station({ id, title, art, on, children }) {
  const [x, y] = SPOT[id]
  return (
    <motion.div
      className={`walk-station ${on ? 'is-on' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, x: '-50%', y: '-50%' }}
      animate={{ scale: on ? 1.06 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <span className="walk-art">{art}</span>
      <strong>{title}</strong>
      <div className="walk-body">{children}</div>
    </motion.div>
  )
}

const Val = ({ show, children, delay = 0.75 }) =>
  show ? (
    <motion.b
      key={String(children)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.b>
  ) : (
    <b className="is-empty">–</b>
  )

function AddNumbers() {
  const [a, setA] = useState(7)
  const [b, setB] = useState(5)
  const [local, setLocal] = useState(0)
  const [auto, setAuto] = useState(false)
  const { guided, step: gStep } = useStep()
  const ctx = useContext(StepContext)
  const step = guided ? Math.min(gStep, 5) : local
  const go = (n) => (guided ? ctx.setStep(n) : setLocal(n))
  const sum = Number(a) + Number(b)
  const show = Number.isFinite(sum) ? sum : '?'

  const steps = [
    { tag: 'Input', cls: 't-in', text: `You type ${a}, then ${b} on the keyboard`, on: ['kb'] },
    { tag: 'Storage', cls: 't-st', text: `${a} and ${b} travel to RAM and wait there`, on: ['ram'] },
    { tag: 'Processing', cls: 't-pr', text: `The CPU fetches them from RAM and adds: ${a} + ${b} = ${show}`, on: ['cpu'] },
    { tag: 'Storage', cls: 't-st', text: `The result, ${show}, is stored back in RAM`, on: ['ram'] },
    { tag: 'Output', cls: 't-out', text: `${show} is sent to the screen: “Sum is ${show}”`, on: ['screen'] },
  ]
  const cur = steps[step - 1]
  const on = (id) => !!cur?.on.includes(id)

  // Play all: one step every 1.8 s.
  const playing = auto && step < 5
  const manual = (n) => {
    setAuto(false)
    go(n)
  }
  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => go(step + 1), step === 0 ? 300 : 1800)
    return () => clearTimeout(t)
  }, [playing, step]) // eslint-disable-line react-hooks/exhaustive-deps

  const travelling = moves(a, b, show)[step] ?? []

  return (
    <div className="walk">
      <div className="add-inputs">
        <label>
          First number
          <input
            type="number"
            value={a}
            onChange={(e) => {
              setA(e.target.value)
              manual(0)
            }}
          />
        </label>
        <label>
          Second number
          <input
            type="number"
            value={b}
            onChange={(e) => {
              setB(e.target.value)
              manual(0)
            }}
          />
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            go(0)
            setAuto(true)
          }}
          disabled={playing}
        >
          ▶ Play all
        </button>
      </div>

      <div className="walk-stage" role="img" aria-label={cur ? `Step ${step}: ${cur.tag}. ${cur.text}` : 'Keyboard, RAM, CPU and screen, waiting to start'}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {WIRES.map(([f, t, when]) => (
            <line
              key={f + t}
              x1={SPOT[f][0]}
              y1={SPOT[f][1]}
              x2={SPOT[t][0]}
              y2={SPOT[t][1]}
              className={when.includes(step) ? 'on' : ''}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <Station id="kb" title="Keyboard" art={<Keyboard size={112} />} on={on('kb')}>
          {step >= 1 ? (
            <span className="walk-typed">
              <Val show delay={0.1}>
                {a}
              </Val>
              <Val show delay={0.5}>
                {b}
              </Val>
            </span>
          ) : (
            <span className="walk-hint">waiting…</span>
          )}
        </Station>

        <Station id="cpu" title="CPU" art={<Cpu size={112} />} on={on('cpu')}>
          {step >= 3 ? (
            <span className="walk-calc">
              <Val show>
                {a} + {b}
              </Val>
              <Val show delay={1.1}>
                = {show}
              </Val>
            </span>
          ) : (
            <span className="walk-hint">idle</span>
          )}
          {step === 3 && (
            <motion.span className="walk-gear" aria-hidden="true" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
              ⚙
            </motion.span>
          )}
        </Station>

        <Station id="ram" title="RAM" art={<Ram size={112} />} on={on('ram')}>
          <span className="walk-slots">
            <span>
              <small>a</small>
              <Val show={step >= 2}>{a}</Val>
            </span>
            <span>
              <small>b</small>
              <Val show={step >= 2}>{b}</Val>
            </span>
            <span>
              <small>sum</small>
              <Val show={step >= 4}>{show}</Val>
            </span>
          </span>
        </Station>

        <Station id="screen" title="Screen" art={<Monitor size={112} />} on={on('screen')}>
          {step >= 5 ? <Val show>Sum is {show}</Val> : <span className="walk-hint">blank</span>}
        </Station>

        {travelling.map(([label, f, t], i) => (
          <motion.span
            key={`${step}-${i}`}
            className="walk-packet"
            style={{ x: '-50%', y: '-50%' }}
            initial={{ left: `${SPOT[f][0]}%`, top: `${SPOT[f][1]}%`, opacity: 0, scale: 0.6 }}
            animate={{ left: `${SPOT[t][0]}%`, top: `${SPOT[t][1]}%`, opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1.1, 0.8] }}
            transition={{ duration: 0.9, delay: i * 0.25, ease: 'easeInOut' }}
          >
            {label}
          </motion.span>
        ))}
      </div>

      <div className="walk-controls">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => manual(Math.max(step - 1, 0))} disabled={step === 0 || playing}>
          ◀ Back
        </button>
        <span className="walk-count">Step {step} / 5</span>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => manual(Math.min(step + 1, 5))} disabled={step === 5 || playing}>
          Next ▶
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => manual(0)}>
          ↺ Reset
        </button>
      </div>

      <ol className="flow-steps">
        {steps.map((s, i) => (
          <motion.li key={i} className={step === i + 1 ? 'is-now' : ''} animate={{ opacity: step > i ? 1 : 0.35, x: step === i + 1 ? 8 : 0 }}>
            <button type="button" onClick={() => manual(i + 1)} aria-current={step === i + 1 ? 'step' : undefined}>
              <span className={`tag ${s.cls}`}>
                {i + 1} · {s.tag}
              </span>
              <span>{s.text}</span>
            </button>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

export default function Memory() {
  return (
    <>
      <Section
        id="storage"
        eyebrow="Step 04 · Storage"
        title="Storage: keeping data for later"
        intro="Storage is where a computer keeps data so it can use it again: your photos, apps, documents and code. It stays there even when the computer is switched off."
        steps={4}
      >
        <div className="card-grid four">
          {stored.map(([illo, t, d], i) => (
            <Step key={t} n={1} className="card store-card" delay={i * 0.08}>
              <Illo name={illo} size={96} />
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <Step n={2}>
          <h3 className="sub">Where is it kept?</h3>
          <div className="store-where">
            <div className="store-where-card">
              <img src={photos.ssd} alt="Storage drives: a 2.5-inch SATA SSD and two small M.2 SSDs" />
              <div>
                <h4>On your device</h4>
                <p>A storage drive inside your laptop or phone keeps your files, even with the power off.</p>
              </div>
            </div>
            <div className="store-where-card">
              <span className="store-cloud">
                <Illo name="DataCenter" size={120} />
              </span>
              <div>
                <h4>Online, in the cloud</h4>
                <p>Google Drive, iCloud and OneDrive keep your files on servers, so you can open them from any device.</p>
              </div>
            </div>
          </div>
        </Step>
        <Step n={3}>
          <h3 className="sub">Try it: save, switch off, come back</h3>
          <SaveSimulator />
        </Step>
        <Callout label="Good habit" step={4}>
          Press Ctrl + S (Cmd + S on a Mac) to save your work to storage. In Lecture 2 we open the computer and meet the parts that do this.
        </Callout>
      </Section>

      <Section
        id="walkthrough"
        eyebrow="Putting it together"
        title="Walkthrough: adding two numbers"
        intro="Follow 7 + 5 on its journey through the computer. Use Next to go one step at a time, or Play all. Change the numbers to try your own."
        steps={5}
        tone="alt"
      >
        <Reveal>
          <AddNumbers />
        </Reveal>
        <PauseBadge>Pause the video and try it with your own numbers</PauseBadge>
      </Section>
    </>
  )
}
