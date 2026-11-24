import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Reveal, Section, useStep } from '../../../design-system'
import { photos, pic } from '../images'

/*
 * "Open the box": the opening animation for Lecture 2.
 * A computer case swings open to show the CPU, RAM and SSD on the motherboard,
 * then the input and output devices appear around it, then the software layer.
 * Stage 0 = closed; 1–5 match the section's guided steps. With guided mode off it
 * plays once when scrolled into view, and students can replay or jump to a stage.
 */

const stages = [
  { name: 'Closed', text: 'This is a desktop computer’s case (the “CPU cabinet”). From the outside it’s just a box. Let’s open it.' },
  { name: 'Open', text: 'The side panel comes off. Inside is a big green circuit board: the motherboard. Every part plugs into it.' },
  { name: 'CPU', text: 'In the middle sits the CPU, the brain. It runs every instruction. A fan sits on top to keep it cool.' },
  { name: 'Memory', text: 'Next to it: RAM, for what’s open right now, and the SSD, which keeps your files even when the power is off.' },
  { name: 'Devices', text: 'Outside the box, devices plug in. Input devices send data in; output devices show you the result.' },
  { name: 'Software', text: 'Hardware alone does nothing. Software gives every part its instructions. That’s today’s lecture: the parts, then the software.' },
]
const LAST = stages.length - 1

const inputs = [
  ['keyboard', 'Keyboard', pic('keyboard') ?? photos.keyboard],
  ['mouse', 'Mouse', pic('mouse')],
]
const outputs = [
  ['monitor', 'Monitor', photos.monitor],
  ['speaker', 'Speakers', pic('speaker')],
]

function Device({ name, src, side, on, i }) {
  return (
    <motion.figure
      className={`l2-ob-dev is-${side}`}
      initial={false}
      animate={on ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: side === 'in' ? -30 : 30, scale: 0.85 }}
      transition={{ delay: on ? i * 0.15 : 0, type: 'spring', stiffness: 220, damping: 22 }}
    >
      <span className="l2-ob-dev-pic">{src && <img src={src} alt={name} />}</span>
      <figcaption>
        {name}
        <small>{side === 'in' ? 'input' : 'output'}</small>
      </figcaption>
    </motion.figure>
  )
}

function Part({ cls, src, label, on, glow }) {
  return (
    <motion.div
      className={`l2-ob-part ${cls} ${glow ? 'is-glow' : ''}`}
      initial={false}
      animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.92 }}
      transition={{ duration: 0.45 }}
    >
      <img src={src} alt="" />
      <span className="l2-ob-tag">{label}</span>
    </motion.div>
  )
}

function OpenBox() {
  const { guided, step } = useStep()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [local, setLocal] = useState(0)
  const [playing, setPlaying] = useState(false)
  const n = guided ? Math.min(step, LAST) : local

  const busy = playing && local < LAST

  // Students: play once when the scene scrolls into view.
  useEffect(() => {
    if (guided || !inView) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => (reduce ? setLocal(LAST) : setPlaying(true)), 300)
    return () => clearTimeout(t)
  }, [guided, inView])

  useEffect(() => {
    if (!busy) return
    const t = setTimeout(() => setLocal((x) => x + 1), local === 0 ? 900 : 2200)
    return () => clearTimeout(t)
  }, [busy, local])

  const s = stages[n]
  return (
    <div className="l2-ob" ref={ref}>
      <div className="l2-ob-stage">
        <div className="l2-ob-side">
          {inputs.map(([k, name, src], i) => (
            <Device key={k} name={name} src={src} side="in" on={n >= 4} i={i} />
          ))}
        </div>

        <div className="l2-ob-case-wrap">
          <AnimatePresence>
            {n >= 5 && (
              <motion.div className="l2-ob-sw" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <span aria-hidden="true">🪟</span> Software <small>tells every part what to do</small>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={`l2-ob-case ${n >= 5 ? 'is-sw' : ''}`}>
            <div className="l2-ob-board">
              <span className="l2-ob-board-label">Motherboard</span>
              <Part cls="l2-ob-cpu" src={photos.cpu} label="CPU" on={n >= 2} glow={n === 2} />
              <Part cls="l2-ob-ram" src={photos.ram} label="RAM" on={n >= 3} glow={n === 3} />
              <Part cls="l2-ob-ssd" src={photos.ssd} label="SSD" on={n >= 3} glow={n === 3} />
              {n >= 5 &&
                [0, 1, 2].map((k) => (
                  <motion.i
                    key={k}
                    className="l2-ob-pulse"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0.4, 1.6, 2] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.8 }}
                  />
                ))}
            </div>
            <motion.div
              className="l2-ob-panel"
              initial={false}
              animate={{ rotateY: n >= 1 ? -108 : 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              <span className="l2-ob-vents" />
              <span className="l2-ob-power">⏻</span>
            </motion.div>
          </div>
          <p className="l2-ob-case-label">The box: CPU cabinet</p>
        </div>

        <div className="l2-ob-side">
          {outputs.map(([k, name, src], i) => (
            <Device key={k} name={name} src={src} side="out" on={n >= 4} i={i} />
          ))}
        </div>
      </div>

      <div className="l2-ob-foot">
        <div className="l2-ob-steps" role="group" aria-label="Jump to a stage">
          {stages.map((x, k) => (
            <button
              key={x.name}
              type="button"
              className={k === n ? 'is-now' : k < n ? 'is-done' : ''}
              aria-pressed={k === n}
              disabled={guided}
              onClick={() => {
                setPlaying(false)
                setLocal(k)
              }}
            >
              {x.name}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={n} className="l2-ob-text" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            {s.text}
          </motion.p>
        </AnimatePresence>
        {!guided && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setLocal(0)
              setPlaying(true)
            }}
            disabled={busy}
          >
            {n === 0 ? '▶ Open the box' : '↺ Play again'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function OpenBoxSection() {
  return (
    <Section
      id="open-box"
      eyebrow="Let’s look inside"
      title="Open the box"
      intro="Every computer has the same parts inside: the CPU, memory and storage, with devices plugged in around it, and software telling them all what to do. Watch."
      steps={LAST}
    >
      <Reveal>
        <OpenBox />
      </Reveal>
    </Section>
  )
}
