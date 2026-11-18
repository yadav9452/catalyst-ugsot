import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Code, Reveal, Section } from './ui'

const words = [
  { t: 'A computer is an ' },
  { t: 'electronic', k: true },
  { t: ' machine that takes ' },
  { t: 'input', k: true },
  { t: ', processes it according to ' },
  { t: 'instructions', k: true },
  { t: ', and produces ' },
  { t: 'output', k: true },
  { t: '.' },
]

const keywords = [
  ['Electronic', 'Runs on electricity, using billions of tiny switches'],
  ['Input', 'The data or commands that go in'],
  ['Instructions', 'Step-by-step rules to follow: a program'],
  ['Output', 'The result that comes out'],
]

const program = ['// Instructions for the computer', 'let price = 499;', 'let qty = 3;', 'console.log(price * qty);']

export default function Definition() {
  const [line, setLine] = useState(-1)
  const [output, setOutput] = useState(null)

  function run() {
    setOutput(null)
    ;[1, 2, 3].forEach((l, i) => setTimeout(() => setLine(l), i * 700))
    setTimeout(() => {
      setOutput(499 * 3)
      setLine(-1)
    }, 2100)
  }

  return (
    <>
      <Section id="definition" eyebrow="Definition" title="So, what exactly is a computer?" intro="Pause and try to define it in one sentence. Then compare with this one:">
        <motion.p
          className="definition"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              className={w.k ? 'kw' : ''}
              variants={{ hidden: { opacity: 0.15 }, show: { opacity: 1 } }}
            >
              {w.t}
            </motion.span>
          ))}
        </motion.p>
        <div className="card-grid four">
          {keywords.map(([t, d], i) => (
            <Reveal key={t} className="card" delay={i * 0.08}>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="instructions"
        eyebrow="This is where you come in"
        title="The instructions are the part you’ll write."
        tone="rose"
      >
        <div className="split">
          <Reveal className="split-text">
            <p className="lead">
              A set of instructions is a <strong>program</strong>. Writing programs is <strong>programming</strong>,
              and that’s what this course is about.
            </p>
            <p>
              Press <em>Run</em> and watch the computer follow each instruction in order: store the price, store the
              quantity, multiply, show the result. Input, processing and output in three lines.
            </p>
            <button type="button" className="btn btn-primary" onClick={run}>
              ▶ Run the program
            </button>
          </Reveal>
          <Reveal delay={0.1}>
            <Code lines={program} active={line} />
            <div className="console-out" aria-live="polite">
              <span className="console-prompt">Output ›</span>
              <AnimatePresence mode="wait">
                {output !== null && (
                  <motion.span key="out" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                    {output}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
