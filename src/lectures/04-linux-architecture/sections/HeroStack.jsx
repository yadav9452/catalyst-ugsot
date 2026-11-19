import { motion } from 'framer-motion'
import { img3 } from '../images'

// Bottom to top, the way we number the layers.
const slabs = [
  { k: 'hw', t: 'Hardware', d: 'CPU · RAM · storage' },
  { k: 'kernel', t: 'Kernel', d: 'full control' },
  { k: 'sys', t: 'System calls', d: 'the only door' },
  { k: 'user', t: 'User space', d: 'shell · desktop · apps' },
  { k: 'you', t: 'You', d: 'type a command' },
]

/** Lecture 4 opening picture: the layers of Linux as an exploded 3D stack. Hover to spread them. */
export default function HeroStack() {
  return (
    <figure className="l4-hero">
      <div className="l4-stack" role="img" aria-label="Linux layers from the bottom: hardware, kernel, system calls, user space, you">
        {slabs.map((s, i) => (
          <motion.div
            key={s.k}
            className={`l4-slab l4-slab-${s.k}`}
            style={{ '--i': i }}
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (slabs.length - i) * 0.15, type: 'spring', stiffness: 140, damping: 16 }}
          >
            <span className="l4-slab-face">{s.k === 'kernel' && <img src={img3.tux} alt="" />}</span>
            <span className="l4-slab-label">
              <strong>{s.t}</strong>
              <small>{s.d}</small>
            </span>
          </motion.div>
        ))}
      </div>
      <figcaption>Hover the stack to pull the layers apart.</figcaption>
    </figure>
  )
}
