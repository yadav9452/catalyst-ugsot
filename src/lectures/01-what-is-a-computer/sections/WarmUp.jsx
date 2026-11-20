import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Illo, Section, Step, useStep } from '../../../design-system'

const devices = [
  ['Smartphone', 'Phone'], ['Laptop', 'Laptop'], ['ATM', 'Atm'], ['Smart TV', 'SmartTv'],
  ['Car dashboard', 'Car'], ['Washing machine', 'WashingMachine'], ['Smartwatch', 'Smartwatch'], ['Lift / elevator', 'Lift'],
  ['Microwave', 'Microwave'], ['Wi-Fi router', 'Router'], ['Metro ticket gate', 'TicketGate'], ['Wireless earbuds', 'Earbuds'],
]

function Reveal({ picked, revealed }) {
  const { guided, shown } = useStep()
  const show = revealed || (guided && shown(3))
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="big-statement" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <p>
            All {picked || 'of them'}. If it takes <mark>input</mark>, <mark>processes</mark> it and gives <mark>output</mark>, it’s a
            computer.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

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
      steps={3}
    >
      <Step n={1}>
        <div className="device-grid" role="group" aria-label="Devices you used today">
          {devices.map(([label, illo], i) => {
            const on = picked.has(label)
            return (
              <motion.button
                type="button"
                key={label}
                className={`device ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => toggle(label)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Illo name={illo} size={100} />
                <span>{label}</span>
                {on && <span className="device-tick" aria-hidden="true">✓</span>}
              </motion.button>
            )
          })}
        </div>
      </Step>

      <Step n={2} className="warmup-footer">
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
      </Step>

      <Reveal picked={picked.size} revealed={revealed} />
    </Section>
  )
}
