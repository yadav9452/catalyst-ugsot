import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Code, Section, Step } from '../../../design-system'

/* ---------- Document Structure ---------- */

const docParts = [
  { id: 'doctype', name: '<!DOCTYPE html>', desc: 'Tells browser to use modern HTML5 mode', required: true },
  { id: 'html', name: '<html>', desc: 'The root element that wraps everything', required: true },
  { id: 'head', name: '<head>', desc: 'Hidden metadata: title, scripts, styles, charset', required: true },
  { id: 'title', name: '<title>', desc: 'Text shown in the tab (only inside body)', required: true },
  { id: 'body', name: '<body>', desc: 'Everything the user sees on the page', required: true },
]

const sampleDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a complete HTML file.</p>
</body>
</html>`

export default function DocumentStructure() {
  const [showCode, setShowCode] = useState(false)

  return (
    <Section
      id="doc-structure"
      eyebrow="Doc structure"
      title="Every HTML Document Has This Structure"
      intro="A well-formed HTML page has a specific order and structure. Let's explore what lives where."
      tone="light"
      steps={4}
    >
      <div className="split">
        <Step n={1}>
          <h3 className="sub">The Skeleton</h3>
          <ul className="l11-structure-list">
            {docParts.map((p) => (
              <li key={p.id} className="l11-struct-item">
                <code>&lt;{p.name}&gt;</code>
                {p.required && <span className="l11-required" aria-label="required">*</span>}
                <p className="l11-struct-desc">{p.desc}</p>
              </li>
            ))}
          </ul>
        </Step>

        <Step n={2}>
          <h3 className="sub">Meta in &lt;head&gt;</h3>
          <ul className="l11-head-list">
            <li>
              <code>&lt;meta charset="UTF-8"&gt;</code> - Text encoding
            </li>
            <li>
              <code>&lt;title&gt;</code> - Tab name
            </li>
            <li>
              <code>&lt;link rel="stylesheet"&gt;</code> - CSS file
            </li>
            <li>
              <code>&lt;script src="..."&gt;</code> - JavaScript (at end or in head)
            </li>
          </ul>
        </Step>
      </div>

      <Step n={3}>
        <button
          type="button"
          className="l11-code-btn btn btn-primary"
          onClick={() => setShowCode(!showCode)}
          aria-expanded={showCode}
        >
          {showCode ? 'Hide' : 'Show'} full example
        </button>
        <AnimatePresence>
          {showCode && (
            <motion.div
              key="sample-code"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Code lines={sampleDoc.split('\n')} />
            </motion.div>
          )}
        </AnimatePresence>
      </Step>

      <Step n={4}>
        <div className="l11-diagram">
          <motion.div className="l11-diagram-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="l11-dirow">
              <span className="l11-dicode">&lt;!DOCTYPE html&gt;</span>
              <span className="l11-dilabel">(required first line)</span>
            </div>
            <div className="l11-dirow">
              <span className="l11-dicode">&lt;html&gt;</span>
              <span className="l11-dilabel">everything else goes inside</span>
            </div>
            <div className="l11-dirow l11-dindent">
              <span className="l11-dicode">&lt;head&gt;</span>
              <span className="l11-dilabel">hidden stuff</span>
            </div>
            <div className="l11-dirow l11-dindent">
              <span className="l11-dicode">&lt;body&gt;</span>
              <span className="l11-dilabel">what viewers see</span>
            </div>
          </motion.div>
        </div>
      </Step>
    </Section>
  )
}