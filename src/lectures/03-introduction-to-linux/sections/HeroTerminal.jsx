import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { img } from '../images'

// [command, output] pairs typed into the hero terminal, one character at a time.
const script = [
  ['whoami', 'student'],
  ['uname -s', 'Linux'],
  ['echo "Hello, Catalyst!"', 'Hello, Catalyst!'],
]
const total = script.reduce((n, [c]) => n + c.length + 1, 0)

/** Lecture 3 opening picture: a terminal typing its first Linux commands, with Tux watching. */
export default function HeroTerminal() {
  const reduce = useReducedMotion()
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setTyped((t) => (t >= total + 40 ? 0 : t + 1)), 70)
    return () => clearInterval(id)
  }, [reduce])

  const shown = reduce ? total : typed
  let left = shown
  const lines = []
  for (const [cmd, out] of script) {
    if (left <= 0) break
    const n = Math.min(left, cmd.length)
    lines.push({ cmd: cmd.slice(0, n), out: left > cmd.length ? out : null, typing: left <= cmd.length })
    left -= cmd.length + 1
  }

  return (
    <figure className="hero-term">
      <img className="hero-term-art" src={img['hero-art']} alt="" />
      <div className="term hero-term-win" role="img" aria-label="A Linux terminal: whoami prints student, uname prints Linux, echo prints Hello, Catalyst!">
        <div className="term-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          student@catalyst: ~
        </div>
        <div className="term-body" aria-hidden="true">
          {lines.map((l, i) => (
            <div key={i}>
              <p>
                <span className="term-prompt">$</span> {l.cmd}
                {l.typing && <span className="term-caret" />}
              </p>
              {l.out && <p className="term-out">{l.out}</p>}
            </div>
          ))}
          {shown >= total && (
            <p>
              <span className="term-prompt">$</span> <span className="term-caret" />
            </p>
          )}
        </div>
      </div>
      <motion.img
        className="hero-term-tux"
        src={img.tux}
        alt="Tux, the Linux penguin"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 180, damping: 14 }}
      />
      <div className="hero-chips">
        {['Android', 'Servers', 'Cloud'].map((t, i) => (
          <motion.span
            key={t}
            className="hero-chip-tag"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, -6, 0] }}
            transition={{ delay: 1 + i * 0.25, y: { repeat: Infinity, duration: 3 + i, ease: 'easeInOut' } }}
          >
            🐧 {t}
          </motion.span>
        ))}
      </div>
      <figcaption>Your first look at a Linux terminal. By Lecture 4 you’ll be typing these yourself.</figcaption>
    </figure>
  )
}
