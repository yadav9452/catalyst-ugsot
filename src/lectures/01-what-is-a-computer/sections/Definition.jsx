import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Code, Reveal, Section, Step, useStep } from '../../../design-system'
import { CodeEditor, Gear, Instructions, Keyboard, Lightning, Monitor } from '../../../design-system/illustrations'
import { photos } from '../images'

const monitorImg = photos.monitor

const keywords = [
  ['Electronic', 'Runs on electricity, using billions of tiny switches'],
  ['Input', 'The data or commands that go in'],
  ['Instructions', 'Step-by-step rules to follow: a program'],
  ['Output', 'The result that comes out'],
]

// Each part of the sentence lights up at the step that explains it.
const words = [
  { t: 'A computer is an ' },
  { t: 'electronic', k: 1 },
  { t: ' machine that takes ' },
  { t: 'input', k: 2 },
  { t: ', processes it according to ' },
  { t: 'instructions', k: 3 },
  { t: ', and produces ' },
  { t: 'output', k: 4 },
  { t: '.' },
]

/** The "computer machine": builds up piece by piece as each keyword is explained. */
function Machine() {
  const { shown } = useStep()
  const on = (n) => ({ opacity: shown(n) ? 1 : 0.12, scale: shown(n) ? 1 : 0.92 })
  const t = { duration: 0.5 }
  return (
    <div className="machine" aria-label="Diagram: input goes into the computer, which follows instructions and produces output" role="img">
      <motion.div className="machine-part" animate={on(2)} transition={t}>
        <Keyboard size={164} />
        <span>Input</span>
      </motion.div>
      <motion.div className="machine-flow" animate={on(2)} transition={t} aria-hidden="true">
        <span className="flow-dot" />
      </motion.div>
      <motion.div className="machine-box" animate={on(1)} transition={t}>
        <span className="machine-power" aria-hidden="true">
          <Lightning size={58} />
        </span>
        <div className={shown(3) ? 'spin' : ''}>
          <Gear size={150} />
        </div>
        <motion.div className="machine-sheet" animate={{ opacity: shown(3) ? 1 : 0, y: shown(3) ? 0 : -30 }} transition={t}>
          <Instructions size={100} />
        </motion.div>
        <span>Computer</span>
      </motion.div>
      <motion.div className="machine-flow" animate={on(4)} transition={t} aria-hidden="true">
        <span className="flow-dot" />
      </motion.div>
      <motion.div className="machine-part" animate={on(4)} transition={t}>
        <Monitor size={164} />
        <span>Output</span>
      </motion.div>
    </div>
  )
}

function DefinitionSentence() {
  const { shown, guided } = useStep()
  return (
    <motion.p
      className="definition"
      initial={guided ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className={w.k && shown(w.k) ? 'kw' : ''}
          variants={guided ? undefined : { hidden: { opacity: 0.15 }, show: { opacity: 1 } }}
        >
          {w.t}
        </motion.span>
      ))}
    </motion.p>
  )
}

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
      <Section
        id="definition"
        eyebrow="Definition"
        title="So, what exactly is a computer?"
        intro="Pause and try to define it in one sentence. Then compare with this one:"
        steps={4}
      >
        <DefinitionSentence />
        <Reveal>
          <Machine />
        </Reveal>
        <div className="card-grid four">
          {keywords.map(([t, d], i) => (
            <Step key={t} n={i + 1} className="card keyword" delay={i * 0.08}>
              <span className="keyword-n">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
      </Section>

      <Section id="instructions" eyebrow="This is where you come in" title="The instructions are the part you’ll write." tone="rose">
        <div className="split">
          <Reveal className="split-text">
            <div className="you-write">
              <Instructions size={124} />
              <span aria-hidden="true">→</span>
              <CodeEditor size={124} />
            </div>
            <p className="lead">
              A set of instructions is a <strong>program</strong>. Writing programs is <strong>programming</strong>, and that’s what
              this course is about.
            </p>
            <p>
              Press <em>Run</em> and watch the computer follow each instruction in order: store the price, store the quantity,
              multiply, show the result. Input, processing and output in three lines.
            </p>
            <button type="button" className="btn btn-primary" onClick={run}>
              ▶ Run the program
            </button>
          </Reveal>
          <Reveal delay={0.1}>
            <Code lines={program} active={line} />
            <div className="monitor-out">
              <img src={monitorImg} alt="" />
              <div className="monitor-screen" aria-live="polite">
                <span className="monitor-prompt">Output ›</span>
                <AnimatePresence mode="wait">
                  {output !== null ? (
                    <motion.span key="out" className="monitor-value" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                      {output}
                    </motion.span>
                  ) : (
                    <motion.span key="wait" className="monitor-wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Press Run to see the result on screen
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
