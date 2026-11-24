import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'
import { StepContext } from '../../../design-system/guided'
import { DevicePic } from './devices'

/* ================= Primary memory ================= */

const primary = [
  {
    id: 'registers',
    name: 'Registers',
    where: 'Inside the CPU',
    what: 'A handful of tiny boxes holding the exact numbers the CPU is working on this moment.',
    tag: 'Volatile',
  },
  {
    id: 'cache',
    name: 'Cache',
    where: 'Inside the CPU',
    what: 'Keeps copies of data the CPU used a moment ago, so it doesn’t have to go out to RAM again.',
    tag: 'Volatile',
  },
  {
    id: 'ram',
    name: 'RAM',
    where: 'Sticks on the motherboard',
    what: 'Random Access Memory: holds the apps and files you have open right now. Laptops usually have 8–16 GB.',
    tag: 'Volatile',
  },
  {
    id: 'rom',
    name: 'ROM',
    where: 'A small chip on the motherboard',
    what: 'Read-Only Memory: holds the start-up program (BIOS/UEFI) that wakes the computer when you press the power button.',
    tag: 'Non-volatile',
  },
]

const ramRom = [
  ['Power off', 'Volatile: everything in it is lost', 'Non-volatile: its contents stay'],
  ['Can you change it?', 'Yes, it is written and rewritten all the time', 'Not in normal use, only by special firmware updates'],
  ['What it holds', 'The apps and files you are using right now', 'The start-up program that boots the computer'],
  ['Size', 'Big: 8 – 32 GB', 'Tiny: a few MB'],
  ['Example', 'Opening Chrome loads it into RAM', 'The logo you see when a PC starts comes from ROM'],
]

/* ================= Secondary memory ================= */

const secondary = [
  ['ssd', 'SSD (solid-state drive)', 'Inside most new laptops. No moving parts, very fast.', '256 GB – 2 TB', 'Fast'],
  ['hdd', 'HDD (hard disk drive)', 'A spinning metal disk read by a tiny arm. Cheap and large, but slower.', '500 GB – 4 TB', 'Slower'],
  ['pendrive', 'Pen drive (USB flash drive)', 'Plugs into a USB port. Carry files from one computer to another.', '16 – 256 GB', 'Medium'],
  ['memory-card', 'Memory card (SD / microSD)', 'Inside cameras, phones and drones.', '32 – 512 GB', 'Medium'],
  ['external-hdd', 'External hard disk', 'A drive in a box with a cable, for backups.', '1 – 5 TB', 'Medium'],
  ['cd-dvd', 'CD / DVD', 'Discs read by a laser. Mostly used for old software, films and music.', '700 MB – 4.7 GB', 'Slow'],
  [
    'cloud',
    'Cloud storage',
    'Google Drive, iCloud, OneDrive: storage on someone else’s servers, reached over the internet.',
    '15 GB free and more',
    'Depends on internet',
  ],
]

const hddSsd = [
  ['How it works', 'Spinning disk + moving arm', 'Memory chips, no moving parts'],
  ['Speed', 'Slower: apps take longer to open', 'Much faster: boots in seconds'],
  ['Cost for the same size', 'Cheaper', 'More expensive'],
  ['If you drop it', 'Can break (moving parts)', 'Tougher'],
]

/* ================= Why apps load into RAM first ================= */

const loadSteps = [
  { at: 'ssd', app: 'ssd', text: 'Notepad is installed on the SSD (on a Mac, TextEdit). It just sits there, safely stored. You double-click its icon.' },
  { at: 'ssd', app: 'move', text: 'The operating system finds Notepad on the SSD and starts copying its instructions…' },
  { at: 'ram', app: 'ram', text: '…into RAM. It is a copy: the original stays on the SSD. Now the app is close to the CPU.' },
  { at: 'cpu', app: 'ram', text: 'The CPU fetches Notepad’s instructions from RAM (through its cache) and runs them, millions per second.' },
  { at: 'screen', app: 'ram', text: 'Notepad appears on the screen. Everything you type also lives in RAM while you work.' },
  { at: 'ssd', app: 'ram', save: true, text: 'You press Ctrl + S (Cmd + S on a Mac): your file is copied back from RAM to the SSD so it is kept.' },
  { at: 'ram', app: 'gone', save: true, text: 'You close Notepad: its space in RAM is freed for other apps. The app and your file are still safe on the SSD.' },
]

function LoadApp() {
  return (
    <motion.span layout className="ld-app" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <span aria-hidden="true">📝</span>
    </motion.span>
  )
}

function LoadFile() {
  return (
    <motion.span className="ld-file" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      📄 notes.txt
    </motion.span>
  )
}

function LoadDiagram() {
  const [local, setLocal] = useState(0)
  const { guided, step: gStep } = useStep()
  const ctx = useContext(StepContext)
  const step = guided ? Math.min(Math.max(gStep - 4, 0), loadSteps.length - 1) : local
  const go = (n) => (guided ? ctx.setStep(n + 4) : setLocal(n))
  const s = loadSteps[step]
  return (
    <div className="lr">
      <div className="lr-stage">
        <div className={`lr-box ${s.at === 'ssd' ? 'is-on' : ''}`}>
          <span className="lr-pic">
            <DevicePic id="ssd" alt="SSD" size={80} />
          </span>
          <strong>SSD (storage)</strong>
          <small>keeps everything · slow for the CPU</small>
          <div className="lr-slot">
            <LoadApp />
            {s.save && <LoadFile />}
          </div>
        </div>
        <Arrow on={s.app === 'move' || (s.save && s.at === 'ssd')} back={s.save && s.at === 'ssd'} label={s.save && s.at === 'ssd' ? 'save' : 'copy'} />
        <div className={`lr-box ${s.at === 'ram' ? 'is-on' : ''}`}>
          <span className="lr-pic">
            <DevicePic id="ram" alt="RAM" size={80} />
          </span>
          <strong>RAM (memory)</strong>
          <small>what’s open now · fast</small>
          <div className="lr-slot">
            {s.app === 'ram' && <LoadApp />}
            {step >= 4 && s.app !== 'gone' && <LoadFile />}
            {s.app === 'gone' && <span className="lr-free">free space</span>}
          </div>
        </div>
        <Arrow on={s.at === 'cpu'} label="fetch" />
        <div className={`lr-box ${s.at === 'cpu' ? 'is-on' : ''}`}>
          <span className="lr-pic">
            <DevicePic id="cpu" alt="CPU" size={80} />
          </span>
          <strong>CPU + cache</strong>
          <small>runs the instructions</small>
          <div className="lr-slot">{s.at === 'cpu' && <span className="lr-run">⚙ running…</span>}</div>
        </div>
        <Arrow on={s.at === 'screen'} label="show" />
        <div className={`lr-box ${s.at === 'screen' ? 'is-on' : ''}`}>
          <span className="lr-pic">
            <DevicePic id="monitor" alt="Screen" size={80} />
          </span>
          <strong>Screen</strong>
          <small>what you see</small>
          <div className="lr-slot">{step >= 4 && s.app !== 'gone' && <span className="lr-run">Notepad is open</span>}</div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={step} className="lr-caption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
          <b>Step {step + 1}.</b> {s.text}
        </motion.p>
      </AnimatePresence>
      <div className="lr-controls">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(Math.max(step - 1, 0))} disabled={step === 0}>
          ◀ Back
        </button>
        <span className="lr-dots" aria-hidden="true">
          {loadSteps.map((_, i) => (
            <i key={i} className={i === step ? 'on' : i < step ? 'done' : ''} />
          ))}
        </span>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => go(Math.min(step + 1, loadSteps.length - 1))}
          disabled={step === loadSteps.length - 1}
        >
          Next ▶
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(0)}>
          ↺ Start again
        </button>
      </div>
    </div>
  )
}

function Arrow({ on, back = false, label }) {
  return (
    <div className={`lr-arrow ${on ? 'is-on' : ''} ${back ? 'is-back' : ''}`} aria-hidden="true">
      <span className="lr-arrow-line" />
      <span className="lr-arrow-label">{label}</span>
      {on && (
        <motion.span
          className="lr-packet"
          initial={{ left: back ? '100%' : '0%' }}
          animate={{ left: back ? '0%' : '100%' }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

/* ================= Sections ================= */

export default function Memory() {
  return (
    <>

      <Section
        id="ram-rom"
        eyebrow="Primary memory"
        title="Primary memory: what the CPU uses directly"
        intro="Primary memory is memory the CPU can read straight away. There are four kinds."
        tone="alt"
        steps={2}
      >
        <div className="mem-cards four">
          {primary.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08} className="mem-card">
              <span className="mem-pic">
                <DevicePic id={m.id} alt={m.name} size={110} />
              </span>
              <span className={`mem-tag ${m.tag === 'Volatile' ? 'is-vol' : 'is-keep'}`}>{m.tag}</span>
              <h3>{m.name}</h3>
              <p className="mem-where">📍 {m.where}</p>
              <p>{m.what}</p>
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <p className="mem-note">
            <b>Volatile</b> means it forgets everything when the power goes off. <b>Non-volatile</b> means it keeps its contents.
          </p>
        </Step>
        <Step n={2}>
          <h3 className="sub">RAM vs ROM: the difference</h3>
          <div className="ramrom-head">
            <div>
              <DevicePic id="ram" alt="RAM sticks" size={90} />
              <strong>RAM</strong>
              <span>Random Access Memory</span>
            </div>
            <div>
              <DevicePic id="rom" alt="A ROM chip" size={90} />
              <strong>ROM</strong>
              <span>Read-Only Memory</span>
            </div>
          </div>
          <div className="ramrom-rows">
            {ramRom.map(([q, a, b]) => (
              <div key={q} className="ramrom-row">
                <span className="ramrom-q">{q}</span>
                <span className="ramrom-a" data-k="RAM">
                  {a}
                </span>
                <span className="ramrom-b" data-k="ROM">
                  {b}
                </span>
              </div>
            ))}
          </div>
        </Step>
      </Section>

      <Section
        id="secondary"
        eyebrow="Secondary memory"
        title="Secondary memory: keeping everything for later"
        intro="Secondary memory (storage) keeps your operating system, apps, photos and files, even when the power is off. Here are the devices you’ll meet."
        steps={2}
      >
        <div className="mem-cards">
          {secondary.map(([id, name, what, size, speed], i) => (
            <Reveal key={id} delay={(i % 4) * 0.06} className="mem-card">
              <span className="mem-pic">
                <DevicePic id={id} alt={name} size={110} />
              </span>
              <h3>{name}</h3>
              <p>{what}</p>
              <p className="mem-meta">
                <span>💾 {size}</span>
                <span>⚡ {speed}</span>
              </p>
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <h3 className="sub">The two you’ll hear about most: HDD vs SSD</h3>
          <div className="ramrom-head">
            <div>
              <DevicePic id="hdd" alt="A hard disk drive" size={90} />
              <strong>HDD</strong>
              <span>Hard disk drive</span>
            </div>
            <div>
              <DevicePic id="ssd" alt="Solid-state drives" size={90} />
              <strong>SSD</strong>
              <span>Solid-state drive</span>
            </div>
          </div>
          <div className="ramrom-rows">
            {hddSsd.map(([q, a, b]) => (
              <div key={q} className="ramrom-row">
                <span className="ramrom-q">{q}</span>
                <span className="ramrom-a" data-k="HDD">
                  {a}
                </span>
                <span className="ramrom-b" data-k="SSD">
                  {b}
                </span>
              </div>
            ))}
          </div>
        </Step>
        <Step n={2}>
          <Callout label="Primary vs secondary">
            Primary memory is fast and close to the CPU, but small (and RAM forgets at power-off). Secondary memory is big and keeps everything, but it is too
            slow for the CPU to work from directly. That’s why apps are loaded into RAM first.
          </Callout>
        </Step>
      </Section>

      <Section
        id="load-ram"
        eyebrow="Putting memory together"
        title="Why apps load into RAM first"
        intro="Apps are stored on the SSD, but the CPU only runs them from RAM. So opening an app means copying it into RAM first. Three reasons why:"
        tone="alt"
        steps={3 + loadSteps.length}
      >
        <div className="card-grid three">
          {[
            ['🐢', 'The SSD is too slow', 'RAM is about 1,000× faster. Running apps from the SSD, the CPU would mostly sit waiting.'],
            ['🔌', 'The CPU talks to RAM directly', 'It can grab any single byte from RAM at once. The SSD only hands over big blocks.'],
            ['📚', 'Shelf vs desk', 'The SSD is a shelf that keeps every book. RAM is your desk: only what you’re using right now.'],
          ].map(([e, t, d], i) => (
            <Step key={t} n={i + 1} className="card lr-reason" delay={i * 0.08}>
              <span className="lr-emoji" aria-hidden="true">
                {e}
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <Step n={4}>
          <h3 className="sub">Opening Notepad, step by step</h3>
          <LoadDiagram />
        </Step>
        <Callout label="When RAM is full">
          If you open more apps than RAM can hold, the computer moves some of them back to the SSD and fetches them again later. That shuffling is why a laptop
          with too little RAM feels slow.
        </Callout>
      </Section>
    </>
  )
}
