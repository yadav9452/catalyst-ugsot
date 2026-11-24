import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'
import { Gear, Instructions, Lightning } from '../../../design-system/illustrations'
import { photos, pic } from '../images'
import { DevicePic } from './devices'

/* ---------- What is hardware? ---------- */

const groups = [
  ['CPU', 'The brain: runs every instruction', photos.cpu],
  ['Memory & storage', 'Holds what’s in use now, keeps files for later', photos.ram],
  ['Input devices', 'Get data in: keyboard, mouse, microphone', null, [['keyboard', 'Keyboard'], ['mouse', 'Mouse'], ['microphone', 'Microphone']]],
  ['Output devices', 'Show results: monitor, speakers, printer', photos.monitor],
]

/* ---------- Inside the CPU ---------- */

const cpuFacts = [
  ['Where it sits', 'In a socket on the motherboard, under a fan that keeps it cool', 'cpu-socket', 'A motherboard with the CPU hidden under its cooling fan'],
  ['Who makes them', 'Intel and AMD for laptops and PCs, Apple for Macs, Qualcomm and MediaTek for phones', 'cpu-makers', 'Logos of Intel, AMD, Apple, Qualcomm and MediaTek'],
  ['Speed', 'Measured in GHz: 3 GHz means about 3 billion steps every second', 'cpu-speed', 'An Intel Core i7 CPU with its speed, 4.00 GHz, printed on top'],
  ['Cores', 'Most CPUs have 4 to 16 cores: small CPUs inside one chip, working side by side', 'cpu-cores', 'A close-up of the inside of a CPU chip: the repeating blocks are its cores'],
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
    simple: 'It doesn’t do the maths itself. It reads each instruction and tells the other parts what to do.',
    like: ['👨‍🍳', 'Like a head chef reading a recipe: “You chop, you fry, now plate it.”'],
    example: 'You click Play on YouTube. The CU reads the app’s instructions one by one and sends each job to the right part.',
  },
  alu: {
    name: 'Arithmetic Logic Unit (ALU)',
    tag: 'The calculator',
    simple: 'It does all the maths (+ − × ÷) and answers yes/no questions (is 7 bigger than 5?).',
    like: ['🧮', 'Like the calculator on your phone, but billions of times faster.'],
    example: 'Your cart shows ₹499 + ₹299 = ₹798: the ALU added it. “Is the password correct?” Yes or no: the ALU checked it.',
  },
  reg: {
    name: 'Registers & cache',
    tag: 'The scratchpad',
    simple: 'Tiny, super-fast memory inside the CPU. It holds the few numbers the CPU is using right now.',
    like: ['📝', 'Like a small notepad on your desk where you write numbers while doing maths.'],
    example: 'To work out 499 + 299, both numbers sit in registers, and the answer 798 lands in a register too.',
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
          <p className="cpu-simple">{p.simple}</p>
          <p className="cpu-like">
            <span aria-hidden="true">{p.like[0]}</span> {p.like[1]}
          </p>
          <p className="cpu-example">
            <strong>Example</strong> {p.example}
          </p>
        </motion.div>
      </AnimatePresence>
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
          {groups.map(([t, d, img, devs], i) => (
            <Step key={t} n={i + 1} className="card hw-group" delay={i * 0.08}>
              {devs ? (
                <span className="hw-group-img hw-group-trio">
                  {devs.map(([id, name]) => (
                    <span key={id} className="hw-trio-item">
                      <DevicePic id={id} alt={name} size={56} />
                      <small>{name}</small>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="hw-group-img">
                  <img src={img} alt={t} />
                </span>
              )}
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
            {cpuFacts.map(([t, d, id, alt]) => (
              <div key={t} className="cpu-fact">
                <img className="cpu-fact-pic" src={pic(id)} alt={alt} loading="lazy" />
                <span className="cpu-fact-text">
                  <strong>{t}</strong>
                  <span>{d}</span>
                </span>
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

    </>
  )
}
