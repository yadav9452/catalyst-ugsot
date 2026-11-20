import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const visitors = [
  { who: 'u', icon: '🧑‍💻', name: 'student', role: 'the owner', set: 'rwx' },
  { who: 'g', icon: '👥', name: 'devs group', role: 'a group member', set: 'r-x' },
  { who: 'o', icon: '🌍', name: 'anyone else', role: 'everyone else', set: '---' },
]
const verbs = { r: 'read', w: 'change', x: 'run' }

/** Lecture 6 opening picture: -rwxr-x--- with visitors taking turns at the door. */
export default function HeroLock() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % visitors.length), 2200)
    return () => clearInterval(t)
  }, [])
  const v = visitors[i]
  const str = 'rwxr-x---'

  return (
    <figure
      className="l6-hero"
      aria-label="The permission string -rwxr-x---: the owner can read, change and run deploy.sh, the group can read and run it, everyone else can do nothing"
    >
      <div className="l6-hero-file">
        <span className="l6-hero-icon" aria-hidden="true">
          📜
        </span>
        <code>deploy.sh</code>
        <motion.span className="l6-hero-lock" aria-hidden="true" animate={{ rotate: v.set === '---' ? [0, -12, 12, 0] : 0 }} transition={{ duration: 0.5 }}>
          {v.set === '---' ? '🔒' : '🔓'}
        </motion.span>
      </div>
      <div className="l6-hero-str" aria-hidden="true">
        <span className="l6-hero-type">-</span>
        {['u', 'g', 'o'].map((c, k) => (
          <span key={c} className={`l6-hero-trip l6c-${c} ${v.who === c ? 'on' : ''}`}>
            {str
              .slice(k * 3, k * 3 + 3)
              .split('')
              .map((ch, j) => (
                <motion.b key={j} animate={{ y: v.who === c ? [0, -6, 0] : 0 }} transition={{ delay: j * 0.08, duration: 0.35 }}>
                  {ch}
                </motion.b>
              ))}
            <small>{{ u: 'user', g: 'group', o: 'others' }[c]}</small>
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.figcaption key={i} className="l6-hero-cap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <span className="l6-hero-who">
            <span aria-hidden="true">{v.icon}</span> {v.name} <em>({v.role})</em>
          </span>
          <span className="l6-hero-can">
            {'rwx'.split('').map((p, j) => (
              <span key={p} className={v.set[j] !== '-' ? 'yes' : 'no'}>
                {v.set[j] !== '-' ? '✓' : '✗'} {verbs[p]}
              </span>
            ))}
          </span>
        </motion.figcaption>
      </AnimatePresence>
    </figure>
  )
}
