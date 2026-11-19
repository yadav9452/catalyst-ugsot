import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// x, y in % of the picture. Parent first.
const heroNodes = {
  '/': { x: 50, y: 9, label: '/' },
  '/bin': { x: 10, y: 38, label: 'bin' },
  '/etc': { x: 30, y: 38, label: 'etc' },
  '/home': { x: 50, y: 38, label: 'home' },
  '/var': { x: 70, y: 38, label: 'var' },
  '/usr': { x: 90, y: 38, label: 'usr' },
  '/home/jason': { x: 40, y: 64, label: 'jason' },
  '/home/pat': { x: 58, y: 64, label: 'pat' },
  '/var/log': { x: 78, y: 64, label: 'log' },
  '/home/jason/scripts': { x: 26, y: 89, label: 'scripts' },
  '/home/jason/notes.txt': { x: 50, y: 89, label: 'notes.txt', file: true },
  '/var/log/syslog': { x: 80, y: 89, label: 'syslog', file: true },
}

const parent = (p) => (p.lastIndexOf('/') === 0 ? '/' : p.slice(0, p.lastIndexOf('/')))

// The pin walks these stops, one after another, forever.
const tour = ['/', '/home', '/home/jason', '/home/jason/scripts', '/home/jason', '/home', '/', '/var', '/var/log', '/var/log/syslog', '/var/log', '/var', '/']

/** Lecture 5 opening picture: an upside-down folder tree with a "you are here" pin walking through it. */
export default function HeroTree() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % tour.length), 1300)
    return () => clearInterval(t)
  }, [])
  const here = tour[i]
  const pin = heroNodes[here]
  const onPath = (p) => here === p || here.startsWith(p === '/' ? '/' : p + '/')

  return (
    <figure className="l5-hero">
      <div
        className="l5-hero-tree"
        role="img"
        aria-label="Linux folders as an upside-down tree starting at /, with a pin walking to /home/jason/scripts and /var/log/syslog"
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {Object.keys(heroNodes)
            .filter((p) => p !== '/')
            .map((p) => {
              const a = heroNodes[parent(p)]
              const b = heroNodes[p]
              return <line key={p} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={onPath(p) ? 'on' : ''} vectorEffect="non-scaling-stroke" />
            })}
        </svg>
        {Object.entries(heroNodes).map(([p, n], k) => (
          <motion.span
            key={p}
            className={`l5-hn ${n.file ? 'is-file' : ''} ${p === '/' ? 'is-root' : ''} ${onPath(p) ? 'on' : ''}`}
            style={{ left: `${n.x}%`, top: `${n.y}%`, x: '-50%', y: '-50%' }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + k * 0.06, type: 'spring', stiffness: 200, damping: 16 }}
          >
            {n.label}
          </motion.span>
        ))}
        <motion.span
          className="l5-pin"
          aria-hidden="true"
          style={{ x: '-50%', y: '-125%' }}
          animate={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        >
          📍
        </motion.span>
      </div>
      <figcaption>
        <span className="l5-hero-path" aria-live="off">
          <span className="l5-hero-prompt">$ pwd</span> {here}
        </span>
      </figcaption>
    </figure>
  )
}
