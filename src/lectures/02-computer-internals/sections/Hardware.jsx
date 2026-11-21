import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'
import { Gear, Instructions, Lightning } from '../../../design-system/illustrations'
import { photos } from '../images'
import { DevicePic } from './devices'

/* ---------- What is hardware? ---------- */

const groups = [
  ['CPU', 'The brain: runs every instruction', photos.cpu],
  ['Memory & storage', 'Holds what’s in use now, keeps files for later', photos.ram],
  ['Input devices', 'Get data in: keyboard, mouse, microphone', photos.keyboard],
  ['Output devices', 'Show results: monitor, speakers, printer', photos.monitor],
]

/* ---------- Inside the CPU ---------- */

const cpuFacts = [
  ['Where it sits', 'In a socket on the motherboard, under a fan that keeps it cool'],
  ['Who makes them', 'Intel and AMD for laptops and PCs, Apple for Macs, Qualcomm and MediaTek for phones'],
  ['Speed', 'Measured in GHz: 3 GHz means about 3 billion steps every second'],
  ['Cores', 'Most CPUs have 4 to 16 cores: small CPUs inside one chip, working side by side'],
]

const roles = [
  [Gear, 'Controls all operations', 'Tells every other part what to do and when'],
  [Instructions, 'Executes instructions', 'Runs them one after another, billions per second'],
  [Lightning, 'Makes decisions', 'Simple choices like “is this number bigger than that one?”'],
]

const parts = {
  cu: {
    name: 'Control Unit (CU)',
    tag: 'The manager',
    points: [
      'Reads each instruction and works out what it means',
      'Tells the ALU and memory what to do, and when',
      'Controls how data moves between CPU, memory and devices',
    ],
  },
  alu: {
    name: 'Arithmetic Logic Unit (ALU)',
    tag: 'The calculator',
    points: [
      'Arithmetic: add, subtract, multiply, divide (5 + 3 = 8)',
      'Logic: comparisons (is 7 > 5? yes)',
      'Every if-statement you write ends up as a comparison here',
    ],
  },
  reg: {
    name: 'Registers & cache',
    tag: 'The scratchpad',
    points: [
      'Tiny, extremely fast memory built into the CPU',
      'Holds the few values the CPU is working on right now',
      'Registers hold a few values; cache is a few megabytes',
    ],
  },
}
const order = ['cu', 'alu', 'reg']

function CpuInside() {
  const [picked, setPicked] = useState('cu')
  // Guided mode: steps 4, 5, 6 open the CU, the ALU, then the registers.
  const { guided, step } = useStep()
  const active = guided && step >= 4 ? order[Math.min(step, 6) - 4] : picked
  const p = parts[active]

  return (
    <div className="cpu-inside">
      <div className="cpu-chip" role="group" aria-label="Parts of the CPU">
        <p className="cpu-label">CPU</p>
        {order.map((k) => (
          <motion.button
            key={k}
            type="button"
            className={`cpu-part cpu-${k} ${active === k ? 'is-on' : ''}`}
            onClick={() => setPicked(k)}
            aria-pressed={active === k}
            whileHover={{ scale: 1.03 }}
            animate={{ scale: active === k ? 1.04 : 1 }}
          >
            <strong>{parts[k].name.split(' (')[0]}</strong>
            <span>{parts[k].tag}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="cpu-detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <p className="cpu-detail-tag">{p.tag}</p>
          <h3>{p.name}</h3>
          <ul>
            {p.points.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- ALU playground ---------- */

const ops = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? 'Can’t divide by 0' : Math.round((a / b) * 100) / 100),
  '>': (a, b) => (a > b ? 'Yes (true)' : 'No (false)'),
  '<': (a, b) => (a < b ? 'Yes (true)' : 'No (false)'),
  '=': (a, b) => (a === b ? 'Yes (true)' : 'No (false)'),
}
const logic = new Set(['>', '<', '='])

function AluPlayground() {
  const [a, setA] = useState(7)
  const [b, setB] = useState(5)
  const [op, setOp] = useState('>')
  const result = ops[op](Number(a), Number(b))
  return (
    <div className="alu">
      <div className="alu-inputs">
        <input type="number" value={a} onChange={(e) => setA(e.target.value)} aria-label="First number" />
        <div className="alu-ops" role="group" aria-label="Operation">
          {Object.keys(ops).map((o) => (
            <button key={o} type="button" aria-pressed={op === o} onClick={() => setOp(o)}>
              {o}
            </button>
          ))}
        </div>
        <input type="number" value={b} onChange={(e) => setB(e.target.value)} aria-label="Second number" />
      </div>
      <div className="alu-machine" aria-hidden="true">
        <span>ALU</span>
      </div>
      <motion.p key={`${a}${op}${b}`} className="alu-result" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} aria-live="polite">
        {logic.has(op) ? `Is ${a} ${op} ${b}? ` : `${a} ${op} ${b} = `}
        <strong>{String(result)}</strong>
      </motion.p>
      <p className="alu-kind">{logic.has(op) ? 'Logic operation: a yes/no comparison' : 'Arithmetic operation: a calculation'}</p>
    </div>
  )
}

export default function Hardware() {
  return (
    <>
      <Section
        id="hardware"
        eyebrow="Part 1 · Hardware"
        title="What is hardware?"
        intro="The physical parts of a computer you can see and touch. They fall into four groups."
        steps={4}
      >
        <div className="card-grid four">
          {groups.map(([t, d, img], i) => (
            <Step key={t} n={i + 1} className="card hw-group" delay={i * 0.08}>
              <span className="hw-group-img">
                <img src={img} alt={t} />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
      </Section>

      <Section
        id="cpu"
        eyebrow="The CPU"
        title="CPU = the brain of the computer"
        intro="CPU stands for Central Processing Unit: the main chip that runs everything."
        tone="alt"
        steps={6}
      >
        <Reveal className="cpu-hero">
          <figure className="cpu-hero-photo">
            <DevicePic id="cpu" alt="Real CPU chips: the shiny metal top and the gold pins or pads underneath" size={200} />
            <figcaption>Real CPU chips, about the size of a matchbox</figcaption>
          </figure>
          <div className="cpu-hero-facts">
            {cpuFacts.map(([t, d]) => (
              <div key={t}>
                <strong>{t}</strong>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="card-grid three">
          {roles.map(([Icon, t, d], i) => (
            <Step key={t} n={i + 1} className="card role-card" delay={i * 0.08}>
              <Icon size={56} />
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <Step n={4}>
          <h3 className="sub">Inside the CPU: three main parts</h3>
          <p className="intro">Click each part to see what it does.</p>
          <CpuInside />
        </Step>
        <Callout label="Remember" step={6}>
          RAM and storage are <strong>not</strong> inside the CPU. They sit outside it on the motherboard; we look at them next.
        </Callout>
      </Section>

      <Section id="alu" eyebrow="Try it" title="Be the ALU" intro="Pick two numbers and an operation. Arithmetic gives a number; logic gives a yes or no.">
        <Reveal>
          <AluPlayground />
        </Reveal>
        <Callout>When an app checks “Is the password correct?” or “Is the balance more than ₹500?”, the ALU is the part that answers yes or no.</Callout>
      </Section>
    </>
  )
}
