import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const demos = [
  { pkg: 'nginx', deps: ['nginx-common'], what: 'a web server' },
  { pkg: 'git', deps: ['git-man', 'liberror-perl'], what: 'version control' },
  { pkg: 'nodejs', deps: ['libnode109'], what: 'JavaScript on the server' },
]

/** Lecture 7 opening picture: one apt command pulls a package and its dependencies from the repository. */
export default function HeroApt() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % demos.length), 3200)
    return () => clearInterval(t)
  }, [])
  const d = demos[i]
  const boxes = [d.pkg, ...d.deps]

  return (
    <figure className="l7-hero" aria-label={`The command sudo apt install ${d.pkg} downloads ${d.pkg} and its dependencies from the repository and installs them`}>
      <div className="l7-hero-repo" aria-hidden="true">
        <span className="l7-hero-cloud">☁️</span>
        <small>Ubuntu repository</small>
      </div>
      <div className="l7-hero-lane" aria-hidden="true">
        <AnimatePresence mode="popLayout">
          {boxes.map((b, k) => (
            <motion.span
              key={`${i}-${b}`}
              className={`l7-hero-box ${k === 0 ? 'is-main' : ''}`}
              initial={{ opacity: 0, y: -40, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.6 }}
              transition={{ delay: 0.3 + k * 0.35, duration: 0.45 }}
            >
              📦 {b}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="l7-hero-tty">
        <p>
          <span className="l7-p">~$</span> sudo apt install <b>{d.pkg}</b>
        </p>
        <div className="l7-hero-bar" aria-hidden="true">
          <motion.i key={i} initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.2, ease: 'easeInOut' }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={i} className="l7-hero-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
            ✓ {boxes.length} packages installed: {d.what} is ready
          </motion.p>
        </AnimatePresence>
      </div>
    </figure>
  )
}
