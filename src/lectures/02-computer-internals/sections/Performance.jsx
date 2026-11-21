import { motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { Cpu } from '../../../design-system/illustrations'
import { logo, photos } from '../images'

const factors = [
  ['CPU: cores and speed', 'More cores and a higher speed (GHz) let the computer do more work at the same time.', 'cpu'],
  ['RAM: size in GB', 'More RAM keeps more apps and browser tabs open without slowing down.', 'ram'],
  ['Storage: SSD vs HDD', 'An SSD opens apps and files several times faster than a hard disk.', 'ssd'],
]

// A typical student setup, in GB of RAM (rough, rounded figures for teaching).
const workload = [
  ['Operating system', 2.5, null],
  ['Chrome, 10 tabs', 2.5, 'chrome'],
  ['Online class (Zoom / Meet)', 1.2, null],
  ['Word + music app', 0.8, null],
]
const NEED = workload.reduce((s, [, gb]) => s + gb, 0)

const options = {
  cores: [2, 4, 8],
  ram: [4, 8, 16],
  disk: ['HDD', 'SSD'],
}

function verdict(cores, ram, disk) {
  const memory = ram >= 16 ? 'good' : ram >= 8 ? 'ok' : 'bad'
  const cpu = cores >= 8 ? 'good' : cores >= 4 ? 'ok' : 'bad'
  const storage = disk === 'SSD' ? 'good' : 'bad'
  const scores = { good: 2, ok: 1, bad: 0 }
  const total = scores[memory] + scores[cpu] + scores[storage]
  const overall = total >= 5 ? 'Smooth and comfortable' : total >= 3 ? 'Usable, but it will feel slow at times' : 'Frustratingly slow'
  return { memory, cpu, storage, overall, total }
}

const memoryText = {
  good: 'Plenty of room: everything stays in RAM.',
  ok: 'Tight: close to full, so it slows down with more tabs.',
  bad: 'Not enough: data keeps moving to slow storage (swapping).',
}
const cpuText = { good: 'Apps open and switch instantly.', ok: 'Fine for everyday work.', bad: 'Slows down when many apps are open.' }
const diskText = { good: 'Opens a big app in about 2 seconds.', bad: 'Opens a big app in about 10 seconds.' }

function Picker({ label, values, value, set, unit = '' }) {
  return (
    <div className="picker">
      <span>{label}</span>
      <div role="group" aria-label={label}>
        {values.map((x) => (
          <button key={x} type="button" aria-pressed={value === x} onClick={() => set(x)}>
            {x}
            {unit}
          </button>
        ))}
      </div>
    </div>
  )
}

function LaptopBuilder() {
  const [cores, setCores] = useState(4)
  const [ram, setRam] = useState(8)
  const [disk, setDisk] = useState('SSD')
  const v = verdict(cores, ram, disk)
  const usedPct = Math.min((NEED / ram) * 100, 100)

  return (
    <div className="builder">
      <div className="builder-controls">
        <h3>Build your student laptop</h3>
        <Picker label="CPU cores" values={options.cores} value={cores} set={setCores} />
        <Picker label="RAM" values={options.ram} value={ram} set={setRam} unit=" GB" />
        <Picker label="Storage" values={options.disk} value={disk} set={setDisk} />
        <div className="workload">
          <p>
            <strong>Your workload</strong> (all open at once)
          </p>
          <ul>
            {workload.map(([name, gb, l]) => (
              <li key={name}>
                {l && logo(l) ? <img src={logo(l)} alt="" /> : <span className="dot" />}
                {name}
                <span>{gb} GB</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="builder-result" aria-live="polite">
        <div className="meter-block">
          <div className="meter-head">
            <span>RAM in use</span>
            <strong>
              {NEED.toFixed(1)} GB of {ram} GB
            </strong>
          </div>
          <div className="meter-track big">
            <motion.div className={`meter-fill ${v.memory}`} animate={{ width: `${usedPct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          </div>
          <p className={`rating ${v.memory}`}>{memoryText[v.memory]}</p>
        </div>
        <div className="rating-row">
          <Cpu size={44} />
          <p className={`rating ${v.cpu}`}>
            <strong>{cores} cores:</strong> {cpuText[v.cpu]}
          </p>
        </div>
        <div className="rating-row">
          <img src={photos.ssd} alt="" />
          <p className={`rating ${v.storage}`}>
            <strong>{disk}:</strong> {diskText[v.storage]}
          </p>
        </div>
        <motion.p key={v.overall} className={`overall t${v.total}`} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          {v.overall}
        </motion.p>
      </div>
    </div>
  )
}

export default function Performance() {
  return (
    <Section
      id="performance"
      eyebrow="Performance"
      title="Why hardware matters for performance"
      intro="Hardware decides how fast things feel. Three parts matter most."
      tone="alt"
      steps={3}
    >
      <div className="card-grid three">
        {factors.map(([t, d, img], i) => (
          <Step key={t} n={i + 1} className="card factor-card" delay={i * 0.08}>
            <span className="factor-img">
              <img src={photos[img]} alt="" />
            </span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Step>
        ))}
      </div>
      <h3 className="sub">Try it: pick the parts, see how it feels</h3>
      <Reveal>
        <LaptopBuilder />
      </Reveal>
      <Callout>You’ll often have a browser, an online class and a document open together. On 8 GB this can feel slow; 16 GB is comfortable.</Callout>
    </Section>
  )
}
