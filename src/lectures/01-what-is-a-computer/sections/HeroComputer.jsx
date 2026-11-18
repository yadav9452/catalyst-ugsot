import { motion } from 'framer-motion'
import { photos } from '../images'

const desktop = photos.pcSet

// Where each IPOS label points on the photo (percent of the image box).
const parts = [
  { label: 'Output', note: 'Monitor', x: 62, y: 36, side: 'right' },
  { label: 'Processing', note: 'CPU in the tower', x: 20, y: 30, side: 'left' },
  { label: 'Storage', note: 'SSD in the tower', x: 22, y: 60, side: 'left' },
  { label: 'Input', note: 'Keyboard and mouse', x: 48, y: 80, side: 'right' },
]

/** Lecture 1 opening picture: a desktop computer with its IPOS parts labelled one by one. */
export default function HeroComputer() {
  return (
    <figure className="hero-pc">
      <div className="hero-pc-stage">
        <motion.img
          src={desktop}
          alt="A desktop computer: tower, monitor, keyboard and mouse"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {parts.map((p, i) => (
          <motion.div
            key={p.label}
            className={`pc-tag pc-tag-${p.side}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.35, type: 'spring', stiffness: 260, damping: 18 }}
          >
            <span className="pc-dot" aria-hidden="true" />
            <span className="pc-chip">
              <strong>{p.label}</strong>
              <small>{p.note}</small>
            </span>
          </motion.div>
        ))}
      </div>
      <figcaption>Every computer has the same four jobs: input, processing, output and storage.</figcaption>
    </figure>
  )
}
