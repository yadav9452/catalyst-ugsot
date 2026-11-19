import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Section, Step, useStep } from '../../../design-system'
import { img, photos } from '../images'

/* ---------- The rings ---------- */

const rings = [
  { k: 'hw', t: 'Hardware', d: 'CPU, memory, disk and devices: the physical parts.' },
  { k: 'kernel', t: 'Kernel', d: 'The core of the OS. It talks directly to the hardware and manages the CPU, memory and devices.' },
  { k: 'shell', t: 'Shell', d: 'The bridge between you and the kernel. It reads your commands and passes them on.' },
  { k: 'apps', t: 'Applications', d: 'Chrome, VS Code, your own programs. They ask the kernel for what they need.' },
]

function Rings() {
  const { shown } = useStep()
  const [pick, setPick] = useState('kernel')
  const info = rings.find((r) => r.k === pick)
  // Nest the rings from the outside in: apps > shell > kernel > hardware.
  const nest = (i) => {
    const r = rings[i]
    const on = shown(i + 1)
    return (
      <motion.div
        className={`kring kring-${r.k} ${pick === r.k ? 'is-picked' : ''}`}
        initial={false}
        animate={{ opacity: on ? 1 : 0.08, scale: on ? 1 : 0.94 }}
      >
        <button type="button" className="kring-label" onClick={() => setPick(r.k)} aria-pressed={pick === r.k}>
          {r.t}
        </button>
        {i === 0 ? <img src={photos.cpu} alt="" className="kring-cpu" /> : nest(i - 1)}
      </motion.div>
    )
  }
  return (
    <div className="kernel-wrap">
      <div className="kring-stage">
        <span className="kring-user">
          <img src={img.user} alt="" />
          You
        </span>
        {nest(rings.length - 1)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={info.k}
          className={`kinfo kinfo-${info.k}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          aria-live="polite"
        >
          <p className="eyebrow">Click a ring</p>
          <h3>{info.t}</h3>
          <p>{info.d}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- A command's journey ---------- */

const stations = [
  ['You', '🧑‍💻'],
  ['Shell', '>_'],
  ['Kernel', '⚙'],
  ['Disk', '💽'],
]
// [station index, caption]
const journey = [
  [0, 'You type ls and press Enter.'],
  [1, 'The shell reads “ls” and asks the kernel: list the files in this folder.'],
  [2, 'The kernel asks the disk for the folder’s contents.'],
  [3, 'The disk sends the list back.'],
  [2, 'The kernel hands the list to the shell.'],
  [1, 'The shell prints it on your screen.'],
  [0, 'You see: projects   notes.txt'],
]

function Journey() {
  const [i, setI] = useState(-1)
  useEffect(() => {
    if (i < 0 || i >= journey.length - 1) return
    const id = setTimeout(() => setI(i + 1), 1500)
    return () => clearTimeout(id)
  }, [i])
  const at = i < 0 ? 0 : journey[i][0]
  const back = i >= 4
  return (
    <div className="journey">
      <div className="journey-track">
        {stations.map(([t, ico], s) => (
          <div key={t} className={`journey-st ${i >= 0 && at === s ? 'is-on' : ''}`}>
            <span className="journey-ico" aria-hidden="true">
              {ico}
            </span>
            <strong>{t}</strong>
          </div>
        ))}
        <motion.span
          className={`journey-token ${back ? 'is-back' : ''}`}
          animate={{ left: `${12.5 + at * 25}%`, opacity: i < 0 ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          aria-hidden="true"
        >
          {back ? '📄 list' : '$ ls'}
        </motion.span>
      </div>
      <p className="journey-caption" aria-live="polite">
        {i < 0 ? 'Press the button to send the command ls (list files) through the OS.' : journey[i][1]}
      </p>
      <div className="journey-term">
        <span className="term-prompt">$</span> ls
        {i === journey.length - 1 && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="term-out">
            {'\n'}projects notes.txt
          </motion.span>
        )}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => setI(0)} disabled={i >= 0 && i < journey.length - 1}>
        {i === journey.length - 1 ? '↺ Send it again' : '▶ Send “ls”'}
      </button>
    </div>
  )
}

export default function KernelShell() {
  return (
    <Section
      id="kernel-shell"
      eyebrow="Inside the OS"
      title="Two parts that matter: the kernel and the shell"
      intro="Every OS has a core that works with the hardware, and a way for you to give it commands."
      steps={6}
    >
      <Rings />
      <div className="card-grid three analogy">
        <Step n={5} className="card">
          <span className="card-icon">🧑‍🍳</span>
          <h3>Kernel = the kitchen</h3>
          <p>Does the real work with the stoves and ingredients (the hardware). You never walk in.</p>
        </Step>
        <Step n={5} className="card" delay={0.08}>
          <span className="card-icon">🧾</span>
          <h3>Shell = the waiter</h3>
          <p>Takes your order (command), carries it to the kitchen, and brings back the result.</p>
        </Step>
        <Step n={5} className="card" delay={0.16}>
          <span className="card-icon">🙋</span>
          <h3>You = the customer</h3>
          <p>You only talk to the waiter. That’s exactly what typing in a terminal is.</p>
        </Step>
      </div>
      <Step n={6}>
        <h3 className="sub">Follow one command through the OS</h3>
        <Journey />
      </Step>
      <Callout label="Coming up">Lecture 4 opens the kernel and shell properly, and you’ll type your first real commands.</Callout>
    </Section>
  )
}
