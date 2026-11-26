import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Code, Section, Step } from '../../../design-system'

/* ---------- Browser DOM Parsing ---------- */

const parsingStages = [
  {
    stage: 'Tokenisation',
    description: 'The browser reads the raw text and identifies tags like <p> and </p>',
    example: '<p>Hello</p>',
    visual: '🔤',
  },
  {
    stage: 'Tree Construction',
    description: 'Tags are nested into a tree structure: p contains text "Hello"',
    example: '📦\n├── p\n   └── "Hello"',
    visual: '🌳',
  },
  {
    stage: 'DOM Building',
    description: 'The in-memory tree becomes the Document Object Model (DOM)',
    example: 'document.querySelector("p").textContent === "Hello"',
    visual: '✅',
  },
]

export default function DomParsing() {
  const [activeStage, setActiveStage] = useState(0)

  return (
    <Section
      id="dom-parsing"
      eyebrow="Browser & DOM"
      title="How Browsers Turn HTML into a Page"
      intro="When a browser downloads an HTML file, it doesn't immediately show it. First, it reads every line and builds something called the Document Object Model (DOM)."
      tone="light"
      steps={4}
    >
      <div className="split">
        <Step n={1}>
          <h3 className="sub">The Three Steps</h3>
          <div className="l11-stages">
            {parsingStages.map((s, k) => (
              <button
                key={s.stage}
                type="button"
                className={`l11-stage-btn ${activeStage === k ? 'is-active' : ''}`}
                aria-pressed={activeStage === k}
                onClick={() => setActiveStage(k)}
              >
                <span className="l11-stage-emoji" aria-hidden="true">
                  {s.visual}
                </span>
                <strong>{s.stage}</strong>
              </button>
            ))}
          </div>
        </Step>

        <Step n={2}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="l11-stage-card"
            >
              <p className="l11-stage-desc">{parsingStages[activeStage].description}</p>
              <AnimatePresence mode="wait">
                <Code
                  key={parsingStages[activeStage].example}
                  lines={[parsingStages[activeStage].example]}
                  compact
                />
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </Step>
      </div>

      <Step n={3}>
        <h3 className="sub">The DOM Tree</h3>
        <p>
          JavaScript can read and change this tree. For example:
        </p>
        <Code lines={['const p = document.querySelector("p")', 'p.textContent = "New text!"']} />
      </Step>

      <Step n={4}>
        <Callout>
          <p>
            <strong>Why this matters:</strong> When you write JavaScript in React or Vue, you're not manipulating HTML directly. But{' '}
            <em>underneath</em>, the browser converts your component output to a DOM tree, and that's how the page updates.
          </p>
        </Callout>
      </Step>
    </Section>
  )
}