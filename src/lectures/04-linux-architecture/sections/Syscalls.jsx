import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, PauseBadge, Reveal, Section, Step } from '../../../design-system'

/* ---------- Trace the system calls of one command ---------- */

// Each step: which zone the request is in, the strace-style line, and a plain-English caption.
const programs = {
  cat: {
    cmd: 'cat notes.txt',
    out: 'Buy milk',
    steps: [
      ['app', null, 'cat starts in user space. It wants to read notes.txt, but it can’t touch the disk itself.'],
      ['kernel', 'openat(AT_FDCWD, "notes.txt", O_RDONLY) = 3', 'System call 1: open the file. The kernel checks permissions and finds it on disk.'],
      ['device', 'read(3, "Buy milk\\n", 131072) = 9', 'System call 2: read it. The kernel asks the disk for the bytes and copies them to cat.'],
      ['kernel', 'write(1, "Buy milk\\n", 9) = 9', 'System call 3: write to the screen (file 1 = your terminal).'],
      ['kernel', 'close(3) = 0', 'System call 4: close the file. Done.'],
      ['app', null, 'Four system calls for one tiny command. Every program works this way.'],
    ],
  },
  mkdir: {
    cmd: 'mkdir projects',
    out: '',
    steps: [
      ['app', null, 'mkdir starts in user space. It needs a new folder on the disk.'],
      ['kernel', 'mkdir("projects", 0777) = 0', 'One system call: “please make a folder called projects”.'],
      ['device', null, 'The kernel’s file system code writes the new folder to storage.'],
      ['app', null, 'Back in user space. mkdir prints nothing when it succeeds.'],
    ],
  },
}
const zones = [
  ['app', 'Your program', 'user space'],
  ['kernel', 'Kernel', 'kernel space'],
  ['device', 'Disk / screen', 'hardware'],
]

function Tracer() {
  const [prog, setProg] = useState('cat')
  const [i, setI] = useState(-1)
  const P = programs[prog]
  useEffect(() => {
    if (i < 0 || i >= P.steps.length - 1) return
    const id = setTimeout(() => setI(i + 1), 1700)
    return () => clearTimeout(id)
  }, [i, P])
  const zone = i < 0 ? 'app' : P.steps[i][0]
  const zi = zones.findIndex((z) => z[0] === zone)
  const log = P.steps.slice(0, i + 1).filter((s) => s[1])
  const done = i === P.steps.length - 1
  return (
    <div className="l4-trace">
      <div className="l4-trace-pick">
        {Object.entries(programs).map(([k, p]) => (
          <button
            key={k}
            type="button"
            className={`l4-chip ${prog === k ? 'is-on' : ''}`}
            aria-pressed={prog === k}
            onClick={() => {
              setProg(k)
              setI(-1)
            }}
          >
            $ {p.cmd}
          </button>
        ))}
      </div>
      <div className="l4-zones">
        {zones.map(([k, t, s], n) => (
          <div key={k} className={`l4-zone l4-zone-${k} ${zone === k && i >= 0 ? 'is-on' : ''}`}>
            <strong>{t}</strong>
            <small>{s}</small>
            {n === 0 && <span className="l4-wall">system call boundary</span>}
          </div>
        ))}
        <motion.span
          className="l4-token"
          animate={{ left: `${16.7 + zi * 33.3}%`, opacity: i < 0 ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 110, damping: 15 }}
          aria-hidden="true"
        >
          {zone === 'app' ? '▶' : zone === 'kernel' ? '⚙' : '💽'}
        </motion.span>
      </div>
      <p className="l4-trace-cap" aria-live="polite">
        {i < 0 ? 'Pick a command, then press Trace to follow its system calls.' : P.steps[i][2]}
      </p>
      <div className="tty l4-strace" aria-label="strace output">
        <div className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          strace {P.cmd}
        </div>
        <div className="tty-body">
          <p>
            <span className="tty-prompt">$</span> strace {P.cmd}
          </p>
          {log.map((l) => (
            <motion.p key={l[1]} className="tty-sys" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {l[1]}
            </motion.p>
          ))}
          {done && P.out && <p className="tty-out">{P.out}</p>}
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={() => setI(0)} disabled={i >= 0 && !done}>
        {done ? '↺ Trace again' : '▶ Trace'}
      </button>
    </div>
  )
}

export default function Syscalls() {
  return (
    <Section
      id="syscalls"
      eyebrow="Part 3 · The bridge"
      title="How does an app talk to the kernel? System calls."
      intro="When an app needs the hardware, it asks the kernel with a system call: open() a file, read() it, write() to the screen, fork() a new process."
      steps={3}
    >
      <div className="card-grid three">
        <Step n={1} className="card l4-bank">
          <span className="card-icon">🏦</span>
          <h3>Like a bank</h3>
          <p>You can’t walk into the vault. You hand a slip to the cashier, who fetches it for you.</p>
        </Step>
        <Step n={2} className="card l4-bank" delay={0.08}>
          <span className="card-icon">🧾</span>
          <h3>The slip = a system call</h3>
          <p>open(), read(), write(), fork(): a fixed list of requests the kernel understands.</p>
        </Step>
        <Step n={3} className="card l4-bank" delay={0.16}>
          <span className="card-icon">🧑‍💼</span>
          <h3>The cashier = the kernel</h3>
          <p>Checks you’re allowed, does the work with the hardware, and hands back the result.</p>
        </Step>
      </div>
      <h3 className="sub">Watch a real command make its system calls</h3>
      <Reveal>
        <Tracer />
      </Reveal>
      <PauseBadge>On Linux or WSL, try it yourself: sudo apt install strace, then strace ls</PauseBadge>
      <Callout>Your JavaScript, Python or Java code makes the same system calls underneath, every time it reads a file or opens a network connection.</Callout>
    </Section>
  )
}
