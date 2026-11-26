import { Callout, Code, Figure, Section, Step } from '../../../design-system'
import { Laptop } from '../../../design-system/illustrations'

/* ---------- What is HTML? ---------- */

export default function WhatIsHtml() {
  return (
    <Section
      id="what-is-html"
      eyebrow="What is HTML?"
      title="HTML is Text That Describes Structure"
      intro="HTML (HyperText Markup Language) is not a programming language. It's a special format for describing the structure of a webpage."
      tone="light"
      steps={4}
    >
      <div className="split">
        <Step n={1}>
          <p className="lead">
            HTML ={' '}
            <strong>
              HyperText Markup Language
            </strong>
          </p>
          <p>
            <strong>HyperText</strong>: text that can link to other text (links, URLs)
          </p>
          <p>
            <strong>Markup Language</strong>: text with tags that mark up content
          </p>
        </Step>

        <Step n={2}>
          <Code lines={['<h1>This is a title</h1>', '<p>This is a paragraph.</p>', '<a href="">A link</a>']} />
          <Figure caption="These tags describe what the content is, not how it looks">
            <Laptop size={100} />
          </Figure>
        </Step>
      </div>

      <Step n={3}>
        <p>
          Think of HTML as the{' '}
          <strong>bones</strong> of a webpage: they hold the content in place{' '}
          <strong>without deciding how it looks</strong>. CSS dresses the bones in styles, and JavaScript adds motion.
        </p>
      </Step>

      <Step n={4}>
        <Callout>
          <p>
            <strong>Real developer work:</strong> Every React component you write, every static site, every web app starts with HTML underneath. When you{' '}
            <code>npm create vite@latest</code>, it generates an <code>index.html</code> first.
          </p>
        </Callout>
      </Step>
    </Section>
  )
}