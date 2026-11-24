import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section, useStep } from '../../../design-system'

/*
 * "Watch the three parts work together": one instruction, step by step.
 * A red token moves between RAM, the Control Unit, the registers and the ALU
 * (framer-motion layoutId), and the part doing the work lights up.
 * Stage 0 = waiting in RAM; stages 1–6 match the section's guided steps.
 */

const tasks = {
  add: {
    label: 'Add 5 + 3',
    instr: 'ADD 5, 3',
    a: 5,
    b: 3,
    sum: '5 + 3',
    result: '8',
    decode: 'An addition. That’s arithmetic, so the ALU will do it. It needs two numbers: 5 and 3.',
    calc: 'The ALU does the arithmetic: 5 + 3 = 8.',
    end: 'The answer 8 lands in register C. The Control Unit sends it on, to RAM or to the screen, then fetches the next instruction.',
  },
  compare: {
    label: 'Is 7 > 9?',
    instr: 'COMPARE 7 > 9',
    a: 7,
    b: 9,
    sum: '7 > 9 ?',
    result: 'No',
    decode: 'A comparison. That’s logic, so the ALU will do it. It needs two numbers: 7 and 9.',
    calc: 'The ALU compares them: is 7 bigger than 9? No (false).',
    end: '“No” lands in register C. The Control Unit uses it to decide which instruction runs next. That’s exactly how an if-statement in your code works.',
  },
  pin: {
    label: 'Check a PIN',
    instr: 'COMPARE 4821 = 4821',
    a: 4821,
    b: 4821,
    sum: '4821 = 4821 ?',
    result: 'Yes',
    decode: 'A comparison: does the PIN you typed match the saved PIN? Logic, so the ALU will do it.',
    calc: 'The ALU checks whether they are equal: 4821 = 4821? Yes (true).',
    end: '“Yes” lands in register C, so the Control Unit jumps to the “Welcome!” instructions. A wrong PIN would give “No” and the “Try again” instructions instead.',
  },
}

// Where the token sits and which parts glow at each stage.
function stage(t, n) {
  return [
    { at: 'ram', token: t.instr, on: ['ram'], name: 'Waiting', msg: 'The instruction waits in RAM, with the rest of the program. Press Next to start.' },
    { at: 'cu', token: t.instr, on: ['ram', 'cu'], name: 'Fetch', msg: `The Control Unit fetches the next instruction from RAM: ${t.instr}.` },
    { at: 'cu', token: t.instr.split(' ')[0] + ' → ALU', on: ['cu'], name: 'Decode', msg: `The Control Unit decodes it. ${t.decode}` },
    {
      at: 'reg',
      token: `${t.a} , ${t.b}`,
      on: ['cu', 'reg'],
      name: 'Load',
      msg: `The Control Unit puts ${t.a} in register A and ${t.b} in register B: the CPU’s tiny scratchpad, right next to the ALU.`,
    },
    { at: 'alu', token: t.sum, on: ['cu', 'alu', 'reg'], name: 'Signal', msg: 'The Control Unit tells the ALU: “Work on register A and register B.”' },
    { at: 'alu', token: '= ' + t.result, on: ['alu'], name: 'Calculate', msg: t.calc },
    { at: 'regC', token: t.result, on: ['reg', 'cu'], name: 'Store', msg: t.end },
  ][n]
}

const LAST = 6

function Token({ children }) {
  return (
    <motion.span layoutId="l2-token" className="l2-token" transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
      {children}
    </motion.span>
  )
}

function CpuTeam() {
  const { guided, step } = useStep()
  const [key, setKey] = useState('add')
  const [local, setLocal] = useState(0)
  const n = guided ? Math.min(step, LAST) : local
  const t = tasks[key]
  const s = stage(t, n)
  const regs = { A: n >= 3 ? t.a : '', B: n >= 3 ? t.b : '', C: n >= 6 ? t.result : '' }
  const glow = (part) => (s.on.includes(part) ? 'is-on' : '')

  return (
    <div className="l2-team">
      <div className="l2-team-head">
        <p className="l2-team-pick-label">Give the CPU a job:</p>
        <div className="l2-team-pick" role="group" aria-label="Job for the CPU">
          {Object.entries(tasks).map(([k, x]) => (
            <button
              key={k}
              type="button"
              className={key === k ? 'is-on' : ''}
              aria-pressed={key === k}
              onClick={() => {
                setKey(k)
                setLocal(0)
              }}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <div className="l2-team-map">
        <div className={`l2-ram ${glow('ram')}`}>
          <p className="l2-box-title">RAM</p>
          <small>outside the CPU</small>
          <ol className="l2-ram-list" aria-label="Program in RAM">
            <li className="is-now">
              {s.at === 'ram' ? <Token>{s.token}</Token> : <span className="l2-ghost">{t.instr}</span>}
            </li>
            <li>next instruction…</li>
            <li>next instruction…</li>
          </ol>
        </div>

        <div className="l2-cpubox" aria-label="Inside the CPU">
          <p className="l2-cpubox-label">CPU</p>
          <div className={`l2-part l2-cu ${glow('cu')}`}>
            <strong>Control Unit</strong>
            <small>the manager</small>
            <div className="l2-slot">{s.at === 'cu' && <Token>{s.token}</Token>}</div>
          </div>
          <div className={`l2-part l2-alu ${glow('alu')}`}>
            <strong>ALU</strong>
            <small>the calculator</small>
            <div className="l2-slot">{s.at === 'alu' && <Token>{s.token}</Token>}</div>
          </div>
          <div className={`l2-part l2-regs ${glow('reg')}`}>
            <strong>Registers</strong>
            <small>the scratchpad</small>
            <div className="l2-slot">{s.at === 'reg' && <Token>{s.token}</Token>}</div>
            <div className="l2-reg-row">
              {['A', 'B', 'C'].map((r) => (
                <div key={r} className="l2-reg">
                  <span className="l2-reg-name">{r}</span>
                  <span className="l2-reg-val">
                    {r === 'C' && s.at === 'regC' ? (
                      <Token>{s.token}</Token>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        <motion.b key={`${key}-${regs[r]}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                          {regs[r] === '' ? '·' : regs[r]}
                        </motion.b>
                      </AnimatePresence>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="l2-team-foot">
        <ol className="l2-team-steps" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <li key={k} className={k === n ? 'is-now' : k < n ? 'is-done' : ''}>
              {stage(t, k).name}
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.p key={`${key}-${n}`} className="l2-team-msg" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            {n > 0 && <span className="l2-team-n">{n} · {s.name}</span>} {s.msg}
          </motion.p>
        </AnimatePresence>
        {!guided && (
          <div className="l2-team-btns">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLocal(Math.max(0, n - 1))} disabled={n === 0}>
              ← Back
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setLocal(n === LAST ? 0 : n + 1)}>
              {n === LAST ? '↺ Again' : n === 0 ? '▶ Start' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CpuTeamSection() {
  return (
    <Section
      id="cpu-team"
      eyebrow="Try it"
      title="Watch the three parts work together"
      intro="Pick a job for the CPU, then press Next. Follow the red token: the Control Unit manages, the registers hold the numbers, and the ALU does the work."
      tone="red"
      steps={6}
    >
      <Reveal>
        <CpuTeam />
      </Reveal>
    </Section>
  )
}
