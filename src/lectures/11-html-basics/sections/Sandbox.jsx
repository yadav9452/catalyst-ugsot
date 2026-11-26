import { useState } from 'react'
import { Code, Section, Step } from '../../../design-system'

/* ---------- HTML Sandbox ---------- */

const sandboxHtml = `<h1>Welcome to Catalyst</h1>
<p>
  Learn full stack web development with <strong>hands-on</strong> interactive lessons.
</p>
<button>Get Started</button>`

const sandboxJsx = `
<>
  <h1>Welcome to Catalyst</h1>
  <p>
    Learn full stack web development with <strong>hands-on</strong> interactive lessons.
  </p>
  <button>Get Started</button>
</>
`

export default function Sandbox() {
  const [html, setHtml] = useState(sandboxHtml.trim())

  return (
    <Section
      id="sandbox"
      eyebrow="HTML Lab"
      title="Try Editing HTML Live"
      intro="Copy and paste this HTML into an online validator to see what browsers create from it."
      tone="alt"
    >
      <div className="split">
        <Step n={1}>
          <h3 className="sub">Edit this HTML</h3>
          <p>Click an option to change the code:</p>

          <div className="l11-sandbox-options">
            {[
              { label: 'Original', code: sandboxHtml.trim() },
              {
                label: 'Add an image',
                code: `<h1>Welcome to Catalyst</h1>
<p>
  Learn full stack web development with <strong>hands-on</strong> interactive lessons.
</p>
<img src="logo.webp" alt="Catalyst logo" />
<button>Get Started</button>`,
              },
              {
                label: 'Add a link',
                code: `<h1>Welcome to Catalyst</h1>
<p>
  Learn full stack web development with <strong>hands-on</strong> interactive lessons.
</p>
<a href="https://catalyst.com">Visit Catalyst</a>
<button>Get Started</button>`,
              },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                className="l11-option-btn btn btn-secondary"
                onClick={() => setHtml(opt.code)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Step>

        <Step n={2}>
          <h3 className="sub">Live rendered output</h3>
          <div
            className="l11-live-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Step>
      </div>

      <Step n={3}>
        <h3 className="sub">Your turn</h3>
        <p>
          Change the <code>&lt;h1&gt;</code> text to your own heading, and add a
          <code>&lt;p&gt;</code> about why you're excited to learn!
        </p>
        <Code lines={[sandboxJsx]} />
      </Step>
    </Section>
  )
}