import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section } from './ui'

const why = [
  ['</>', 'The code you write is software: instructions the hardware carries out'],
  ['⇄', 'Every program you build takes input, processes it and gives output'],
  ['☁', 'Your websites will live on servers; browsers are the clients'],
  ['⚡', 'Knowing CPU, RAM and storage helps you write faster code'],
]

const recap = [
  'A computer takes input, processes it and produces output.',
  'RAM holds current work; storage keeps files permanently.',
  'Hardware is the physical parts; software is the instructions.',
  'Desktops, laptops, phones and embedded devices are all computers.',
  'Servers send websites and data to clients over a network.',
]

const quiz = [
  {
    q: 'When you send a chat message, what is the output?',
    options: ['Typing on the keyboard', 'The message appearing on screen', 'The CPU', 'Your chat history'],
    a: 1,
    why: 'Typing is the input. The message showing on your screen (and your friend’s) is the output.',
  },
  {
    q: 'Is a web browser hardware or software?',
    options: ['Hardware', 'Software', 'Both', 'Neither'],
    a: 1,
    why: 'A browser is a set of instructions. You can’t touch it, so it’s software.',
  },
  {
    q: 'You were typing and the power went off. Which work is lost?',
    options: ['Anything saved to storage', 'Unsaved work that was only in RAM', 'Everything on the computer', 'Nothing is ever lost'],
    a: 1,
    why: 'RAM is cleared at power-off. Files saved to storage (SSD/HDD) survive.',
  },
  {
    q: 'Which of these is an embedded computer?',
    options: ['A gaming desktop', 'A laptop', 'A washing machine’s controller', 'A data-center server'],
    a: 2,
    why: 'An embedded computer is built into another device to do one job, like running a wash cycle.',
  },
  {
    q: 'When you open a website, which computer sends you the page?',
    options: ['The client', 'The server', 'Your keyboard', 'The operating system'],
    a: 1,
    why: 'Your browser (the client) asks; the server responds with the files.',
  },
]

function Quiz() {
  const [answers, setAnswers] = useState({})
  const score = quiz.filter((q, i) => answers[i] === q.a).length
  const done = Object.keys(answers).length === quiz.length

  return (
    <div className="quiz">
      {quiz.map((item, i) => {
        const picked = answers[i]
        return (
          <fieldset key={i} className="quiz-q">
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
            You scored <strong>{score} / {quiz.length}</strong>.{' '}
            {score >= 4 ? 'Great work. You’re ready for Lecture 2.' : 'Rewatch the parts you missed before Lecture 2.'}
          </motion.p>
        ) : (
          <p>{Object.keys(answers).length} of {quiz.length} answered</p>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnswers({})}>Try again</button>
      </div>
    </div>
  )
}

export default function WrapUp() {
  return (
    <>
      <Section id="whydev" eyebrow="Why this matters" title="What this means for you as a developer">
        <div className="card-grid two">
          {why.map(([icon, t], i) => (
            <Reveal key={t} className="card why" delay={i * 0.08}>
              <span className="why-icon" aria-hidden="true">{icon}</span>
              <p>{t}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="recap" eyebrow="Recap" title="Five things to remember" tone="alt">
        <ol className="recap">
          {recap.map((r, i) => (
            <Reveal as="li" key={r} delay={i * 0.08}>
              <span className="recap-n">{i + 1}</span>
              {r}
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section id="quiz" eyebrow="Self-check" title="Pause the video and answer these" intro="Pick an answer for each question. You’ll see the explanation straight away." tone="rose">
        <Quiz />
      </Section>
    </>
  )
}
