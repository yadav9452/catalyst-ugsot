import { motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section } from '../../../design-system'

const cases = [
  [
    '$ apt install tree',
    'E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)',
    'Installing changes the system, so it needs root.',
    'sudo apt install tree',
  ],
  ['$ sudo apt install tree', 'E: Unable to locate package tree', 'The package list is empty or old (or the name has a typo).', 'sudo apt update, then try again'],
  ['$ tree', "Command 'tree' not found, but can be installed with: sudo apt install tree", 'Ubuntu even tells you which package to install.', 'sudo apt install tree'],
  [
    '$ sudo apt install git',
    'E: Could not get lock /var/lib/dpkg/lock-frontend. It is held by process 1234 (apt)',
    'Another apt is already running, often automatic updates.',
    'Wait a minute and try again. Don’t delete the lock file',
  ],
  [
    '$ sudo apt upgrade',
    'The following packages have been kept back: linux-generic',
    'Upgrading it needs a new package, and upgrade never adds one.',
    'sudo apt full-upgrade',
  ],
  [
    '$ sudo apt install nginx',
    "E: dpkg was interrupted, you must manually run 'sudo dpkg --configure -a' to correct the problem.",
    'A previous install was stopped halfway (closed terminal, power cut).',
    'sudo dpkg --configure -a',
  ],
]

function Flip({ c, i }) {
  const [flip, setFlip] = useState(false)
  return (
    <Reveal delay={i * 0.05}>
      <button type="button" className="l7-flip" onClick={() => setFlip(!flip)} aria-pressed={flip}>
        <motion.span className="l7-flip-inner" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.5 }}>
          <span className="l7-flip-front">
            <code>{c[0]}</code>
            <span className="l7-flip-err">{c[1]}</span>
            <small>Tap for the fix</small>
          </span>
          <span className="l7-flip-back">
            <span>{c[2]}</span>
            <code>{c[3]}</code>
          </span>
        </motion.span>
      </button>
    </Reveal>
  )
}

export default function DevLife() {
  return (
    <Section
      id="dev"
      eyebrow="apt in a developer’s life"
      title="Errors you will meet, and their fixes"
      intro="Every one of these happens to real developers, often on the first day with a new server. Read the error, guess the fix, then flip the card."
    >
      <div className="l7-flips">
        {cases.map((c, i) => (
          <Flip key={c[0] + i} c={c} i={i} />
        ))}
      </div>
    </Section>
  )
}
