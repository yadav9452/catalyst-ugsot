import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { Cpu, Motherboard } from '../../../design-system/illustrations'
import { logo, photos } from '../images'

// Fastest and smallest at the top, slowest and biggest at the bottom.
const levels = [
  { name: 'Registers', where: 'Inside the CPU', size: 'A few values', speed: 'Instant', width: 30 },
  { name: 'Cache', where: 'Inside the CPU', size: 'A few MB', speed: 'Extremely fast', width: 48 },
  { name: 'RAM', where: 'On the motherboard', size: '8–32 GB', speed: 'Fast; cleared at power-off', width: 70 },
  { name: 'SSD / HDD', where: 'Storage drive', size: '256 GB – 2 TB', speed: 'Slower; keeps files forever', width: 100 },
]

const ramRom = [
  ['Power off', 'Volatile: data is lost', 'Non-volatile: data stays'],
  ['Can you change it?', 'Yes, written and rewritten all the time', 'Not in normal use, only by firmware updates'],
  ['What it holds', 'Programs and data in use right now', 'The startup program (BIOS/UEFI) that boots the computer'],
]

/* ---------- Opening an app: storage → RAM → CPU ---------- */

const appStages = [
  ['idle', 'VS Code is installed on the SSD. Click “Open VS Code”.'],
  ['load', 'Copying the app from storage into RAM…'],
  ['ram', 'VS Code is now in RAM, where the CPU can reach it quickly.'],
  ['run', 'The CPU runs it straight from RAM. The app is open!'],
]

function OpenApp() {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    if (stage === 0 || stage >= 3) return
    const t = setTimeout(() => setStage((s) => s + 1), 1400)
    return () => clearTimeout(t)
  }, [stage])
  const icon = logo('vscode')
  const where = ['ssd', 'ssd', 'ram', 'cpu'][stage]

  return (
    <div className="openapp">
      <div className="openapp-row">
        {[
          ['ssd', 'Storage (SSD)', <img key="s" src={photos.ssd} alt="" />],
          ['ram', 'RAM', <img key="r" src={photos.ram} alt="" />],
          ['cpu', 'CPU', <Cpu key="c" size={72} />],
        ].map(([id, label, art]) => (
          <div key={id} className={`openapp-box ${where === id ? 'is-on' : ''}`}>
            <span className="openapp-art">{art}</span>
            <strong>{label}</strong>
            <span className="openapp-slot">
              {where === id && (
                <motion.span layoutId="app" className="openapp-app" transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
                  {icon ? <img src={icon} alt="VS Code" /> : 'VS Code'}
                </motion.span>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="openapp-caption" aria-live="polite">
        {appStages[stage][1]}
      </p>
      <div className="openapp-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setStage(1)} disabled={stage > 0 && stage < 3}>
          {stage === 3 ? '↺ Open it again' : '▶ Open VS Code'}
        </button>
      </div>
    </div>
  )
}

export default function Memory() {
  return (
    <>
      <Section
        id="memory"
        eyebrow="Memory & storage"
        title="From registers to SSD: the memory ladder"
        intro="The closer memory is to the CPU, the faster and smaller it is. Inside the CPU: registers and cache. Outside: RAM, ROM and storage."
        steps={4}
      >
        <div className="ladder">
          <div className="ladder-axis" aria-hidden="true" />
          <div className="ladder-levels">
            <p className="ladder-end">↑ Faster and smaller (closest to the CPU)</p>
            {levels.map((l, i) => (
              <Step key={l.name} n={i + 1} className="ladder-level" delay={i * 0.1}>
                <motion.div
                  className="ladder-bar"
                  style={{ width: `${l.width}%` }}
                  initial={{ scaleX: 0.4 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                >
                  <strong>{l.name}</strong>
                  <span>{l.size}</span>
                </motion.div>
                <p>
                  <b>{l.where}</b> · {l.speed}
                </p>
              </Step>
            ))}
            <p className="ladder-end">↓ Slower and bigger (furthest from the CPU)</p>
          </div>
        </div>
        <Callout label="Primary vs secondary">
          <strong>Primary memory</strong> (RAM and ROM) is read directly by the CPU. <strong>Secondary memory</strong> (SSD, HDD) keeps your OS, apps and files
          when the power is off.
        </Callout>
      </Section>

      <Section
        id="ram-rom"
        eyebrow="Primary memory"
        title="RAM vs ROM"
        intro="Both are primary memory on the motherboard, but they do very different jobs."
        tone="alt"
        steps={3}
      >
        <div className="ramrom-head">
          <div>
            <img src={photos.ram} alt="RAM sticks" />
            <strong>RAM</strong>
            <span>Random Access Memory</span>
          </div>
          <div>
            <Motherboard size={96} />
            <strong>ROM</strong>
            <span>Read-Only Memory (a chip on the motherboard)</span>
          </div>
        </div>
        <div className="ramrom-rows">
          {ramRom.map(([q, a, b], i) => (
            <Step key={q} n={i + 1} className="ramrom-row" delay={i * 0.08}>
              <span className="ramrom-q">{q}</span>
              <span className="ramrom-a">{a}</span>
              <span className="ramrom-b">{b}</span>
            </Step>
          ))}
        </div>
      </Section>

      <Section
        id="secondary"
        eyebrow="Secondary memory"
        title="Why apps load into RAM first"
        intro="The CPU doesn’t work on the SSD directly. When you open an app, it’s copied from storage into RAM, then the CPU runs it."
      >
        <Reveal>
          <OpenApp />
        </Reveal>
      </Section>
    </>
  )
}
