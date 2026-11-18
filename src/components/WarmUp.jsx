import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section } from './ui'

const devices = [
  'Smartphone', 'Laptop', 'ATM', 'Smart TV', 'Car dashboard', 'Washing machine',
  'Smartwatch', 'Lift / elevator', 'Microwave', 'Wi-Fi router', 'Metro ticket gate', 'Wireless earbuds',
]

export default function WarmUp() {
  const [picked, setPicked] = useState(() => new Set())
  const [revealed, setRevealed] = useState(false)

  function toggle(d) {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d)
      else next.add(d)
      return next
    })
  }

  return (
    <Section
      id="warmup"
      eyebrow="Warm-up"
      title="How many computers did you use today?"
      intro="Tap everything you used since you woke up. Most people say one or two. The real answer is usually much higher."
      tone="alt"
    >
      <div className="chip-grid" role="group" aria-label="Devices you used today">
        {devices.map((d, i) => {
          const on = picked.has(d)
          return (
            <motion.button
              type="button"
              key={d}
              className={`chip ${on ? 'is-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(d)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.95 }}
            >
              {on ? '✓ ' : ''}
              {d}
            </motion.button>
          )
        })}
      </div>

      <div className="warmup-footer">
        <p className="counter" aria-live="polite">
          You picked{' '}
          <motion.strong key={picked.size} initial={{ scale: 1.5, color: '#E00C16' }} animate={{ scale: 1 }}>
            {picked.size}
          </motion.strong>{' '}
          {picked.size === 1 ? 'device' : 'devices'}
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setRevealed(true)}>
          How many were computers?
        </button>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div className="big-statement" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p>
              All {picked.size || 'of them'}. If it takes <mark>input</mark>, <mark>processes</mark> it and gives{' '}
              <mark>output</mark>, it’s a computer.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <Reveal as="p" className="note">
        Keep that sentence in mind. It’s the core of today’s lecture.
      </Reveal>
    </Section>
  )
}
