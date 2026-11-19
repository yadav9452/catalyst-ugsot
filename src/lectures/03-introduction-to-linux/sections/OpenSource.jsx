import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Section, useStep } from '../../../design-system'
import { img } from '../images'

const code = ['int schedule(task *t) {', '  pick_next_cpu(t);', '  give_time_slice(t);', '  return 0;', '}']
const people = [
  ['A', '#e00c16'],
  ['K', '#5b3fd1'],
  ['M', '#0b7a75'],
  ['S', '#d9480f'],
  ['R', '#1f5fd1'],
  ['J', '#0e7490'],
]
const added = ['// faster on phones', '// fix: wifi driver', '// new: save power', '// security patch', '// support new chip']
const forks = ['Ubuntu', 'Debian', 'Mint', 'Fedora', 'Android']

function SourceBox() {
  const { guided, step } = useStep()
  const [pick, setPick] = useState('closed')
  const mode = guided ? (step >= 2 ? 'open' : 'closed') : pick
  const showForks = guided ? step >= 3 : mode === 'open'
  const [extra, setExtra] = useState(0)

  useEffect(() => {
    if (mode !== 'open') return
    const id = setInterval(() => setExtra((n) => (n + 1) % (added.length + 1)), 1400)
    return () => clearInterval(id)
  }, [mode])

  const open = mode === 'open'
  return (
    <div className={`srcbox-wrap ${open ? 'is-open' : 'is-closed'}`}>
      <div className="segmented" role="group" aria-label="Closed or open source">
        <button type="button" className={!open ? 'is-on' : ''} aria-pressed={!open} onClick={() => setPick('closed')}>
          🔒 Closed source
        </button>
        <button type="button" className={open ? 'is-on' : ''} aria-pressed={open} onClick={() => setPick('open')}>
          🔓 Open source
        </button>
      </div>
      <div className="srcbox-stage">
        <div className="srcbox-people">
          {people.map(([p, c], i) => (
            <motion.span
              key={p}
              className="person"
              style={{ background: c }}
              animate={open ? { y: [0, -8, 0], opacity: 1 } : { x: [0, 6, 0], opacity: 0.35 }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            >
              {p}
            </motion.span>
          ))}
        </div>
        <div className="srcbox">
          <div className="srcbox-lid" aria-hidden="true">
            {open ? '🔓' : '🔒'}
          </div>
          <pre className="srcbox-code" aria-label={open ? 'Source code anyone can read' : 'Hidden source code'}>
            {code.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <AnimatePresence>
              {open &&
                added.slice(0, extra).map((l, i) => (
                  <motion.span key={l} className="srcbox-new" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <i style={{ background: people[i % people.length][1] }} />
                    {l}
                  </motion.span>
                ))}
            </AnimatePresence>
          </pre>
          <p className="srcbox-who">
            {open ? (
              <>
                <img src={img.tux} alt="" /> Linux: anyone can read, change and share the code
              </>
            ) : (
              <>
                <img src={img.windows} alt="" />
                <img src={img.apple} alt="" /> Windows, macOS: only the company can see and change the code
              </>
            )}
          </p>
        </div>
      </div>
      <AnimatePresence>
        {showForks && open && (
          <motion.div className="forks" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <p>Because anyone can build their own version, we get distros:</p>
            <div className="fork-row">
              {forks.map((f, i) => (
                <motion.span key={f} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.12, type: 'spring' }}>
                  {f}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function OpenSource() {
  return (
    <Section
      id="open-source"
      eyebrow="The big difference"
      title="Open source vs closed source"
      intro="Who is allowed to see the code, change it, and share it? Switch between the two and watch who can join in."
      tone="alt"
      steps={3}
    >
      <SourceBox />
      <Callout label="Remember">
        Companies and volunteers around the world improve Linux together. That’s why it’s free, and why there are so many versions of it.
      </Callout>
    </Section>
  )
}
