import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Code, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { logo } from '../images'

const nots = [
  ['Do NOT think', 'They don’t understand what you meant, only what you wrote.'],
  ['Do NOT guess', 'A missing value stays missing. Nothing is filled in for you.'],
  ['Do NOT fix mistakes', 'A wrong step runs exactly as written, wrong result and all.'],
]

const STEPS = ['Open browser', 'Type URL', 'Press Enter']

/** Put the three steps in order (or leave one out) and run them. */
function StepOrder() {
  const [seq, setSeq] = useState([])
  const [result, setResult] = useState(null)
  const left = STEPS.filter((s) => !seq.includes(s))

  function run() {
    const ok = seq.length === 3 && seq.every((s, i) => s === STEPS[i])
    let why = ''
    if (!ok) {
      const missing = STEPS.filter((s) => !seq.includes(s))
      why = missing.length ? `“${missing[0]}” is missing, so the task fails.` : 'The steps are in the wrong order, so the task fails.'
    }
    setResult({ ok, why })
  }
  function reset() {
    setSeq([])
    setResult(null)
  }
  const chrome = logo('chrome')

  return (
    <div className="order-game">
      <div className="order-cols">
        <div>
          <p className="order-label">Steps (click to add)</p>
          <div className="order-pool">
            {left.map((s) => (
              <motion.button
                layout
                key={s}
                type="button"
                className="order-chip"
                onClick={() => {
                  setSeq((q) => [...q, s])
                  setResult(null)
                }}
              >
                {s}
              </motion.button>
            ))}
            {left.length === 0 && <span className="muted">All steps used</span>}
          </div>
        </div>
        <div>
          <p className="order-label">Your program</p>
          <ol className="order-seq">
            {seq.map((s, i) => (
              <motion.li layout key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <span className="journey-n">{i + 1}</span> {s}
              </motion.li>
            ))}
            {seq.length === 0 && <li className="muted">Empty: add steps on the left</li>}
          </ol>
          <div className="order-btns">
            <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={seq.length === 0}>
              ▶ Run
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
              ↺ Reset
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSeq(['Open browser', 'Press Enter'])
                setResult(null)
              }}
            >
              Try with a step missing
            </button>
          </div>
        </div>
        <div className="mini-browser">
          <div className="mini-bar">
            {chrome && <img src={chrome} alt="" />}
            <span>{result?.ok || seq.includes('Type URL') ? 'catalyst-demo.dev' : ''}</span>
          </div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={String(result.ok)}
                className={`mini-result ${result.ok ? 'ok' : 'fail'}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {result.ok ? (
                  <>
                    <strong>✓ Page loaded</strong>
                    <span>All three steps, in the right order.</span>
                  </>
                ) : (
                  <>
                    <strong>✗ Nothing happens</strong>
                    <span>{result.why}</span>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.p key="wait" className="muted mini-wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Build the steps, then press Run
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/** The same program with and without a value for b. */
function Precise() {
  const [bValue, setB] = useState('7')
  const [ran, setRan] = useState(false)
  const has = bValue !== ''
  const lines = ['let a = 5;', has ? `let b = ${bValue};` : 'let b;', 'console.log(a + b);']
  const out = has ? 5 + Number(bValue) : 'NaN'
  return (
    <div className="precise">
      <div className="precise-controls">
        <span>Value of b:</span>
        {['7', '10', ''].map((v) => (
          <button
            key={v || 'none'}
            type="button"
            aria-pressed={bValue === v}
            onClick={() => {
              setB(v)
              setRan(false)
            }}
          >
            {v === '' ? 'no value' : v}
          </button>
        ))}
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setRan(true)}>
          ▶ Run
        </button>
      </div>
      <Code lines={lines} active={ran ? 2 : -1} />
      <AnimatePresence mode="wait">
        {ran && (
          <motion.div key={String(out)} className={`precise-out ${has ? 'ok' : 'fail'}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <span className="console-prompt">Output ›</span> <strong>{String(out)}</strong>
            <p>
              {has
                ? 'All values given: it works.'
                : 'b has no value, so a + b is NaN (Not a Number). A person would ask what b is. The computer just follows the steps.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Instructions() {
  return (
    <>
      <Section
        id="precise"
        eyebrow="Instructions"
        title="Computers only follow instructions"
        intro="A key idea for programmers: computers do exactly what they are told. Nothing more, nothing less."
        tone="rose"
        steps={3}
      >
        <div className="card-grid three">
          {nots.map(([t, d], i) => (
            <Step key={t} n={i + 1} className="card not-card" delay={i * 0.08}>
              <span className="not-x" aria-hidden="true">
                ✕
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
      </Section>

      <Section
        id="order"
        eyebrow="Try it"
        title="Steps must be complete and in order"
        intro="Opening a website takes three steps. Build the program, then run it. What happens if a step is missing?"
      >
        <Reveal>
          <StepOrder />
        </Reveal>
        <PauseBadge>Pause the video and try a wrong order before you continue</PauseBadge>
      </Section>

      <Section
        id="nan"
        eyebrow="Precise instructions"
        title="One missing value: 12 or NaN?"
        intro="Change the value of b and run the code. This is what a bug looks like."
        tone="alt"
      >
        <Reveal>
          <Precise />
        </Reveal>
        <Callout>Every line of code is an instruction. If a value is missing or a step is out of order, the program fails or gives a wrong result.</Callout>
      </Section>
    </>
  )
}
