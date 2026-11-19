import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Section, Step, useStep } from '../../../design-system'
import { img } from '../images'

const systems = [
  {
    k: 'windows',
    name: 'Windows',
    logo: img.windows,
    by: 'Microsoft',
    open: false,
    timeline: [
      ['1981', 'MS-DOS: command line only'],
      ['1985', 'Windows 1.0 adds a GUI'],
      ['1993', 'Windows NT: a brand-new core'],
      ['2001', 'Windows XP: NT reaches home PCs'],
      ['Today', 'Windows 11, still built on NT'],
    ],
    nature: ['Closed source: only Microsoft can see and change the core code', 'Microsoft controls updates and distribution'],
    matters: [
      'Comes pre-installed on most PCs',
      'Runs almost every app and game',
      'Common in colleges, offices and enterprises',
      'Gets Linux tools through WSL',
    ],
  },
  {
    k: 'macos',
    name: 'macOS',
    logo: img.apple,
    by: 'Apple',
    open: false,
    timeline: [
      ['1984', 'The first Mac makes the GUI popular'],
      ['2001', 'Mac OS X: rebuilt on UNIX foundations'],
      ['2016', 'Renamed macOS'],
      ['Today', 'On every MacBook and iMac'],
    ],
    nature: ['Closed source, controlled entirely by Apple', 'Runs only on Apple hardware', 'UNIX-based, so it feels close to Linux in the terminal'],
    matters: ['Needs less setup for web development', 'Stable and secure', 'Popular with designers and developers', 'Required to build iPhone apps'],
  },
  {
    k: 'linux',
    name: 'Linux',
    logo: img.tux,
    by: 'Linus Torvalds + thousands of contributors',
    open: true,
    timeline: [
      ['1991', 'Linus Torvalds, a student, shares a new kernel'],
      ['2004', 'Ubuntu makes desktop Linux friendly'],
      ['2008', 'First Android phone: Linux in your pocket'],
      ['Today', 'Runs most servers, the cloud and DevOps'],
    ],
    nature: [
      'Open source and free: anyone can run, study, change and share it',
      'A kernel, not one single OS: many systems are built around it',
      'Kernel + tools together form a complete UNIX-like OS',
    ],
    matters: [
      'Free to use and install',
      'Ideal for web, backend and DevOps work',
      'Matches the servers your code runs on',
      'Helps you understand how systems work inside',
    ],
  },
]

function OsTabs() {
  const { guided, step } = useStep()
  const [pick, setPick] = useState(0)
  const active = guided ? Math.max(0, Math.min(step, systems.length) - 1) : pick
  const os = systems[active]
  return (
    <div className={`ostabs os-${os.k}`}>
      <div className="ostab-row" role="tablist" aria-label="Operating systems">
        {systems.map((s, i) => (
          <button key={s.k} type="button" role="tab" aria-selected={i === active} className={`ostab ${i === active ? 'is-on' : ''}`} onClick={() => setPick(i)}>
            <img src={s.logo} alt="" />
            {s.name}
            {i === active && <motion.span layoutId="ostab-bar" className="ostab-bar" />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={os.k}
          role="tabpanel"
          className="ospanel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <div className="ospanel-head">
            <motion.img
              src={os.logo}
              alt={`${os.name} logo`}
              initial={{ rotate: -12, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            />
            <div>
              <h3>{os.name}</h3>
              <p>Made by {os.by}</p>
              <span className={`src-badge ${os.open ? 'open' : 'closed'}`}>{os.open ? '🔓 Open source' : '🔒 Closed source'}</span>
            </div>
          </div>
          <h4>Background and evolution</h4>
          <ol className="timeline">
            {os.timeline.map(([y, t], i) => (
              <motion.li key={y} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
                <span className="tl-year">{y}</span>
                <span>{t}</span>
              </motion.li>
            ))}
          </ol>
          <div className="ospanel-cols">
            <div>
              <h4>Nature of the software</h4>
              <ul>
                {os.nature.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Why it matters to you</h4>
              <ul>
                {os.matters.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- The family tree ---------- */

function Node({ year, name, note, logo, kind = '' }) {
  return (
    <div className={`tnode ${kind}`}>
      {logo && <img src={logo} alt="" />}
      <span>
        <strong>{name}</strong>
        {year && <small>{year}</small>}
        {note && <em>{note}</em>}
      </span>
    </div>
  )
}

function FamilyTree() {
  const [lens, setLens] = useState(false)
  return (
    <div className={`tree ${lens ? 'show-cmds' : ''}`}>
      <div className="tree-fam unix">
        <Step n={4}>
          <Node name="UNIX" year="1969 · Bell Labs" note="The ideas behind most servers" kind="root" />
        </Step>
        <div className="tree-kids">
          <Step n={5} className="tree-branch">
            <Node name="BSD · NeXTSTEP" year="UNIX descendants" />
            <Node name="macOS" year="2001 as Mac OS X" logo={img.apple} kind="leaf mac" />
          </Step>
          <Step n={6} className="tree-branch dashed">
            <Node name="Linux" year="1991" note="Written from scratch to work like UNIX: “UNIX-like”" logo={img.tux} kind="leaf linux" />
            <div className="tree-leaves">
              {['Android', 'Ubuntu', 'Debian', 'Fedora', 'Mint'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </Step>
        </div>
      </div>
      <Step n={7} className="tree-fam win">
        <Node name="MS-DOS" year="1981" />
        <Node name="Windows 95 · 98" year="Ran on top of DOS" />
        <Node name="Windows NT" year="1993" note="A brand-new core that replaced DOS" kind="replaced" />
        <Node name="Windows XP → 11" year="2001 to today" logo={img.windows} kind="leaf windows" />
        <p className="tree-sep">A separate family</p>
      </Step>
      <div className="tree-lens">
        <button type="button" className="btn btn-ghost btn-sm" aria-pressed={lens} onClick={() => setLens((l) => !l)}>
          {lens ? 'Hide' : 'Show'} who shares the same commands
        </button>
        {lens && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <code>ls</code> <code>cd</code> <code>mkdir</code> <code>pwd</code> work the same on macOS and Linux. Windows uses different commands, so developers
            add Linux to it with WSL.
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default function ThreeOS() {
  return (
    <>
      <Section
        id="three-os"
        eyebrow="Part 2 · The big three"
        title="Windows, macOS and Linux"
        intro="The three operating systems you’ll meet most. For each: where it came from, who controls it, and why it matters to a developer."
        steps={7}
      >
        <OsTabs />
        <h3 className="sub">The OS family tree</h3>
        <FamilyTree />
        <Callout>That’s why commands from a Mac terminal work on a Linux server. On Windows, you’ll install WSL (we’ll do it at the end).</Callout>
      </Section>
    </>
  )
}
