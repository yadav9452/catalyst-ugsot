import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Callout, Illo, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { photos } from '../images'

/* ---------- Input ---------- */

const inputTypes = [
  ['Text input', 'Keyboard', 'Keyboard'],
  ['Pointing', 'Mouse, trackpad, touchscreen', 'Mouse'],
  ['Audio', 'Microphone, MIDI keyboard', 'Microphone'],
  ['Image and video', 'Scanner, webcam, digital camera', 'Camera'],
  ['Gaming and motion', 'Joystick, gamepad, VR controller', 'Gamepad'],
]

const inputSteps = [
  'You press a key',
  'The keyboard detects it',
  'It becomes a digital code',
  'The code travels to the computer',
  'The CPU works out what to do',
  'The letter appears on screen',
]

/** Type a letter and watch it travel through the six input steps. */
function KeyJourney() {
  const [key, setKey] = useState(null)
  const [stage, setStage] = useState(-1)
  const [typed, setTyped] = useState('')
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function send(ch) {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setKey(ch)
    setStage(0)
    inputSteps.forEach((_, i) => timers.current.push(setTimeout(() => setStage(i), i * 600)))
    timers.current.push(setTimeout(() => setTyped((t) => (t + ch).slice(-24)), 5 * 600))
  }

  function onKeyDown(e) {
    if (e.key.length === 1 && /[a-z0-9 ]/i.test(e.key)) {
      e.preventDefault()
      send(e.key.toUpperCase())
    }
  }

  const code = key ? key.charCodeAt(0) : null
  const binary = code !== null ? code.toString(2).padStart(8, '0') : ''

  return (
    <div className="journey">
      <label className="journey-input">
        <span>Click here and type a letter</span>
        <input type="text" value="" onChange={() => {}} onKeyDown={onKeyDown} placeholder="Type A, B, C…" aria-describedby="journey-help" />
      </label>
      <div className="journey-keys" role="group" aria-label="Or click a key">
        {'HELLO'.split('').map((c, i) => (
          <button key={`${c}${i}`} type="button" onClick={() => send(c)}>
            {c}
          </button>
        ))}
      </div>
      <ol className="journey-steps">
        {inputSteps.map((s, i) => (
          <motion.li key={s} animate={{ opacity: stage >= i ? 1 : 0.3, y: stage === i ? -4 : 0 }} className={stage >= i ? 'is-on' : ''}>
            <span className="journey-n">{i + 1}</span>
            <span>{s}</span>
            {i === 0 && key && stage >= 0 && <kbd>{key}</kbd>}
            {i === 2 && key && stage >= 2 && (
              <code>
                {key} → {code} → {binary}
              </code>
            )}
          </motion.li>
        ))}
      </ol>
      <div className="journey-screen" aria-live="polite" id="journey-help">
        {typed || <span className="muted">Your letters appear here</span>}
        <span className="cursor" aria-hidden="true" />
      </div>
    </div>
  )
}

/* ---------- Output ---------- */

const outputTypes = [
  ['Visual', 'Monitor, projector', photos.monitor, 'Projector'],
  ['Audio', 'Speaker, headphones', null, 'Headphones'],
  ['Print', 'Printer', null, 'Printer'],
]
const outputSteps = [
  ['Receive', 'The device gets processed data from the computer'],
  ['Interpret', 'It reads the signals'],
  ['Convert', 'It turns them into light, sound or print'],
  ['Present', 'You see, hear or hold the result'],
]

/* ---------- Challenge ---------- */

const challenge = [
  ['Keyboard', 'Keyboard', 'in'],
  ['Monitor', 'Monitor', 'out'],
  ['Headphones', 'Headphones', 'out'],
  ['Speaker', 'Speaker', 'out'],
  ['Touchpad', 'Mouse', 'in'],
  ['Touchscreen', 'Touch', 'both'],
]
const kinds = { in: 'Input', out: 'Output', both: 'Both' }

function IoChallenge() {
  const [answers, setAnswers] = useState({})
  const [reveal, setReveal] = useState(false)
  const score = challenge.filter(([n, , k]) => answers[n] === k).length
  return (
    <div className="io-game">
      <div className="io-grid">
        {challenge.map(([name, illo, kind]) => {
          const a = answers[name]
          const right = a === kind
          const show = reveal || a
          return (
            <motion.div
              key={name}
              className={`io-card ${show ? (right || reveal ? 'is-right' : 'is-wrong') : ''}`}
              animate={a && !right && !reveal ? { x: [0, -6, 6, -3, 3, 0] } : {}}
            >
              <Illo name={illo} size={64} />
              <strong>{name}</strong>
              <div className="io-btns">
                {Object.entries(kinds).map(([k, label]) => (
                  <button key={k} type="button" aria-pressed={a === k} onClick={() => setAnswers((s) => ({ ...s, [name]: k }))}>
                    {label}
                  </button>
                ))}
              </div>
              {show && <span className="io-verdict">{reveal ? `Answer: ${kinds[kind]}` : right ? '✓ Correct' : `✗ It’s ${kinds[kind].toLowerCase()}`}</span>}
            </motion.div>
          )
        })}
      </div>
      <div className="io-footer" aria-live="polite">
        <p>
          Score: <strong>{score}</strong> / {challenge.length}
        </p>
        <button type="button" className="btn btn-white btn-sm" onClick={() => setReveal((r) => !r)}>
          {reveal ? 'Hide answers' : 'Show answers'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm on-red"
          onClick={() => {
            setAnswers({})
            setReveal(false)
          }}
        >
          Reset
        </button>
      </div>
      <AnimatePresence>
        {reveal && (
          <motion.p className="io-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            The touchscreen is the trick: you touch it to give input, and it shows output. A headset with a microphone is also both.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Together ---------- */

const flow = [
  ['Input', 'Keyboard', 'You type 5 and 3'],
  ['Memory', 'Ram', 'The numbers wait in RAM'],
  ['Processing', 'Cpu', 'The CPU adds them'],
  ['Output', 'Monitor', '8 appears on screen'],
]

export default function InputOutput() {
  return (
    <>
      <Section
        id="io"
        eyebrow="Talking to the outside world"
        title="Input devices"
        intro="An input device sends information or instructions to the computer by turning your actions into digital data."
        steps={5}
      >
        <div className="io-types">
          {inputTypes.map(([t, d, illo], i) => (
            <Step key={t} n={i + 1} className="io-type" delay={i * 0.06}>
              <span className="io-type-art">{illo === 'Keyboard' ? <img src={photos.keyboard} alt="" /> : <Illo name={illo} size={60} />}</span>
              <strong>{t}</strong>
              <span>{d}</span>
            </Step>
          ))}
        </div>
        <h3 className="sub">How does a key press reach the screen?</h3>
        <Reveal>
          <KeyJourney />
        </Reveal>
      </Section>

      <Section
        id="output"
        eyebrow="Talking to the outside world"
        title="Output devices"
        intro="Output devices turn the computer’s signals into something you can see, hear or hold. They work in the opposite direction to input."
        tone="alt"
        steps={7}
      >
        <div className="card-grid three">
          {outputTypes.map(([t, d, img, illo], i) => (
            <Step key={t} n={i + 1} className="card out-card" delay={i * 0.06}>
              <span className="out-art">{img ? <img src={img} alt="" /> : <Illo name={illo} size={84} />}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <ol className="out-steps">
          {outputSteps.map(([t, d], i) => (
            <Step as="li" key={t} n={i + 4} delay={i * 0.08}>
              <span className="journey-n">{i + 1}</span>
              <strong>{t}</strong>
              <span>{d}</span>
            </Step>
          ))}
        </ol>
        <Callout>Almost everything you build as a web developer appears on a screen, so the monitor is your main output device.</Callout>
      </Section>

      <Section
        id="io-challenge"
        eyebrow="Challenge"
        title="Input, output, or both?"
        intro="Decide for each device. One of them is a trick question."
        tone="red"
      >
        <IoChallenge />
        <PauseBadge>Pause the video and answer each one before you check</PauseBadge>
      </Section>

      <Section
        id="together"
        eyebrow="Putting it together"
        title="How all the parts work together"
        intro="Input goes into memory, the CPU processes it, and output shows the result: the IPOS cycle from Lecture 1, now with the real parts named."
        steps={4}
      >
        <div className="together-flow">
          {flow.map(([t, illo, d], i) => (
            <Step key={t} n={i + 1} className="together-node" delay={i * 0.1}>
              <span className="together-art">
                <Illo name={illo} size={72} />
              </span>
              <strong>{t}</strong>
              <span>{d}</span>
            </Step>
          ))}
        </div>
      </Section>
    </>
  )
}
