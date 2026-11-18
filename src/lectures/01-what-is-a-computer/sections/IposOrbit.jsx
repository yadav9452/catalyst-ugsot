import { motion } from 'framer-motion'

/** Hero visual for Lecture 1: an orbit labelled with the four IPOS steps. */
export default function IposOrbit() {
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
        <motion.circle cx="200" cy="200" r="120" className="orbit-dash" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} />
        <motion.circle cx="200" cy="200" r="54" className="orbit-core" animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
      </svg>
      <motion.div className="orbit-spinner" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}>
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
