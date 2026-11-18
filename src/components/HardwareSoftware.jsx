import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PauseBadge, Reveal, Section } from './ui'

const items = [
  ['Keyboard', 'hw'], ['Chrome', 'sw'], ['CPU', 'hw'], ['VS Code', 'sw'], ['Windows', 'sw'],
  ['Monitor', 'hw'], ['RAM', 'hw'], ['WhatsApp', 'sw'], ['Mouse', 'hw'], ['Your JavaScript code', 'sw'],
]

function SortGame() {
  const [answers, setAnswers] = useState({})
  const score = items.filter(([n, k]) => answers[n] === k).length
  const done = Object.keys(answers).length === items.length

  return (
    <div className="sort">
      <p className="sort-help">Is it <strong>hardware</strong> (you can touch it) or <strong>software</strong> (instructions)? Choose for each one.</p>
      <ul className="sort-list">
        {items.map(([name, kind], i) => {
          const a = answers[name]
          const state = a ? (a === kind ? 'is-right' : 'is-wrong') : ''
          return (
            <motion.li
              key={name}
              className={`sort-item ${state}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              animate={state === 'is-wrong' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            >
              <span className="sort-name">{name}</span>
              <span className="sort-btns">
                <button type="button" aria-pressed={a === 'hw'} onClick={() => setAnswers((s) => ({ ...s, [name]: 'hw' }))}>Hardware</button>
                <button type="button" aria-pressed={a === 'sw'} onClick={() => setAnswers((s) => ({ ...s, [name]: 'sw' }))}>Software</button>
              </span>
              {a && <span className="sort-verdict">{a === kind ? '✓ Correct' : `✗ It’s ${kind === 'hw' ? 'hardware' : 'software'}`}</span>}
            </motion.li>
          )
        })}
      </ul>
      <div className="sort-footer" aria-live="polite">
        <p>
          Score: <strong>{score}</strong> / {items.length}
          {done && (score === items.length ? ' · Perfect!' : ' · Check the red ones and try again.')}
        </p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnswers({})}>Reset</button>
      </div>
    </div>
  )
}

const rows = [
  ['What it is', 'The physical parts', 'Instructions (programs)'],
  ['Can you touch it?', 'Yes', 'No'],
  ['Examples', 'Keyboard, monitor, CPU, RAM', 'Windows, Chrome, VS Code'],
  ['If it breaks…', 'Repair or replace the part', 'Update, reinstall or fix the code'],
  ['Who makes it', 'Engineers and manufacturers', 'Developers, like you'],
]

const layers = [
  ['Your code', 'The websites and apps you’ll build in this course', 'l1'],
  ['Applications', 'Chrome, VS Code, Spotify, WhatsApp', 'l2'],
  ['Operating system', 'Windows, macOS, Android, Linux: manages the hardware for every app', 'l3'],
  ['Hardware', 'CPU, RAM, storage, screen, keyboard', 'l4'],
]

function Layers() {
  return (
    <div className="layers">
      {layers.map(([t, d, c], i) => (
        <motion.div
          key={t}
          className={`layer ${c}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: (layers.length - 1 - i) * 0.15, type: 'spring', stiffness: 160, damping: 20 }}
        >
          <strong>{t}</strong>
          <span>{d}</span>
        </motion.div>
      ))}
      <p className="note">Each layer relies on the one below it. Your code reaches the hardware through the browser and the operating system.</p>
    </div>
  )
}

const playSteps = [
  ['01 · Input', 'You tap Play', 'The touchscreen senses your finger'],
  ['02 · Software', 'The app’s code runs', 'It decides: load this song and start playback'],
  ['03 · Hardware', 'CPU and RAM work', 'The song is read from storage and decoded'],
  ['04 · Output', 'Music plays', 'Speakers turn the signal into sound'],
]

function PlayFlow() {
  const [step, setStep] = useState(-1)
  useEffect(() => {
    if (step < 0 || step >= playSteps.length) return
    const t = setTimeout(() => setStep((s) => s + 1), 1100)
    return () => clearTimeout(t)
  }, [step])
  const playing = step >= playSteps.length

  return (
    <div className="playflow">
      <button type="button" className="play-btn" onClick={() => setStep(0)} aria-label="Press Play">
        ▶
      </button>
      <ol className="play-steps">
        {playSteps.map(([k, t, d], i) => (
          <motion.li key={k} animate={{ opacity: step >= i ? 1 : 0.35, y: step === i ? -6 : 0 }} className={step >= i ? 'is-on' : ''}>
            <span className="play-k">{k}</span>
            <strong>{t}</strong>
            <span>{d}</span>
          </motion.li>
        ))}
      </ol>
      <div className="eq" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            animate={playing ? { height: ['20%', `${30 + ((i * 37) % 70)}%`, '25%'] } : { height: '12%' }}
            transition={playing ? { repeat: Infinity, duration: 0.6 + (i % 5) * 0.12, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}
      </div>
      <AnimatePresence>
        {playing && (
          <motion.p className="punchline dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <mark>Software</mark> gives the instructions. <mark>Hardware</mark> carries them out.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HardwareSoftware() {
  return (
    <>
      <Section id="hwsw" eyebrow="What a computer is made of" title="Hardware vs software" intro="Every computer is made of two things, and neither is useful without the other.">
        <Reveal className="table-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Question</span></th>
                <th scope="col">Hardware</th>
                <th scope="col">Software</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([q, h, s]) => (
                <tr key={q}>
                  <th scope="row">{q}</th>
                  <td>{h}</td>
                  <td>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <Reveal>
          <h3 className="sub">Quick game: sort them</h3>
          <SortGame />
        </Reveal>
      </Section>

      <Section id="layers" eyebrow="How software is organised" title="Software comes in layers" tone="alt">
        <Layers />
      </Section>

      <Section id="together" eyebrow="Hardware + software" title="Working together: you press Play" intro="Tap the play button and follow what happens inside the phone.">
        <Reveal>
          <PlayFlow />
        </Reveal>
      </Section>

      <Section id="try-taskmgr" eyebrow="Try it · 2 minutes" title="See hardware and software at work" tone="red">
        <div className="card-grid two">
          <Reveal className="card card-on-red">
            <h3>Windows</h3>
            <p>Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Esc</kbd> to open Task Manager, then the <strong>Performance</strong> tab.</p>
          </Reveal>
          <Reveal className="card card-on-red" delay={0.1}>
            <h3>macOS</h3>
            <p>Press <kbd>Cmd</kbd> + <kbd>Space</kbd>, type <strong>Activity Monitor</strong>, then check the CPU and Memory tabs.</p>
          </Reveal>
        </div>
        <Reveal className="notice-list">
          <h3>What to notice</h3>
          <ul>
            <li>Every open app uses some CPU and RAM</li>
            <li>Open 10 browser tabs and watch Memory rise</li>
            <li>Close them and watch it fall again</li>
          </ul>
        </Reveal>
        <PauseBadge />
      </Section>
    </>
  )
}
