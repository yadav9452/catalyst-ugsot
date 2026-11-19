import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Code, CopyButton, Section, Step } from '../../../design-system'
import { Clock, Instructions, Laptop, Person } from '../../../design-system/illustrations'

const TARGET = 100_000_000
const demoCode = ['console.time("count");', 'for (let i = 1; i <= 100000000; i++) {}', 'console.timeEnd("count");']

const problems = [
  [Clock, 'It takes forever', 'At one number per second, non-stop, it’s over 3 years.'],
  [Instructions, 'You lose count', 'Somewhere around 473,812, you’ll slip and start again.'],
  [Person, 'It gets boring', 'Repeating the same step millions of times wears anyone out.'],
]

function countWithComputer() {
  const start = performance.now()
  let total = 0
  for (let i = 1; i <= TARGET; i++) total += 1
  return { ms: performance.now() - start, total }
}

export default function CountRace() {
  const [human, setHuman] = useState(0)
  const [running, setRunning] = useState(false)
  const [computer, setComputer] = useState(null) // null | 'working' | {ms,total}
  const timer = useRef(null)

  useEffect(() => () => clearInterval(timer.current), [])

  function start() {
    setHuman(0)
    setComputer('working')
    setRunning(true)
    clearInterval(timer.current)
    timer.current = setInterval(() => setHuman((h) => h + 1), 1000)
    // Give the browser a moment to paint "Counting…" before the loop blocks it.
    setTimeout(() => setComputer(countWithComputer()), 350)
  }

  function stop() {
    clearInterval(timer.current)
    setRunning(false)
  }

  const done = computer && computer !== 'working'
  const humanPct = Math.max((human / TARGET) * 100, 0.4)

  return (
    <Section
      id="challenge"
      eyebrow="A quick challenge"
      title="Count to 100,000,000. Ready?"
      intro="Counting to 10 takes a few seconds. Let’s race your brain against your computer on something bigger."
      tone="red"
      steps={6}
    >
      <Step n={1} className="race">
        <div className="race-lane">
          <div className="race-label">
            <span className="race-avatar">
              <Person size={44} />
            </span>
            <strong>You</strong>
            <span>one number per second</span>
          </div>
          <div className="race-track">
            <motion.div className="race-fill race-fill-human" animate={{ width: `${humanPct}%` }} />
          </div>
          <p className="race-value" aria-live="polite">
            {human.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="race-lane">
          <div className="race-label">
            <span className="race-avatar">
              <Laptop size={44} />
            </span>
            <strong>Computer</strong>
            <span>this browser, right now</span>
          </div>
          <div className="race-track">
            <motion.div
              className="race-fill race-fill-pc"
              initial={{ width: '0.4%' }}
              animate={{ width: done ? '100%' : computer === 'working' ? '35%' : '0.4%' }}
              transition={{ duration: done ? 0.4 : 1.5 }}
            />
          </div>
          <p className="race-value" aria-live="polite">
            {computer === 'working' && 'Counting…'}
            {done && `Done in ${Math.max(computer.ms, 1).toFixed(0)} ms`}
            {!computer && '0'}
          </p>
        </div>

        <div className="race-actions">
          {!running ? (
            <button type="button" className="btn btn-white" onClick={start}>
              ▶ Start the race
            </button>
          ) : (
            <button type="button" className="btn btn-white" onClick={stop}>
              ■ I give up
            </button>
          )}
        </div>

        {done && (
          <motion.div className="race-result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <span className="stat">{Math.max(computer.ms / 1000, 0.001).toFixed(2)} s</span>
              <span>the computer</span>
            </div>
            <div>
              <span className="stat">3 yrs 2 mo</span>
              <span>you, without sleep or breaks</span>
            </div>
          </motion.div>
        )}
      </Step>

      <div className="card-grid three">
        {problems.map(([Icon, t, d], i) => (
          <Step key={t} n={i + 2} className="card card-on-red problem" delay={i * 0.1}>
            <span className="problem-art">
              <Icon size={64} />
            </span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Step>
        ))}
      </div>
      <Step n={5} as="p" className="punchline">
        Slow, error-prone, repetitive work: exactly what computers are built for.
      </Step>

      <Step n={6} className="try-console">
        <div>
          <h3>Try it in your own browser</h3>
          <ol>
            <li>
              Open Chrome’s Console: <kbd>F12</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> on Windows, <kbd>Cmd</kbd> + <kbd>Option</kbd> +{' '}
              <kbd>J</kbd> on a Mac (or right-click › Inspect)
            </li>
            <li>
              Make sure the <strong>Console</strong> tab is open
            </li>
            <li>
              Paste the code (<kbd>Ctrl</kbd> + <kbd>V</kbd> on Windows, <kbd>Cmd</kbd> + <kbd>V</kbd> on a Mac) and press <kbd>Enter</kbd> (<kbd>Return</kbd>{' '}
              on a Mac)
            </li>
          </ol>
          <p className="small">
            If Chrome warns you about pasting, type <code>allow pasting</code> first.
          </p>
        </div>
        <div>
          <Code lines={demoCode} />
          <CopyButton text={demoCode.join('\n')} />
        </div>
      </Step>
    </Section>
  )
}
