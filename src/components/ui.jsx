import { motion } from 'framer-motion'

/** Fades and slides its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** A full-width lecture section with a consistent heading block. */
export function Section({ id, eyebrow, title, intro, tone = 'light', children }) {
  return (
    <section id={id} className={`section tone-${tone}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <Reveal className="section-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-title`}>{title}</h2>
          {intro && <p className="intro">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

/** "As a developer" style callout. */
export function Callout({ label = 'As a developer', children }) {
  return (
    <Reveal className="callout" delay={0.1}>
      <span className="callout-label">{label}</span>
      <p>{children}</p>
    </Reveal>
  )
}

/** A dark code block. `lines` is an array of strings; `active` highlights one line. */
export function Code({ lines, active = -1, caption }) {
  return (
    <figure className="code">
      <pre>
        {lines.map((line, i) => (
          <motion.span
            key={i}
            className={`code-line ${i === active ? 'is-active' : ''} ${line.trim().startsWith('//') ? 'is-comment' : ''}`}
            animate={{ backgroundColor: i === active ? 'rgba(224,12,22,0.35)' : 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.25 }}
          >
            {line || ' '}
          </motion.span>
        ))}
      </pre>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function CopyButton({ text }) {
  async function copy(e) {
    const btn = e.currentTarget
    try {
      await navigator.clipboard.writeText(text)
      btn.textContent = 'Copied!'
    } catch {
      btn.textContent = 'Select and copy'
    }
    setTimeout(() => (btn.textContent = 'Copy code'), 1600)
  }
  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
      Copy code
    </button>
  )
}

export function PauseBadge({ children = 'Pause the video and try it now' }) {
  return <p className="pause-badge">⏸ {children}</p>
}
