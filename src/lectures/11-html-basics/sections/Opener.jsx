import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section } from '../../../design-system'

const views = [
  {
    id: 'rendered',
    label: '👁️ What You See (Browser)',
    content: (
      <div className="l11-preview-box">
        <h1 className="l11-preview-title">Welcome to Catalyst</h1>
        <p className="l11-preview-text">
          Learn full stack web development with <strong>hands-on</strong> interactive lessons.
        </p>
        <button type="button" className="l11-preview-btn">
          Get Started
        </button>
      </div>
    ),
  },
  {
    id: 'html',
    label: '📄 What Browser Reads (HTML Code)',
    content: (
      <pre className="l11-code-block">
        <code>
          {`<h1>Welcome to Catalyst</h1>
<p>
  Learn full stack web development with
  <strong>hands-on</strong> interactive lessons.
</p>
<button>Get Started</button>`}
        </code>
      </pre>
    ),
  },
]

export default function Opener() {
  const [active, setActive] = useState('rendered')

  return (
    <Section
      id="opener"
      eyebrow="Opener · Behind the magic"
      title="How Web Pages Are Actually Made"
      intro="When you visit any website on your phone or computer, you see buttons, text, and headings. But under the hood, the browser is just reading plain text with tags."
      tone="alt"
    >
      <Reveal>
        <div className="l11-opener-card">
          <div className="l11-tab-bar" role="tablist" aria-label="Toggle code vs rendered view">
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={active === v.id}
                className={`l11-tab-btn ${active === v.id ? 'is-active' : ''}`}
                onClick={() => setActive(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="l11-opener-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {views.find((v) => v.id === active)?.content}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="l11-opener-hint">
            💡 Switch back and forth: Notice how <code>&lt;h1&gt;</code> becomes a big title, <code>&lt;p&gt;</code> becomes paragraph text, and <code>&lt;button&gt;</code> creates a clickable button!
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
