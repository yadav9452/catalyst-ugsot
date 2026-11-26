import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Code, Reveal, Section, Step } from '../../../design-system'

/* ---------- Tag Anatomy ---------- */

const parts = [
  { name: 'Opening tag', example: '<img>' },
  { name: 'Tag name', example: 'img' },
  { name: 'Attributes', example: 'alt="..." src="..."' },
  { name: 'Content', example: 'Hello world' },
  { name: 'Closing tag', example: '</p>' },
]

const elementExamples = [
  { tag: 'img', description: 'Shows an image (void tag - no closing tag needed)', html: '<img src="cat.webp" alt="A tabby cat">' },
  { tag: 'p', description: 'A paragraph of text', html: '<p>This is a paragraph.</p>' },
  { tag: 'div', description: 'A generic container', html: '<div>Some content</div>' },
  { tag: 'a', description: 'A clickable link', html: '<a href="https://example.com">Visit Example</a>' },
]

export default function TagAnatomy() {
  const [activeTag, setActiveTag] = useState('img')

  return (
    <Section
      id="anatomy"
      eyebrow="Tag Anatomy"
      title="Every Element Has a Structure"
      intro="An HTML element is built from pieces that work together. Let's break down how tags, attributes, content and closing tags fit together."
      tone="light"
      steps={4}
    >
      <Step n={1}>
        <h3 className="sub">Element Anatomy</h3>
        <ul className="l11-parts-list">
          {parts.map((p) => (
            <li key={p.name} className="l11-part-item">
              <strong>{p.name}:</strong>{' '}
              <Code lines={[p.example]} compact />
            </li>
          ))}
        </ul>

        <p className="lead">
          <strong>Void elements</strong> (like <code>img</code>, <code>input</code>, <code>br</code>) have no closing tag. They're{' '}
          <em>"filled" by their attributes</em>.
        </p>
      </Step>

      <Step n={2}>
        <h3 className="sub">Try it: What's a void tag?</h3>
        <p>Which of these can you click to toggle between?</p>
        <div className="l11-toggle">
          {[
            { label: 'div', html: '<div>Hello</div>' },
            { label: 'img', html: '<img source="pic.webp">' },
            { label: 'br', html: '<br>' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className={`l11-toggle-btn ${activeTag === item.label ? 'is-active' : ''}`}
              aria-pressed={activeTag === item.label}
              onClick={() => setActiveTag(item.label)}
            >
              <code>&lt;{item.label}&gt;</code>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.code
            key={activeTag}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="l11-toggle-html"
          >
            {elementExamples.find((e) => e.tag === activeTag)?.html}
          </motion.code>
        </AnimatePresence>
      </Step>

      <Step n={3}>
        <h3 className="sub">More examples</h3>
        <div className="card-grid two">
          {elementExamples.map((ex) => (
            <Reveal key={ex.tag} className="card">
              <code className="l11-card-code">&lt;{ex.tag}&gt;</code>
              <p className="l11-card-desc">{ex.description}</p>
              <Code lines={[ex.html]} compact />
            </Reveal>
          ))}
        </div>
      </Step>

      <Step n={4}>
        <Callout>
          <p>
            <strong>Remember:</strong> Block elements (<code>div</code>, <code>p</code>, <code>h1</code>) start on new lines and take full width.
            Inline elements (<code>span</code>, <code>a</code>, <code>strong</code>) stay within text flow.
          </p>
        </Callout>
      </Step>
    </Section>
  )
}