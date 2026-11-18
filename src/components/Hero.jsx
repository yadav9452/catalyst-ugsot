import { motion } from 'framer-motion'

const goals = [
  ['01', 'What a computer is', 'A simple definition, with everyday examples'],
  ['02', 'How it works', 'The IPOS cycle: input, processing, output, storage'],
  ['03', 'Hardware and software', 'What they are, and how they work together'],
  ['04', 'Types of computers', 'From phones to the servers behind every website'],
]

function Orbit() {
  const labels = [
    { t: 'Input', x: 50, y: 2 },
    { t: 'Processing', x: 90, y: 50 },
    { t: 'Output', x: 50, y: 98 },
    { t: 'Storage', x: 10, y: 50 },
  ]
  return (
    <div className="orbit" aria-hidden="true">
      <svg viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="180" className="orbit-ring" />
        <motion.circle
          cx="200" cy="200" r="120" className="orbit-dash"
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
        />
        <motion.circle
          cx="200" cy="200" r="54" className="orbit-core"
          animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
      </svg>
      <motion.div
        className="orbit-spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
      >
        <span className="orbit-dot" />
      </motion.div>
      {labels.map((l) => (
        <span key={l.t} className="orbit-label" style={{ left: `${l.x}%`, top: `${l.y}%` }}>
          {l.t}
        </span>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <img className="hero-logo" src="/upgrad-sot-logo.png" alt="upGrad School of Technology" />
          <p className="eyebrow">Catalyst · Web Essentials · Lecture 1</p>
          <h1>
            What Is a Computer <br />
            and <span className="text-red">How It Works</span>
          </h1>
          <p className="hero-sub">From the phone in your pocket to the servers behind every website.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#warmup">Start the lecture ↓</a>
            <a className="btn btn-ghost" href="#quiz">Jump to the self-check</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <Orbit />
        </motion.div>
      </div>

      <div className="container">
        <p className="eyebrow goals-title">What you’ll learn today</p>
        <ol className="goals">
          {goals.map(([n, t, d], i) => (
            <motion.li
              key={n}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <span className="goal-num">{n}</span>
              <strong>{t}</strong>
              <span>{d}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
