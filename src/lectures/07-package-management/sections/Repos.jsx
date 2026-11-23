import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- Where apt looks ---------- */

const sources = [
  ['Types: deb', 'This source offers ready-made .deb packages.'],
  ['URIs: http://archive.ubuntu.com/ubuntu/', 'The address of the repository: the server apt downloads from.'],
  ['Suites: noble noble-updates noble-backports', 'noble is the code name of Ubuntu 24.04. noble-updates holds bug fixes released after 24.04 came out.'],
  [
    'Components: main restricted universe multiverse',
    'Sections of the repository. main = supported by Ubuntu; universe = kept by the community; restricted and multiverse = software with licence limits.',
  ],
  ['Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg', 'The key apt uses to check that every package really comes from Ubuntu and hasn’t been changed.'],
]

function SourcesFile() {
  const [pick, setPick] = useState(1)
  return (
    <div className="l7-src">
      <div className="l7-tty">
        <div className="l7-tty-bar">
          <span className="l7-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>/etc/apt/sources.list.d/ubuntu.sources</span>
        </div>
        <div className="l7-src-lines" role="group" aria-label="Lines of the sources file">
          {sources.map(([line], k) => (
            <button key={line} type="button" className={`l7-src-line ${pick === k ? 'is-on' : ''}`} aria-pressed={pick === k} onClick={() => setPick(k)}>
              {line}
            </button>
          ))}
        </div>
      </div>
      <p className="l7-anat-explain" aria-live="polite">
        {sources[pick][1]}
      </p>
    </div>
  )
}

/* ---------- Signatures ---------- */

function Signature() {
  const [tampered, setTampered] = useState(false)
  return (
    <div className="l7-sig">
      <div className="l7-sig-row">
        <span className="l7-sig-box" aria-hidden="true">
          🗄
          <small>Ubuntu repository</small>
        </span>
        <motion.span className="l7-sig-pkg" aria-hidden="true" animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          📦 nginx.deb {tampered ? '😈' : '🔏'}
        </motion.span>
        <span className="l7-sig-box" aria-hidden="true">
          💻
          <small>your apt</small>
        </span>
      </div>
      <div className="l7-seg" role="group" aria-label="On the way to you, the package is…">
        <button type="button" className={!tampered ? 'is-on' : ''} aria-pressed={!tampered} onClick={() => setTampered(false)}>
          untouched
        </button>
        <button type="button" className={tampered ? 'is-on' : ''} aria-pressed={tampered} onClick={() => setTampered(true)}>
          changed by an attacker
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={String(tampered)} className={`l7-msg ${tampered ? 'is-bad' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
          {tampered
            ? '🛑 The signature no longer matches Ubuntu’s key. apt refuses to install it, and tells you the signature is invalid.'
            : '✅ The signature matches Ubuntu’s key, so apt knows the package is genuine and installs it.'}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

const whys = [
  ['🏛', 'Centralisation', 'All software comes from official, checked servers. One place to look.'],
  ['🔏', 'Security', 'Packages are digitally signed, and apt checks the signature before installing.'],
  ['🏷', 'Version control', 'Only stable, tested versions go in, and they’re built to work together.'],
  ['🔄', 'Automated updates', 'Your system knows where every program came from, so it can update them all automatically.'],
]

export default function Repos() {
  return (
    <Section
      id="repos"
      eyebrow="Part 5 · Repositories"
      title="Where packages live"
      intro="A repository is a central storage place on the internet. It holds software packages, their versions, how they depend on each other, digital signatures and update records."
      steps={3}
    >
      <Step n={1}>
        <h3 className="sub l7-sub-top">How does apt know where to look?</h3>
        <p className="l7-lead">A small settings file lists the repositories. Click each line.</p>
        <SourcesFile />
      </Step>
      <Step n={2}>
        <h3 className="sub">Why it’s safe: digital signatures</h3>
        <Signature />
      </Step>
      <Step n={3}>
        <h3 className="sub">Why repositories are essential</h3>
        <div className="card-grid four">
          {whys.map(([icon, t, d]) => (
            <div key={t} className="card">
              <span className="card-icon" aria-hidden="true">
                {icon}
              </span>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Step>
      <Reveal className="l7-strip">
        <figure className="l7-shot">
          <img src={img['repos-why']} alt="Why repositories are essential: centralisation, security, version control and automated updates" />
        </figure>
      </Reveal>
      <Callout>
        Sometimes a tool isn’t in Ubuntu’s repositories, or you need a newer version (Node.js is a common example). Its makers then give you a line to add their own
        repository and key. Only add repositories from sources you trust: you’re letting them install software as root.
      </Callout>
    </Section>
  )
}
