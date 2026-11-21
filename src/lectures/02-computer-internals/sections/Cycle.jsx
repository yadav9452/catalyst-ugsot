import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'

const PHASES = ['fetch', 'decode', 'execute', 'store']
const phaseInfo = {
  fetch: ['Fetch', 'The CPU gets the next instruction from memory'],
  decode: ['Decode', 'The Control Unit works out what it means'],
  execute: ['Execute', 'The ALU does the calculation or comparison'],
  store: ['Store', 'The result is saved to a register or memory'],
}

// You type 7 + 5 = on the Calculator app. These are the app's instructions, in plain English.
const program = [
  { code: 'Take the first number: 7', decode: 'Put 7 in box A', execute: 'Nothing to work out: it is just 7', store: { a: 7 } },
  { code: 'Take the second number: 5', decode: 'Put 5 in box B', execute: 'Nothing to work out: it is just 5', store: { b: 5 } },
  { code: 'Add box A and box B', decode: 'Add A and B, put the answer in box C', execute: '7 + 5 = 12', store: { c: 12 } },
  { code: 'Show box C on the screen', decode: 'Send the number in box C to the screen', execute: 'Read box C → 12', store: { out: 12 } },
]
const TOTAL = program.length * PHASES.length

function stateAt(tick) {
  // tick 0 = not started; 1..TOTAL = instruction/phase pairs.
  const regs = {}
  let out = null
  for (let t = 1; t <= tick; t++) {
    const i = Math.floor((t - 1) / 4)
    if (PHASES[(t - 1) % 4] === 'store') {
      const s = program[i].store
      if ('out' in s) out = s.out
      else Object.assign(regs, s)
    }
  }
  if (tick === 0) return { pc: -1, phase: null, regs, out }
  return { pc: Math.floor((tick - 1) / 4), phase: PHASES[(tick - 1) % 4], regs, out }
}

function CpuCycle() {
  const [tick, setTick] = useState(0)
  const [auto, setAuto] = useState(false)
  const s = stateAt(tick)
  const line = s.pc >= 0 ? program[s.pc] : null
  const done = tick >= TOTAL

  const playing = auto && !done

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setTick((x) => x + 1), 1100)
    return () => clearTimeout(t)
  }, [playing, tick])

  return (
    <div className="cycle">
      <div className="cycle-phases" aria-hidden="true">
        {PHASES.map((p, i) => (
          <div key={p} className={`cycle-phase ${s.phase === p ? 'is-on' : ''}`}>
            <span>{i + 1}</span>
            {phaseInfo[p][0]}
          </div>
        ))}
      </div>

      <div className="cycle-board">
        <div className="cycle-ram">
          <p className="cycle-title">Memory: the Calculator app’s instructions</p>
          <ol>
            {program.map((p, i) => (
              <li key={p.code} className={s.pc === i ? 'is-on' : s.pc > i ? 'is-done' : ''}>
                <span className="addr">{i + 1}</span>
                <span className="instr">{p.code}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="cycle-cpu">
          <p className="cycle-title">CPU</p>
          <div className={`cycle-unit ${s.phase === 'fetch' || s.phase === 'decode' ? 'is-on' : ''}`}>
            <strong>Control Unit</strong>
            <AnimatePresence mode="wait">
              <motion.span key={`${tick}-cu`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {s.phase === 'fetch' && <>Fetched: “{line.code}”</>}
                {s.phase === 'decode' && <>Means: {line.decode}</>}
                {(!s.phase || s.phase === 'execute' || s.phase === 'store') && <span className="muted">{line ? `“${line.code}”` : 'Waiting…'}</span>}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className={`cycle-unit ${s.phase === 'execute' ? 'is-on' : ''}`}>
            <strong>ALU</strong>
            <AnimatePresence mode="wait">
              <motion.span key={`${tick}-alu`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                {s.phase === 'execute' ? line.execute : <span className="muted">Idle</span>}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className={`cycle-unit ${s.phase === 'store' ? 'is-on' : ''}`}>
            <strong>Registers (tiny boxes inside the CPU)</strong>
            <span className="regs">
              {['a', 'b', 'c'].map((r) => (
                <motion.span key={r} className="reg" animate={{ backgroundColor: s.phase === 'store' && line?.store[r] !== undefined ? '#E00C16' : '#2a2a2f' }}>
                  {r.toUpperCase()} = {s.regs[r] ?? '–'}
                </motion.span>
              ))}
            </span>
          </div>
        </div>

        <div className="cycle-screen">
          <p className="cycle-title">Screen</p>
          <div className="screen-box" aria-live="polite">
            {s.out !== null ? (
              <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                {s.out}
              </motion.span>
            ) : (
              <span className="muted">Nothing yet</span>
            )}
          </div>
        </div>
      </div>

      <p className="cycle-caption" aria-live="polite">
        {s.phase ? (
          <>
            <strong>{phaseInfo[s.phase][0]}:</strong> {phaseInfo[s.phase][1]}.
          </>
        ) : (
          'You type 7 + 5 = on the Calculator app. Press “Next step” to follow it one step at a time.'
        )}
      </p>

      <div className="cycle-controls">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTick((t) => Math.max(t - 1, 0))} disabled={tick === 0}>
          ← Back
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setTick((t) => Math.min(t + 1, TOTAL))} disabled={done}>
          Next step →
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAuto((a) => !a)} disabled={done}>
          {playing ? '❚❚ Pause' : '▶ Auto-play'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setAuto(false)
            setTick(0)
          }}
        >
          ↺ Reset
        </button>
        <span className="cycle-count">
          Step {tick} / {TOTAL}
        </span>
      </div>
    </div>
  )
}

export default function Cycle() {
  return (
    <Section
      id="cycle"
      eyebrow="How the CPU works"
      title="Fetch → Decode → Execute → Store"
      intro="Every instruction goes through the same four steps, billions of times per second. Let’s follow the Calculator app as it works out 7 + 5."
      steps={4}
    >
      <div className="card-grid four">
        {PHASES.map((p, i) => (
          <Step key={p} n={i + 1} className="card phase-card" delay={i * 0.08}>
            <span className="phase-n">{i + 1}</span>
            <h3>{phaseInfo[p][0]}</h3>
            <p>{phaseInfo[p][1]}</p>
          </Step>
        ))}
      </div>
      <Reveal>
        <CpuCycle />
      </Reveal>
      <Callout label="Think of a cook">
        Read the next step of the recipe (fetch), understand it (decode), do it (execute), put the result aside for the next step (store). The CPU does this
        billions of times every second.
      </Callout>
    </Section>
  )
}
