import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Code, Section, Step } from '../../../design-system'

/* ---------- Block vs Inline ---------- */

const demoExamples = [
  { tag: 'div', type: 'block', html: '&lt;div&gt;First paragraph&lt;/div&gt;\n&lt;div&gt;Second paragraph&lt;/div&gt;', desc: 'Each starts on a new line' },
  { tag: 'span', type: 'inline', html: '&lt;p&gt;This is a <strong>spelled</strong> word&lt;/p&gt;', desc: 'Stays inside the paragraph' },
  { tag: 'p', type: 'block', html: '&lt;p&gt;First para&lt;/p&gt;\n&lt;ul&gt;\n  &lt;li&gt;Item 1&lt;/li&gt;\n&lt;/ul&gt;', desc: 'Takes full width, starts new line' },
  { tag: 'a', type: 'inline', html: '&lt;p&gt;Visit <a href="#">our site</a> today&lt;/p&gt;', desc: 'Wraps text inside paragraph' },
]

const commonBlocks = ['div', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside', 'figure', 'blockquote', 'pre', 'hr', 'br']

const commonInline = ['a', 'span', 'strong', 'em', 'b', 'i', 'code', 'img', 'input', 'label', 'select', 'textarea', 'button', 'abbr', 'cite', 'time']

export default function BlockInline() {
  const [activeTag, setActiveTag] = useState('div')

  return (
    <Section
      id="block-inline"
      eyebrow="Block vs Inline"
      title="Elements Layout Differently by Default"
      intro="Not all HTML elements behave the same way on the page. Some start on new lines; some stay inline with text. Understanding this is key to layout."
      tone="light"
      steps={4}
    >
      <div className="split">
        <Step n={1}>
          <h3 className="sub">Two Default Behaviors</h3>

          <div className="l11-behaviors">
            <div className="l11-behavior">
              <h4 className="l11-behavior-title">🔲 Block Elements</h4>
              <ul className="l11-behavior-list">
                {commonBlocks.map((tag) => (
                  <li key={tag}>
                    <code>&lt;{tag}&gt;</code>
                  </li>
                ))}
              </ul>
              <p className="l11-behavior-desc">Start on a new line, take full width, stack vertically</p>
            </div>

            <div className="l11-behavior">
              <h4 className="l11-behavior-title">🔗 Inline Elements</h4>
              <ul className="l11-behavior-list">
                {commonInline.map((tag) => (
                  <li key={tag}>
                    <code>&lt;{tag}&gt;</code>
                  </li>
                ))}
              </ul>
              <p className="l11-behavior-desc">Stay in text flow, only take needed width</p>
            </div>
          </div>
        </Step>

        <Step n={2}>
          <h3 className="sub">Try it: Toggle an element</h3>
          <p>Click to switch between block and inline behavior:</p>

          <div className="l11-demo">
            {[
              { tag: 'div', type: 'block' },
              { tag: 'span', type: 'inline' },
              { tag: 'p', type: 'block' },
              { tag: 'a', type: 'inline' },
            ].map((item) => (
              <button
                key={item.tag}
                type="button"
                className={`l11-demo-btn ${activeTag === item.tag ? 'is-active' : ''}`}
                aria-pressed={activeTag === item.tag}
                onClick={() => setActiveTag(item.tag)}
              >
                <code>&lt;{item.tag}&gt;</code> ({item.type})
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {demoExamples.find((d) => d.tag === activeTag) && (
              <motion.div
                key={activeTag}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="l11-demo-output"
              >
                <Code lines={[demoExamples.find((d) => d.tag === activeTag).desc]} />
              </motion.div>
            )}
          </AnimatePresence>
        </Step>
      </div>

      <Step n={3}>
        <h3 className="sub">Visual comparison</h3>
        <div className="l11-comparison">
          <div className="l11-comp-block">
            <h4>Block element</h4>
            <Code lines={['<h1>Title</h1>', '<p>Paragraph 1</p>', '<p>Paragraph 2</p>']} />
          </div>
          <div className="l11-comp-inline">
            <h4>Inline elements</h4>
            <Code lines={['<p>Word <strong>bold</strong> and <em>italic</em> here</p>']} />
          </div>
        </div>
      </Step>

      <Step n={4}>
        <Callout>
          <p>
            <strong>Developer tip:</strong> CSS changes these defaults using{' '}
            <code>display: block</code> or <code>display: inline-block</code> or <code>display: flex</code>. But HTML determines what you start with.
          </p>
        </Callout>
      </Step>
    </Section>
  )
}