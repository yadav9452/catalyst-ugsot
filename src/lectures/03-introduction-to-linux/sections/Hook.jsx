import { motion } from 'framer-motion'
import { useState } from 'react'
import { Section, Step, useStep } from '../../../design-system'
import { img, photos } from '../images'

const cards = [
  { pic: photos.mobile, q: 'Used a smartphone today?', a: 'Most of the world’s phones run Android, which is built on the Linux kernel.' },
  { pic: img.music, q: 'Watched a video or scrolled Instagram?', a: 'Those pages were sent to you by Linux servers.' },
  { pic: img.aws, q: 'Used any app that runs in the cloud?', a: 'Most virtual machines on AWS and Google Cloud run Linux.' },
  { pic: img['cli-terminal'], q: 'Going to deploy code as a developer?', a: 'It will almost certainly run on Linux.' },
]

function FlipCards() {
  const { guided, shown } = useStep()
  const [open, setOpen] = useState({})
  // Guided mode: step 2i+1 shows card i, step 2i+2 flips it.
  const flipped = cards.map((_, i) => open[i] || (guided && shown(i * 2 + 2)))
  const count = flipped.filter(Boolean).length
  return (
    <>
      <div className="flip-grid">
        {cards.map((c, i) => (
          <Step key={c.q} n={i * 2 + 1} delay={i * 0.08}>
            <button
              type="button"
              className={`flip ${flipped[i] ? 'is-flipped' : ''}`}
              aria-pressed={flipped[i]}
              onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
            >
              <span className="flip-inner">
                <span className="flip-face flip-front">
                  <img src={c.pic} alt="" />
                  <strong>{c.q}</strong>
                  <small>Tap to find out</small>
                </span>
                <span className="flip-face flip-back">
                  <span className="flip-tux">
                    <img src={img.tux} alt="" />
                  </span>
                  <strong>{c.a}</strong>
                </span>
              </span>
            </button>
          </Step>
        ))}
      </div>
      <div className="linux-count" aria-live="polite">
        Times you met Linux today:
        <motion.span key={count} initial={{ scale: 1.6, color: '#e00c16' }} animate={{ scale: 1, color: '#1a1a1a' }}>
          {count}
        </motion.span>
        <span className="linux-count-bar">
          <motion.i animate={{ width: `${(count / cards.length) * 100}%` }} />
        </span>
      </div>
    </>
  )
}

export default function Hook() {
  return (
    <Section
      id="hook"
      eyebrow="Warm-up"
      title="You already used Linux today"
      intro="Answer each question in your head, then flip the card. Linux is hiding in more places than you think."
      steps={8}
    >
      <FlipCards />
    </Section>
  )
}
