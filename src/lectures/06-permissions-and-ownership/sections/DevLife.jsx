import { motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section } from '../../../design-system'

const cases = [
  ['$ ./deploy.sh', 'bash: ./deploy.sh: Permission denied', 'The script has no x.', 'chmod +x deploy.sh'],
  [
    '$ ssh -i key.pem server',
    'WARNING: UNPROTECTED PRIVATE KEY FILE! Permissions 0644 are too open.',
    'SSH refuses keys other people could read.',
    'chmod 600 key.pem',
  ],
  ['Uploading a website', 'Which permissions should the files have?', 'The web server only needs to read them.', 'Files 644, folders 755'],
  [
    '$ npm install -g something',
    'npm ERR! EACCES: permission denied',
    'Don’t fix it with sudo: that makes root own your files.',
    'Use nvm, or fix the folder’s owner',
  ],
  [
    '$ chmod +x /mnt/c/Users/me/run.sh',
    'Nothing changes (or “Operation not permitted”) on WSL',
    'Windows drives don’t keep Linux permissions.',
    'Move the project into ~ (your Linux home)',
  ],
  [
    'A teammate can’t edit the shared folder',
    'Permission denied',
    'They aren’t in the folder’s group, or the group has no w.',
    'sudo usermod -aG team them; chmod g+w folder',
  ],
]

function Flip({ c, i }) {
  const [flip, setFlip] = useState(false)
  return (
    <Reveal delay={i * 0.05}>
      <button type="button" className={`l6-flip ${flip ? 'is-flipped' : ''}`} onClick={() => setFlip(!flip)} aria-pressed={flip}>
        <motion.span className="l6-flip-inner" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.5 }}>
          <span className="l6-flip-front">
            <code>{c[0]}</code>
            <span className="l6-flip-err">{c[1]}</span>
            <small>Tap for the fix</small>
          </span>
          <span className="l6-flip-back">
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
      eyebrow="Permissions in a developer’s life"
      title="Errors you will meet, and their fixes"
      intro="Every one of these happens to real developers. Read the error, guess the fix, then flip the card."
    >
      <div className="l6-flips">
        {cases.map((c, i) => (
          <Flip key={c[0]} c={c} i={i} />
        ))}
      </div>
    </Section>
  )
}
