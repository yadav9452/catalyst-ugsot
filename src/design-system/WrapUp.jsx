import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Section, Step } from './primitives'

/** why: [[icon, text], ...] */
export function WhyItMatters({ items, title = 'What this means for you as a developer' }) {
  return (
    <Section id="wrap-up" eyebrow="Why this matters" title={title} steps={items.length}>
      <div className="card-grid two">
        {items.map(([icon, t], i) => (
          <Step key={t} n={i + 1} className="card why" delay={i * 0.08}>
            <span className="why-icon" aria-hidden="true">{icon}</span>
            <p>{t}</p>
          </Step>
        ))}
      </div>
    </Section>
  )
}

/** items: ['takeaway', ...] */
export function Recap({ items }) {
  return (
    <Section id="recap" eyebrow="Recap" title={`${items.length} things to remember`} tone="alt" steps={items.length}>
      <ol className="recap">
        {items.map((r, i) => (
          <Step as="li" key={r} n={i + 1} delay={i * 0.08}>
            <span className="recap-n">{i + 1}</span>
            {r}
          </Step>
        ))}
      </ol>
    </Section>
  )
}

/** questions: [{ q, options: [...], a: indexOfCorrect, why }] */
export function Quiz({ questions }) {
  const [answers, setAnswers] = useState({})
  const score = questions.filter((q, i) => answers[i] === q.a).length
  const done = Object.keys(answers).length === questions.length

  return (
    <Section id="quiz" eyebrow="Self-check" title="Pause the video and answer these" intro="Pick an answer for each question. You’ll see the explanation straight away." tone="rose">
      <div className="quiz">
        {questions.map((item, i) => {
          const picked = answers[i]
          return (
            <fieldset key={item.q} className="quiz-q">
              <legend>
                <span className="quiz-n">{i + 1}</span> {item.q}
              </legend>
              <div className="quiz-options">
                {item.options.map((o, j) => {
                  const state = picked === undefined ? '' : j === item.a ? 'is-right' : picked === j ? 'is-wrong' : 'is-dim'
                  return (
                    <button key={o} type="button" className={`quiz-opt ${state}`} disabled={picked !== undefined} onClick={() => setAnswers((s) => ({ ...s, [i]: j }))}>
                      {o}
                    </button>
                  )
                })}
              </div>
              <AnimatePresence>
                {picked !== undefined && (
                  <motion.p className={`quiz-why ${picked === item.a ? 'ok' : 'no'}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    {picked === item.a ? '✓ Correct. ' : '✗ Not quite. '}
                    {item.why}
                  </motion.p>
                )}
              </AnimatePresence>
            </fieldset>
          )
        })}
        <div className="quiz-score" aria-live="polite">
          {done ? (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              You scored <strong>{score} / {questions.length}</strong>.{' '}
              {score >= Math.ceil(questions.length * 0.8) ? 'Great work. You’re ready for the next lecture.' : 'Rewatch the parts you missed before the next lecture.'}
            </motion.p>
          ) : (
            <p>
              {Object.keys(answers).length} of {questions.length} answered
            </p>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnswers({})}>
            Try again
          </button>
        </div>
      </div>
    </Section>
  )
}
