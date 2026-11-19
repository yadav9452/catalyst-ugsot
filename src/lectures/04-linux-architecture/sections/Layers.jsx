import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Section, Step, useStep } from '../../../design-system'
import { img, img3 } from '../images'

/* ---------- Lecture 3 rings → the precise picture ---------- */

function Precise({ pick, onPick }) {
  const box = (k, label, extra = '') => (
    <button type="button" className={`l4-p l4-p-${k} ${extra} ${pick === k ? 'is-on' : ''}`} aria-pressed={pick === k} onClick={() => onPick(k)}>
      {label}
    </button>
  )
  return (
    <div className="l4-precise">
      {box('you', 'You')}
      <div className="l4-p-us">
        <span className="l4-p-tag">USER SPACE · limited access</span>
        <div className="l4-p-row">
          {box('shell', 'Shell (bash, zsh)', 'l4-p-app')}
          {box('gui', 'Desktop (GUI)', 'l4-p-app')}
          {box('apps', 'Apps: Chrome, VS Code', 'l4-p-app')}
        </div>
        {box('libs', 'System libraries (e.g. glibc)')}
      </div>
      {box('sys', 'System calls: open() · read() · write() · fork()')}
      {box('kernel', 'KERNEL SPACE · full control')}
      {box('hw', 'HARDWARE: CPU · RAM · storage · network')}
    </div>
  )
}

const info = {
  you: ['You', 'You give instructions through a GUI (click) or a CLI (type). Both are programs in user space.'],
  shell: ['Shell', 'A normal program in user space. It reads your command and asks the kernel to run it. It is not a layer between apps and the kernel.'],
  gui: ['Desktop (GUI)', 'Windows, icons and menus are drawn by a program in user space too (on Ubuntu, GNOME).'],
  apps: ['Apps', 'Chrome, VS Code and the programs you write. They never touch the hardware directly.'],
  libs: ['System libraries', 'Ready-made functions (like the C library, glibc) that apps call. They make the system calls for you.'],
  sys: ['System calls', 'The only door from user space into the kernel. Every file, screen or network request goes through it.'],
  kernel: ['Kernel', 'The core of Linux. Loaded first at boot. Manages the CPU, memory, devices, files and security.'],
  hw: ['Hardware', 'The physical parts: CPU, RAM, storage, network card, keyboard, mouse, monitor.'],
}

function ZoomIn() {
  const { guided, shown } = useStep()
  const [view, setView] = useState('rings')
  const [pick, setPick] = useState('shell')
  const v = guided ? (shown(2) ? 'precise' : 'rings') : view
  return (
    <div className="l4-zoom">
      <div className="segmented" role="group" aria-label="Choose a view">
        <button type="button" className={v === 'rings' ? 'is-on' : ''} aria-pressed={v === 'rings'} onClick={() => setView('rings')}>
          Lecture 3 view: rings
        </button>
        <button type="button" className={v === 'precise' ? 'is-on' : ''} aria-pressed={v === 'precise'} onClick={() => setView('precise')}>
          Today: the precise picture
        </button>
      </div>
      <AnimatePresence mode="wait">
        {v === 'rings' ? (
          <motion.figure
            key="rings"
            className="l4-rings"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3, filter: 'blur(6px)' }}
          >
            <img src={img.rings} alt="Rings: hardware in the centre, then kernel, shell, application, user" />
            <figcaption>A good start, but it suggests apps go through the shell. They don’t.</figcaption>
          </motion.figure>
        ) : (
          <motion.div
            key="precise"
            className="l4-zoom-precise"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          >
            <Precise pick={pick} onPick={setPick} />
            <AnimatePresence mode="wait">
              <motion.div
                key={pick}
                className="l4-p-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                aria-live="polite"
              >
                <p className="eyebrow">Click any box</p>
                <h3>{info[pick][0]}</h3>
                <p>{info[pick][1]}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- The five layers, bottom up ---------- */

const layers = [
  { n: 1, t: 'Hardware', tag: 'The physical parts', pic: img.pc, pts: ['CPU, RAM, storage, network card', 'Keyboard, mouse, monitor'] },
  {
    n: 2,
    t: 'Kernel',
    tag: 'Brain of the OS',
    pic: img3.tux,
    pts: ['Core of the OS, loaded first at boot', 'The only part allowed to talk to the hardware', 'Manages CPU, memory and devices'],
  },
  {
    n: 3,
    t: 'Shell',
    tag: 'Command handler',
    pic: img.nut,
    pts: ['A normal program in user space', 'Reads your commands, runs programs and scripts', 'Keeps environment variables: $HOME, $PATH, $USER'],
  },
  {
    n: 4,
    t: 'Applications',
    tag: 'Chrome, VS Code',
    pic: img3.chrome,
    pts: ['User-facing software, including what you write', 'Never touch the hardware directly', 'Use system libraries, which make system calls'],
  },
  { n: 5, t: 'User', tag: 'You', pic: img3.user, pts: ['You give instructions through a GUI or a CLI', 'Both are programs in user space'] },
]

function LayerTower() {
  const { guided, step } = useStep()
  const [pick, setPick] = useState(1)
  // Guided steps 3..7 walk the layers bottom-up.
  const active = guided && step >= 3 ? Math.min(step - 2, 5) : pick
  const L = layers[active - 1]
  return (
    <div className="l4-tower">
      <ol className="l4-tower-list" aria-label="Linux layers, top to bottom">
        {[...layers].reverse().map((l) => (
          <li key={l.n}>
            <button
              type="button"
              className={`l4-tower-btn l4-t${l.n} ${active === l.n ? 'is-on' : ''}`}
              aria-pressed={active === l.n}
              onClick={() => setPick(l.n)}
            >
              <span className="l4-tower-n">Layer {l.n}</span>
              <strong>{l.t}</strong>
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={L.n} className="l4-tower-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <img src={L.pic} alt="" />
          <div>
            <p className="eyebrow">
              Layer {L.n} · {L.tag}
            </p>
            <h3>{L.t}</h3>
            <ul>
              {L.pts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Layers() {
  return (
    <Section
      id="layers"
      eyebrow="Part 1 · Layered design"
      title="Last lecture: rings. Today: zoom in."
      intro="Linux is split into two worlds: kernel space (the core, with full control of the hardware) and user space (everything else: the shell, the desktop and your apps)."
      steps={7}
    >
      <Step n={1}>
        <ZoomIn />
      </Step>
      <h3 className="sub">The five layers, from the bottom up</h3>
      <LayerTower />
      <Callout label="Remember">
        The shell is not a wall between apps and the kernel. It’s one more program in user space, and everything reaches the kernel through system calls.
      </Callout>
    </Section>
  )
}
