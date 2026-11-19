import { motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'
import { img, photos } from '../images'

const apps = [
  ['Chrome', img.chrome],
  ['Music', img.music],
  ['Download', img.download],
]
const hw = [
  ['CPU', photos.cpu],
  ['RAM', photos.ram],
  ['Storage', photos.ssd],
]
const X = [16.7, 50, 83.3]

/* ---------- Without an OS vs with an OS ---------- */

function ChaosDemo() {
  const [withOS, setWithOS] = useState(false)
  return (
    <div className={`chaos ${withOS ? 'is-calm' : 'is-chaos'}`}>
      <div className="segmented" role="group" aria-label="Show the computer with or without an operating system">
        <button type="button" className={!withOS ? 'is-on' : ''} aria-pressed={!withOS} onClick={() => setWithOS(false)}>
          Without an OS
        </button>
        <button type="button" className={withOS ? 'is-on' : ''} aria-pressed={withOS} onClick={() => setWithOS(true)}>
          With an OS
        </button>
      </div>
      <div className="chaos-stage">
        <svg className="chaos-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {withOS
            ? X.flatMap((x) => [
                <line key={`a${x}`} x1={x} y1="22" x2={x} y2="44" className="calm-line" />,
                <line key={`h${x}`} x1={x} y1="56" x2={x} y2="78" className="calm-line" />,
              ])
            : X.flatMap((a) => X.map((h) => <line key={`${a}-${h}`} x1={a} y1="22" x2={h} y2="78" className="chaos-line" />))}
        </svg>
        <div className="chaos-row">
          {apps.map(([t, src]) => (
            <div key={t} className="chaos-node app">
              <img src={src} alt="" />
              <span>{t}</span>
            </div>
          ))}
        </div>
        <motion.div
          className="chaos-os"
          initial={false}
          animate={{ opacity: withOS ? 1 : 0, scaleX: withOS ? 1 : 0.4 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <img src={img.windows} alt="" />
          <img src={img.apple} alt="" />
          <img src={img.tux} alt="" />
          <strong>Operating system</strong>
        </motion.div>
        {!withOS && (
          <div className="chaos-shouts" aria-hidden="true">
            <span>I need the CPU now!</span>
            <span>Who is using my RAM?</span>
            <span>Where do I save this?</span>
          </div>
        )}
        <div className="chaos-row">
          {hw.map(([t, src]) => (
            <div key={t} className="chaos-node hw">
              <img src={src} alt="" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="chaos-caption" aria-live="polite">
        {withOS
          ? 'Every app asks the OS. The OS decides who gets the CPU, memory and storage, and when.'
          : 'Every app grabs the hardware directly. They fight, overwrite each other and crash.'}
      </p>
    </div>
  )
}

/* ---------- The layer cake ---------- */

const layers = [
  ['You, the user', 'Click, type, tap', 'user'],
  ['Applications', 'Chrome, VS Code, Spotify', 'apps'],
  ['Operating system', 'The manager in the middle', 'os'],
  ['Hardware', 'CPU, RAM, storage, devices', 'hw'],
]

function Layers() {
  const { shown } = useStep()
  return (
    <div className="layers" role="img" aria-label="Layers from top to bottom: user, applications, operating system, hardware">
      {layers.map(([t, d, k], i) => (
        <motion.div
          key={k}
          className={`layer layer-${k}`}
          initial={false}
          animate={{ opacity: shown(i + 1) ? 1 : 0.12, x: shown(i + 1) ? 0 : -30 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        >
          <span className="layer-pic">
            {k === 'user' && <img src={img.user} alt="" />}
            {k === 'apps' && <img src={img.chrome} alt="" />}
            {k === 'os' && <img src={img.tux} alt="" />}
            {k === 'hw' && <img src={photos.cpu} alt="" />}
          </span>
          <span>
            <strong>{t}</strong>
            <small>{d}</small>
          </span>
          {i < layers.length - 1 && (
            <span className="layer-arrow" aria-hidden="true">
              ↓
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- When you… ---------- */

const tasks = [
  ['Open a browser', img.chrome, ['CPU', 'RAM', 'Network']],
  ['Play music', img.music, ['CPU', 'Speakers', 'RAM']],
  ['Download a file', img.download, ['Network', 'Storage', 'RAM']],
]

export default function WhyOS() {
  return (
    <>
      <Section
        id="why-os"
        eyebrow="Part 1 · The operating system"
        title="Why do we need an operating system?"
        intro="Imagine every app talking to the CPU, memory and disk on its own. Flip the switch and compare."
        steps={4}
      >
        <Reveal>
          <ChaosDemo />
        </Reveal>
        <div className="split os-def">
          <Reveal className="split-text">
            <p className="eyebrow">Operating system = the manager</p>
            <p className="lead">
              An operating system is <strong>software</strong> that connects users and applications with the computer <strong>hardware</strong>.
            </p>
            <p className="os-chain">
              <span>User</span>→<span className="on">OS</span>→<span>Hardware</span>
            </p>
          </Reveal>
          <Layers />
        </div>
      </Section>

      <Section id="when-you" eyebrow="When you…" title="You never ask for the hardware. The OS does it for you." tone="alt" steps={3}>
        <div className="card-grid three">
          {tasks.map(([t, src, res], i) => (
            <Step key={t} n={i + 1} className="card task-card" delay={i * 0.08}>
              <img src={src} alt="" />
              <h3>{t}</h3>
              <p>The OS quietly hands out:</p>
              <span className="res-chips">
                {res.map((r, j) => (
                  <span key={r} style={{ '--d': `${j * 0.12}s` }}>
                    {r}
                  </span>
                ))}
              </span>
            </Step>
          ))}
        </div>
        <Callout label="Remember">You don’t manage the resources. The operating system does.</Callout>
      </Section>
    </>
  )
}
