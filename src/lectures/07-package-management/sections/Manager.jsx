import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'
import { img } from '../images'

/* ---------- Seven jobs ---------- */

const jobs = [
  ['⬇️', 'Downloads packages from repositories', 'You never visit a website. apt knows where the software lives and fetches it.', 'Get:1 http://archive.ubuntu.com/ubuntu noble/main amd64 git …'],
  ['🧩', 'Resolves and installs dependencies', 'It works out every piece a program needs, and the pieces those need, and installs them all.', 'The following additional packages will be installed:\n  git-man liberror-perl'],
  ['🗂', 'Maintains a local database', 'It remembers what is installed, which version, and why. That’s how it can update or remove things later.', 'dpkg -l git\nii  git  1:2.43.0-1ubuntu7.1  …'],
  ['🔄', 'Handles updates and upgrades', 'One command checks every installed program for newer versions and installs them.', 'sudo apt update && sudo apt upgrade'],
  ['🧹', 'Removes software cleanly', 'It knows every file a package added, so it can take them all away again, plus unused dependencies.', 'sudo apt remove git\nsudo apt autoremove'],
  ['⚖️', 'Prevents package conflicts', 'Two programs that can’t live together, or need different versions of a library? It stops before anything breaks.', 'The following packages have unmet dependencies…'],
  ['🔏', 'Verifies package authenticity', 'Every package is digitally signed. A file that was tampered with is refused.', 'W: GPG error: … The following signatures were invalid'],
]

function Jobs() {
  const [pick, setPick] = useState(0)
  const j = jobs[pick]
  return (
    <div className="l7-jobs">
      <ol className="l7-jobs-list">
        {jobs.map((x, k) => (
          <li key={x[1]}>
            <button type="button" className={`l7-job ${pick === k ? 'is-on' : ''}`} aria-pressed={pick === k} onClick={() => setPick(k)}>
              <span className="l7-job-n">{k + 1}</span>
              <span aria-hidden="true">{x[0]}</span> {x[1]}
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={pick} className="l7-job-detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} aria-live="polite">
          <span className="l7-job-big" aria-hidden="true">
            {j[0]}
          </span>
          <h3>{j[1]}</h3>
          <p>{j[2]}</p>
          <pre className="l7-pre">{j[3]}</pre>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- How a package manager works ---------- */

const nodes = [
  ['local', '💻', 'Local system', 'your laptop or server'],
  ['pm', '🔧', 'Package manager', 'apt'],
  ['repo', '🗄', 'Repository', 'archive.ubuntu.com'],
  ['data', '📋', 'Data', 'package lists, versions'],
  ['pkgs', '📦', 'Packages', '.deb files'],
  ['deps', '🧩', 'Dependencies', 'what each package needs'],
]

const stages = [
  { on: ['local', 'pm'], text: 'You type sudo apt install git on your local system. The package manager, apt, takes the request.' },
  { on: ['pm', 'repo', 'data'], text: 'apt checks the data it downloaded from the repository: is there a package called git? Which version?' },
  { on: ['repo', 'pkgs', 'deps'], text: 'The data says git depends on git-man and liberror-perl. Those are dependencies, so they’re added to the list.' },
  { on: ['repo', 'pkgs', 'pm'], text: 'apt downloads all three packages from the repository.' },
  { on: ['pm', 'local'], text: 'apt installs them on your system and records them in its local database. git is ready to use.' },
]

function Flow() {
  const { guided, step } = useStep()
  const [local, setLocal] = useState(0)
  const i = guided ? Math.max(0, Math.min(step, stages.length) - 1) : local
  const s = stages[i]
  return (
    <div className="l7-flow">
      <div className="l7-flow-map">
        {nodes.map(([k, icon, name, sub]) => (
          <motion.div key={k} className={`l7-node l7-node-${k} ${s.on.includes(k) ? 'is-on' : ''}`} animate={{ scale: s.on.includes(k) ? 1.05 : 1 }}>
            <span aria-hidden="true">{icon}</span>
            <strong>{name}</strong>
            <small>{sub}</small>
          </motion.div>
        ))}
      </div>
      <div className="l7-flow-foot">
        <AnimatePresence mode="wait">
          <motion.p key={i} className="l7-flow-text" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            <span className="l7-flow-n">
              {i + 1}/{stages.length}
            </span>{' '}
            {s.text}
          </motion.p>
        </AnimatePresence>
        {!guided && (
          <div className="l7-flow-btns">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLocal(Math.max(0, i - 1))} disabled={i === 0}>
              ← Back
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setLocal((i + 1) % stages.length)}>
              {i === stages.length - 1 ? '↺ Again' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Manager() {
  return (
    <>
      <Section
        id="manager"
        eyebrow="Part 3 · Package managers"
        title="What is a package manager?"
        intro="A tool for installing, updating, configuring and removing software packages on a Linux system."
        tone="alt"
        steps={1}
      >
        <Reveal className="l7-two">
          <figure className="l7-shot">
            <img src={img['pm-overview']} alt="A package manager installs, updates, configures and removes software packages (.deb or .rpm) for the system and its applications" />
          </figure>
          <div>
            <p className="l7-lead">
              You tell it <strong>what</strong> you want. It works out <strong>how</strong>: where to get it, what else is needed, and where every file goes.
            </p>
            <p className="l7-lead l7-mt">On Ubuntu the package manager is <code>apt</code>.</p>
          </div>
        </Reveal>
        <Step n={1}>
          <h3 className="sub">Its seven jobs</h3>
          <Jobs />
        </Step>
      </Section>

      <Section id="flow" eyebrow="How it works" title="What happens when you install something" intro="Follow one request from your terminal to the repository and back." steps={5}>
        <Reveal>
          <Flow />
        </Reveal>
        <Callout>
          The same loop runs when you deploy a website: your server asks a repository for nginx, gets it plus its dependencies, and installs them. No downloads by hand,
          no guessing versions.
        </Callout>
      </Section>
    </>
  )
}
