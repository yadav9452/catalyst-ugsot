import { motion } from 'framer-motion'
import { photos } from '../images'

const parts = [
  { label: 'Control Unit', note: 'The manager', x: 18, y: 18 },
  { label: 'ALU', note: 'The calculator', x: 82, y: 30 },
  { label: 'Registers & cache', note: 'Tiny, fast memory', x: 26, y: 84 },
]

/** Lecture 2 opening picture: real CPU chips with the three parts inside labelled. */
export default function HeroChip() {
  return (
    <figure className="hero-chip">
      <div className="hero-chip-stage">
        <motion.img
          src={photos.cpu}
          alt="CPU chips on a circuit board"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div className="chip-glow" aria-hidden="true" animate={{ opacity: [0.35, 0.7, 0.35] }} transition={{ repeat: Infinity, duration: 3 }} />
        {parts.map((p, i) => (
          <motion.div
            key={p.label}
            className="chip-tag"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, y: 12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.35, type: 'spring', stiffness: 240, damping: 18 }}
          >
            <strong>{p.label}</strong>
            <small>{p.note}</small>
          </motion.div>
        ))}
      </div>
      <figcaption>Inside every CPU: a manager, a calculator and a tiny scratchpad.</figcaption>
    </figure>
  )
}
