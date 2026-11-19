import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, PauseBadge, Reveal, Section, useStep } from '../../../design-system'
import { img, photos } from '../images'

/* ---------- Small visuals for each job ---------- */

function Meters() {
  const bars = [
    ['CPU', 62],
    ['RAM', 48],
    ['Storage', 30],
    ['Network', 22],
  ]
  return (
    <div className="meters">
      {bars.map(([t, v], i) => (
        <div key={t} className="meter">
          <span>{t}</span>
          <span className="meter-track">
            <motion.i
              initial={{ width: 0 }}
              animate={{ width: [`${v - 15}%`, `${v + 12}%`, `${v}%`] }}
              transition={{ duration: 2.4, delay: i * 0.15, repeat: Infinity, repeatType: 'mirror' }}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

function Execution() {
  const stops = [
    ['Storage', photos.ssd],
    ['RAM', photos.ram],
    ['CPU', photos.cpu],
  ]
  return (
    <div className="exec">
      {stops.map(([t, src], i) => (
        <div key={t} className="exec-stop">
          <img src={src} alt="" />
          <span>{t}</span>
          {i < stops.length - 1 && <span className="exec-arrow" aria-hidden="true" style={{ '--d': `${i * 0.6}s` }} />}
        </div>
      ))}
    </div>
  )
}

const jobs = [
  {
    t: 'User interface',
    icon: '🖱',
    lines: ['Acts as the interface between you and the computer hardware.', 'Example: you click an icon instead of typing technical instructions.'],
    art: () => (
      <div className="job-ui">
        <img src={img.folder} alt="" />
        <img className="job-cursor" src={img.cursor} alt="" />
      </div>
    ),
  },
  {
    t: 'Resource management',
    icon: '⚖',
    lines: ['Shares the CPU, memory, storage and devices among apps, in the background.', 'Makes sure one app can’t freeze the whole system.'],
    art: Meters,
  },
  {
    t: 'Multitasking',
    icon: '⧉',
    lines: ['Lets many applications run at the same time.', 'Example: watching a video while you code. See it in slow motion below.'],
    art: () => <img className="job-shot" src={img.multitask} alt="A video and VS Code open side by side" />,
  },
  {
    t: 'Memory & file management',
    icon: '🗂',
    lines: [
      'Gives memory to apps when they need it, and takes it back when they close.',
      'Organises data into files and folders, and controls who can open them.',
    ],
    art: () => (
      <div className="job-files">
        {['src', 'notes', 'photos'].map((f, i) => (
          <motion.span key={f} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}>
            <img src={img.folder} alt="" />
            {f}
          </motion.span>
        ))}
      </div>
    ),
  },
  {
    t: 'Security & error handling',
    icon: '🛡',
    lines: ['Spots hardware or software failures and tells you about them.', 'Blocks unauthorised access and keeps apps apart from each other.'],
    art: () => (
      <div className="job-pair">
        <img src={img.security} alt="A locked laptop" />
        <img src={img.error} alt="An error sign on a laptop" />
      </div>
    ),
  },
  {
    t: 'Program execution',
    icon: '▶',
    lines: ['Loads programs and runs them.', 'Copies the app from storage into memory, gives it CPU time, and manages it until it closes.'],
    art: Execution,
  },
]

function JobWheel() {
  const { guided, step } = useStep()
  const [picked, setPicked] = useState(0)
  const active = guided ? Math.max(0, Math.min(step, jobs.length) - 1) : picked
  const job = jobs[active]
  const Art = job.art
  return (
    <div className="jobs">
      <div className="wheel" role="group" aria-label="The six jobs of an operating system">
        <div className="wheel-hub">
          <img src={img.tux} alt="" />
          <strong>OS</strong>
        </div>
        {jobs.map((j, i) => (
          <button
            key={j.t}
            type="button"
            className={`wheel-node ${i === active ? 'is-on' : ''}`}
            style={{ '--a': `${i * 60 - 90}deg` }}
            aria-pressed={i === active}
            onClick={() => setPicked(i)}
          >
            <span className="wheel-node-in">
              <span className="wheel-icon" aria-hidden="true">
                {j.icon}
              </span>
              <span>
                <b>{i + 1}.</b> {j.t}
              </span>
            </span>
          </button>
        ))}
        <svg className="wheel-spokes" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="36" />
          {jobs.map((j, i) => {
            const a = ((i * 60 - 90) * Math.PI) / 180
            return <line key={j.t} x1="50" y1="50" x2={50 + 36 * Math.cos(a)} y2={50 + 36 * Math.sin(a)} className={i === active ? 'on' : ''} />
          })}
        </svg>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={job.t}
          className="job-detail"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
        >
          <p className="job-n">Job {active + 1} of 6</p>
          <h3>{job.t}</h3>
          <div className="job-art">
            <Art />
          </div>
          <ul>
            {job.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Multitasking in slow motion ---------- */

const lanes = ['Video', 'VS Code', 'Music']
// Slider value → milliseconds per turn. Left = slow motion, right = real speed.
const speeds = [1400, 800, 400, 160, 50]

function TimeSlice() {
  const [speed, setSpeed] = useState(0)
  const [running, setRunning] = useState(true)
  const [{ turn, work }, setSim] = useState({ turn: 0, work: [0, 0, 0] })

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSim(({ turn: t, work: w }) => {
        const next = (t + 1) % lanes.length
        return { turn: next, work: w.map((v, i) => (i === next ? (v + 4) % 100 : v)) }
      })
    }, speeds[speed])
    return () => clearInterval(id)
  }, [running, speed])

  const fast = speed >= 3
  return (
    <div className="slice">
      <div className="slice-cpu">
        <img src={photos.cpu} alt="" />
        <span>
          CPU is working on: <strong>{fast ? 'all three (it looks like)' : lanes[turn]}</strong>
        </span>
      </div>
      <div className="slice-lanes">
        {lanes.map((t, i) => (
          <div key={t} className={`slice-lane ${i === turn && !fast ? 'is-on' : ''} ${fast ? 'is-fast' : ''}`}>
            <span className="slice-name">{t}</span>
            <span className="slice-track">
              <i style={{ width: `${work[i]}%` }} />
            </span>
            <span className="slice-turn" aria-hidden="true">
              {i === turn ? '◀ CPU' : ''}
            </span>
          </div>
        ))}
      </div>
      <div className="slice-controls">
        <label htmlFor="slice-speed">Slow motion</label>
        <input id="slice-speed" type="range" min="0" max={speeds.length - 1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        <label htmlFor="slice-speed">Real speed</label>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRunning((r) => !r)}>
          {running ? '❚❚ Pause' : '▶ Play'}
        </button>
      </div>
      <p className="slice-caption" aria-live="polite">
        {fast
          ? 'At real speed the switching is so fast that all three seem to run at once.'
          : 'In slow motion you can see it: the OS gives the CPU to one app at a time, for a tiny slice of time each.'}
      </p>
    </div>
  )
}

export default function Jobs() {
  return (
    <>
      <Section
        id="jobs"
        eyebrow="What does an OS do?"
        title="The six jobs of an operating system"
        intro="Click each job around the wheel. Count them as we go: you’ll need all six for the self-check."
        steps={6}
      >
        <JobWheel />
      </Section>

      <Section
        id="multitasking"
        eyebrow="Job 3 in slow motion"
        title="How can one CPU run three apps at once?"
        intro="It can’t, really. It switches between them very fast. Drag the slider from slow motion to real speed."
        tone="alt"
      >
        <Reveal>
          <TimeSlice />
        </Reveal>
        <PauseBadge>Pause the video: drag the slider yourself and watch the CPU switch</PauseBadge>
        <Callout>Your laptop has a few CPU cores, but dozens of programs running. The OS switches between them thousands of times a second.</Callout>
      </Section>
    </>
  )
}
