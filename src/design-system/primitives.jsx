import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { StepContext, stepRegistry, useGuided, useStep } from './guided'

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

/**
 * Content revealed by the instructor in guided mode.
 * n = the step number (1, 2, 3…) at which this appears. Outside guided mode it
 * behaves like <Reveal>. Hidden steps keep their space, so the page doesn't jump.
 */
export function Step({ n, children, className = '', as = 'div', delay = 0, y = 24, ...rest }) {
  const { guided, shown } = useStep()
  const ref = useRef(null)
  const visible = shown(n)
  const Tag = motion[as] ?? motion.div

  // Bring a newly revealed step into view if it's below the fold.
  useEffect(() => {
    if (!guided || !visible || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    if (r.bottom > window.innerHeight - 24) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [guided, visible])

  if (!guided) {
    return (
      <Reveal as={as} className={className} delay={delay} y={y} {...rest}>
        {children}
      </Reveal>
    )
  }
  return (
    <Tag
      ref={ref}
      className={`${className} ${visible ? '' : 'step-hidden'}`}
      initial={false}
      animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y, filter: 'blur(4px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={visible ? undefined : true}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Small "Step 2 / 5" control shown on sections with steps in guided mode. */
function StepControls({ step, count, setStep }) {
  return (
    <div className="step-ctl" role="group" aria-label="Instructor steps">
      <button type="button" onClick={() => setStep(Math.max(step - 1, 0))} disabled={step === 0} aria-label="Previous step">
        ‹
      </button>
      <span className="step-dots" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <i key={i} className={i < step ? 'on' : ''} />
        ))}
      </span>
      <span className="step-count">
        {step}/{count}
      </span>
      <button type="button" onClick={() => setStep(Math.min(step + 1, count))} disabled={step === count} aria-label="Next step">
        ›
      </button>
    </div>
  )
}

/**
 * A full-width lecture section with a consistent heading block.
 * steps = how many <Step n={…}> reveals this section has (0 = none).
 */
export function Section({ id, eyebrow, title, intro, tone = 'light', steps = 0, children }) {
  const { guided } = useGuided()
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)

  useEffect(() => {
    stepRef.current = step
  }, [step])

  useEffect(() => {
    if (!steps) return
    stepRegistry.set(id, { count: steps, get: () => stepRef.current, set: setStep })
    return () => stepRegistry.delete(id)
  }, [id, steps])

  return (
    <section id={id} className={`section tone-${tone}`} aria-labelledby={`${id}-title`} data-steps={steps || undefined}>
      <StepContext.Provider value={{ step, count: steps, setStep }}>
        <div className="container">
          <Reveal className="section-head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={`${id}-title`}>{title}</h2>
            {intro && <p className="intro">{intro}</p>}
          </Reveal>
          {guided && steps > 0 && <StepControls step={step} count={steps} setStep={setStep} />}
          {children}
        </div>
      </StepContext.Provider>
    </section>
  )
}

/** "As a developer" style callout. */
export function Callout({ label = 'As a developer', children, step }) {
  const Wrap = step ? Step : Reveal
  return (
    <Wrap className="callout" delay={0.1} {...(step ? { n: step } : {})}>
      <span className="callout-label">{label}</span>
      <p>{children}</p>
    </Wrap>
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

/** An illustration with a caption underneath. */
export function Figure({ children, caption, className = '' }) {
  return (
    <figure className={`figure ${className}`}>
      <div className="figure-art">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
