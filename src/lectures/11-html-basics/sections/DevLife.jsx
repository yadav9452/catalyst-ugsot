import { Code, Reveal, Section } from '../../../design-system'

/* ---------- Developer Life ---------- */

export default function DevLife() {
  return (
    <Section
      id="dev-life"
      eyebrow="Developer life"
      title="Beyond the Markup: What HTML Enables"
      intro="Real developers spend their days reading and writing HTML, whether in React components, static pages, or email templates. Here's what that looks like."
      tone="rose"
    >
      <div className="split">
        <div>
          <h3 className="sub">In a React component</h3>
          <p>You'll write HTML-like syntax (JSX) in just about every file:</p>

          <Code
            lines={[
              'function Card() {',
              '  return (',
              '    <div className="card">',
              '      <h2>Product Name</h2>',
              '      <img src="product.webp" alt="The product" />',
              '      <button>Add to cart</button>',
              '    </div>',
              '  )',
              '}',
            ]}
          />
        </div>

        <div>
          <h3 className="sub">For static sites</h3>
          <p>Every .html file is just raw HTML. No build step needed:</p>

          <Code
            lines={[
              '<!DOCTYPE html>',
              '<html lang="en">',
              '<head>',
              '  <title>Portfolio</title>',
              '</head>',
              '<body>',
              '  <h1>My Projects</h1>',
              '</body>',
              '</html>',
            ]}
          />
        </div>
      </div>

      <Reveal>
        <div>
          <h3 className="sub">Why you need this knowledge now</h3>
          <ul>
            <li>
              Debugging: When React renders something unexpected,{' '}
              <code>view page source</code> shows the actual HTML the browser sees.
            </li>
            <li>
              Email: Many newsletters use HTML tables (old-school, but reliable).
            </li>
            <li>
              Accessibility: Screen readers parse HTML tags to announce content to users.
            </li>
            <li>
              SEO: Search engines read your HTML structure to rank your site.
            </li>
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}