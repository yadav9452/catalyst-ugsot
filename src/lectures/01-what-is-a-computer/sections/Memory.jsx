import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Code, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { Cupboard, Desk } from '../../../design-system/illustrations'
import { photos } from '../images'

function PowerCutSimulator() {
  const [text, setText] = useState('My first web page idea: a portfolio with...')
  const [saved, setSaved] = useState([])
  const [power, setPower] = useState(true)
  const [flash, setFlash] = useState(false)

  function save() {
    if (!text.trim()) return
    setSaved((s) => [{ id: Date.now(), name: `notes-${s.length + 1}.txt`, text }, ...s].slice(0, 4))
  }
  function cut() {
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
        <p className="sim-label">RAM · your desk</p>
        <textarea
          aria-label="Text in RAM (unsaved)"
          value={text}
          disabled={!power}
          onChange={(e) => setText(e.target.value)}
          placeholder={power ? 'Type something…' : 'Power is off. RAM is empty.'}
        />
        <div className="sim-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!power}>
            💾 Save (Ctrl / Cmd + S)
          </button>
          {power ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={cut}>
              ⚡ Power cut
            </button>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPower(true)}>
              🔌 Power on
            </button>
          )}
        </div>
      </div>
      <div className="sim-col">
        <p className="sim-label">Storage · your cupboard</p>
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
        {power ? 'Type, save, then cut the power. What survives?' : 'Unsaved text in RAM is gone. Saved files in storage survived.'}
      </p>
    </div>
  )
}

const addCode = [
  '// Input, held in RAM',
  'let a = Number(prompt("First number?"));',
  'let b = Number(prompt("Second number?"));',
  '// Processing',
  'let sum = a + b;',
  '// Output',
  'alert("Sum is " + sum);',
]

function AddNumbers() {
  const [a, setA] = useState(7)
  const [b, setB] = useState(5)
  const [step, setStep] = useState(-1)
  const sum = Number(a) + Number(b)
  const steps = [
    { tag: 'Input', cls: 't-in', text: `You type ${a}, then ${b}`, line: 1 },
    { tag: 'Storage', cls: 't-st', text: 'Both numbers are held in RAM', line: 2 },
    { tag: 'Processing', cls: 't-pr', text: `The CPU adds them: ${a} + ${b}`, line: 4 },
    { tag: 'Storage', cls: 't-st', text: `The result, ${sum}, is stored`, line: 4 },
    { tag: 'Output', cls: 't-out', text: `${sum} appears on the screen`, line: 6 },
  ]

  function run() {
    setStep(-1)
    steps.forEach((_, i) => setTimeout(() => setStep(i), 300 + i * 900))
  }

  return (
    <div className="split">
      <div>
        <div className="add-inputs">
          <label>
            First number
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
          </label>
          <label>
            Second number
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </label>
          <button type="button" className="btn btn-primary" onClick={run}>
            ▶ Run
          </button>
        </div>
        <ol className="flow-steps">
          {steps.map((s, i) => (
            <motion.li key={i} animate={{ opacity: step >= i ? 1 : 0.35, x: step === i ? 8 : 0 }}>
              <span className={`tag ${s.cls}`}>{s.tag}</span>
              <span>{s.text}</span>
            </motion.li>
          ))}
        </ol>
        <AnimatePresence>
          {step === steps.length - 1 && (
            <motion.div className="screen-out" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              Sum is {Number.isFinite(sum) ? sum : '…'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <Code lines={addCode} active={step >= 0 ? steps[step].line : -1} caption="Try it: paste this into the browser Console." />
      </div>
    </div>
  )
}

export default function Memory() {
  return (
    <>
      <Section
        id="storage"
        eyebrow="Step 04 · Storage"
        title="RAM vs storage: desk vs cupboard"
        intro="RAM is short-term memory: fast, but cleared when the power goes off. Storage keeps your files permanently."
        steps={4}
      >
        <div className="analogy">
          <Step n={1} className="analogy-card">
            <div className="analogy-art">
              <img className="analogy-photo" src={photos.ram} alt="RAM sticks" />
              <span aria-hidden="true">=</span>
              <Desk size={110} />
            </div>
            <h3>RAM is your desk</h3>
            <p>What you’re working on right now sits here. Very fast to reach, but cleared every time the power goes off.</p>
          </Step>
          <Step n={2} className="analogy-card">
            <div className="analogy-art">
              <img className="analogy-photo" src={photos.ssd} alt="SSDs: a 2.5-inch SATA drive and two M.2 NVMe drives" />
              <span aria-hidden="true">=</span>
              <Cupboard size={110} />
            </div>
            <h3>Storage is your cupboard</h3>
            <p>Files you’ve saved are kept here: photos, apps, your code. Slower to reach, but nothing is lost when you switch off.</p>
          </Step>
        </div>
        <Step n={3}>
          <h3 className="sub">Try it: the power-cut test</h3>
          <PowerCutSimulator />
        </Step>
        <Callout label="Why it matters" step={4}>
          Unsaved work lives only in RAM, so a power cut loses it. Pressing Ctrl + S (Cmd + S on a Mac) copies it to storage.
        </Callout>
      </Section>

      <Section
        id="walkthrough"
        eyebrow="Putting it together"
        title="Walkthrough: adding two numbers"
        intro="Change the numbers and press Run. Watch each IPOS step light up next to the real JavaScript."
        tone="alt"
      >
        <Reveal>
          <AddNumbers />
        </Reveal>
        <PauseBadge>Pause the video, open the Console and try the code with your own numbers</PauseBadge>
      </Section>
    </>
  )
}
