import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { PauseBadge, Section, Step } from '../../../design-system'
import { img } from '../images'

const parts = [
  { t: 'Linux kernel', d: 'The same in every distro', art: <img src={img.tux} alt="" /> },
  { t: 'Software', d: 'Browser, office apps, media players', art: <img src={img.chrome} alt="" /> },
  { t: 'Tools', d: 'Package manager, desktop look, settings', art: <span className="eq-ico">🧰</span> },
]

const distros = [
  {
    k: 'ubuntu',
    name: 'Ubuntu',
    who: 'I’m new to Linux and want the most help online',
    color: '#E95420',
    best: 'Beginners, Windows and macOS users',
    base: 'Built on Debian',
    pkg: 'apt',
    why: 'The most popular choice for beginners, with the most tutorials. Also very common on cloud servers.',
  },
  {
    k: 'mint',
    name: 'Linux Mint',
    who: 'I’m switching from Windows and want it to feel familiar',
    color: '#69A53F',
    best: 'New Linux users, Windows switchers',
    base: 'Built on Ubuntu',
    pkg: 'apt',
    why: 'Its desktop, with a start menu and taskbar, looks a lot like Windows.',
  },
  {
    k: 'debian',
    name: 'Debian',
    who: 'I’m running a server that must stay up for years',
    color: '#A80030',
    best: 'Servers, cloud, long-term systems',
    base: 'One of the oldest distros (1993)',
    pkg: 'apt',
    why: 'Very stable, with a slower release cycle: updates are tested for a long time before release.',
  },
  {
    k: 'fedora',
    name: 'Fedora',
    who: 'I want the newest technology and don’t mind tinkering',
    color: '#294172',
    best: 'Cutting-edge tech, advanced users',
    base: 'Sponsored by Red Hat',
    pkg: 'dnf',
    why: 'Gets new features early, so it’s great for trying the latest tools.',
  },
]

function Equation() {
  return (
    <div className="eq" role="img" aria-label="Linux kernel plus software plus tools equals a distro">
      {parts.map((p, i) => (
        <Step key={p.t} n={i + 1} className="eq-part-wrap" delay={i * 0.08}>
          {i > 0 && (
            <span className="eq-op" aria-hidden="true">
              +
            </span>
          )}
          <div className="eq-part">
            {p.art}
            <strong>{p.t}</strong>
            <small>{p.d}</small>
          </div>
        </Step>
      ))}
      <Step n={4} className="eq-part-wrap">
        <span className="eq-op" aria-hidden="true">
          =
        </span>
        <div className="eq-part eq-result">
          <span className="eq-stack" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <strong>A distro</strong>
          <small>Ubuntu, Debian, Mint, Fedora…</small>
        </div>
      </Step>
    </div>
  )
}

function Picker() {
  const [pick, setPick] = useState(null)
  const d = distros.find((x) => x.k === pick)
  return (
    <div className="picker">
      <div className="picker-q">
        <p className="eyebrow">Which distro fits you?</p>
        {distros.map((x) => (
          <button key={x.k} type="button" className={`picker-opt ${pick === x.k ? 'is-on' : ''}`} aria-pressed={pick === x.k} onClick={() => setPick(x.k)}>
            “{x.who}”
          </button>
        ))}
      </div>
      <div className="picker-a" aria-live="polite">
        <AnimatePresence mode="wait">
          {d ? (
            <motion.div
              key={d.k}
              className="distro-card"
              style={{ '--dc': d.color }}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="distro-badge">
                <img src={img.tux} alt="" />
              </span>
              <h3>{d.name}</h3>
              <p>{d.why}</p>
              <dl>
                <dt>Best for</dt>
                <dd>{d.best}</dd>
                <dt>Family</dt>
                <dd>{d.base}</dd>
                <dt>Install apps with</dt>
                <dd>
                  <code>sudo {d.pkg} install …</code>
                </dd>
              </dl>
            </motion.div>
          ) : (
            <motion.p key="empty" className="picker-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              ← Pick the sentence that sounds most like you
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Distros() {
  return (
    <>
      <Section
        id="distros"
        eyebrow="Part 3 · Linux distributions"
        title="Linux distro = kernel + software + tools"
        intro="Linux is open source, so there are hundreds of distros for different uses. They all share the same kernel and many of the same GNU tools."
        steps={5}
      >
        <Equation />
        <Step n={5}>
          <p className="differ">
            Distros differ in: <span>User interface</span>
            <span>Package manager</span>
            <span>Target users</span>
          </p>
        </Step>
      </Section>
      <Section id="distro-picker" eyebrow="Commonly used distros" title="Ubuntu, Mint, Debian or Fedora?" tone="alt">
        <Picker />
        <PauseBadge>Pause and pick: which one would you suggest to a friend switching from Windows?</PauseBadge>
      </Section>
    </>
  )
}
