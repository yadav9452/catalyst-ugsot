import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, OsKeys, Reveal, Section, Step } from '../../../design-system'

/* ---------- Hook: who may see your diary? ---------- */

const people = [
  { k: 'you', icon: '🧑', name: 'You' },
  { k: 'friends', icon: '👫', name: 'Your 3 closest friends' },
  { k: 'class', icon: '🏫', name: 'All 50 classmates' },
]
const acts = [
  ['r', 'Read it'],
  ['w', 'Write in it'],
]

function Diary() {
  const [grant, setGrant] = useState({ you: 'rw', friends: '', class: '' })
  const toggle = (k, a) => setGrant((g) => ({ ...g, [k]: g[k].includes(a) ? g[k].replace(a, '') : g[k] + a }))
  const risky = grant.class.length > 0
  return (
    <div className="l6-diary">
      <div className="l6-diary-book" aria-hidden="true">
        <motion.span animate={{ rotate: risky ? [0, -8, 8, 0] : 0 }} transition={{ duration: 0.5 }}>
          {risky ? '😱' : '📔'}
        </motion.span>
        <strong>my-diary.txt</strong>
      </div>
      <div className="l6-diary-rows">
        {people.map((p) => (
          <div key={p.k} className="l6-diary-row">
            <span className="l6-diary-who">
              <span aria-hidden="true">{p.icon}</span> {p.name}
            </span>
            {acts.map(([a, label]) => (
              <button
                key={a}
                type="button"
                className={`l6-toggle ${grant[p.k].includes(a) ? 'is-on' : ''}`}
                aria-pressed={grant[p.k].includes(a)}
                onClick={() => toggle(p.k, a)}
              >
                {grant[p.k].includes(a) ? '✓' : '✗'} {label}
              </button>
            ))}
          </div>
        ))}
        <AnimatePresence mode="wait">
          <motion.p key={risky ? 'r' : 's'} className={`l6-diary-msg ${risky ? 'is-bad' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {risky
              ? grant.class.includes('w')
                ? 'Fifty people can now rewrite your diary. Anyone could change what it says.'
                : 'Fifty people can now read your secrets. Would you really do that?'
              : 'You decide who gets in, and what they may do. That is exactly what Linux permissions do for every file.'}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Security: how far can a hacked app reach? ---------- */

const targets = [
  ['/var/www/site/index.html', 'the website itself', 'app'],
  ['/var/www/site/uploads/', 'user uploads', 'app'],
  ['/home/student/.env', 'your API keys', 'root'],
  ['/home/student/.ssh/id_ed25519', 'your SSH key', 'root'],
  ['/etc/shadow', 'every password hash', 'root'],
  ['/etc/passwd + sudo', 'create new admin users', 'root'],
]

function BlastRadius() {
  const [asRoot, setAsRoot] = useState(false)
  return (
    <div className="l6-blast">
      <div className="l6-blast-head">
        <p>
          <span aria-hidden="true">💥</span> A bug lets an attacker take over your web app. The app runs as…
        </p>
        <div className="l6-seg" role="group" aria-label="The web app runs as">
          <button type="button" className={!asRoot ? 'is-on' : ''} onClick={() => setAsRoot(false)} aria-pressed={!asRoot}>
            www-data <small>(its own small user)</small>
          </button>
          <button type="button" className={asRoot ? 'is-on' : ''} onClick={() => setAsRoot(true)} aria-pressed={asRoot}>
            root <small>(the all-powerful admin)</small>
          </button>
        </div>
      </div>
      <ul className="l6-blast-list">
        {targets.map(([path, what, need], k) => {
          const hit = asRoot || need === 'app'
          return (
            <motion.li
              key={path}
              className={hit ? 'is-hit' : 'is-safe'}
              animate={{ x: hit ? [0, -4, 4, 0] : 0 }}
              transition={{ delay: k * 0.05, duration: 0.35 }}
            >
              <span aria-hidden="true">{hit ? '🔥' : '🛡'}</span>
              <code>{path}</code>
              <span>{what}</span>
              <b>{hit ? 'attacker can reach it' : 'Permission denied'}</b>
            </motion.li>
          )
        })}
      </ul>
      <p className="l6-blast-score">
        Damage: <strong>{asRoot ? '6 / 6: the whole server' : '2 / 6: just the website'}</strong>
      </p>
    </div>
  )
}

const rules = [
  ['🔑', 'Least privilege', 'Give every user and program only the access it needs, nothing more.'],
  ['🤫', 'Secrets stay private', '.env files and SSH keys should be readable by you alone.'],
  ['🚫', 'Never chmod 777', 'It lets anyone change your files. It is never the right fix for an error.'],
  ['👑', 'Root only when needed', 'One wrong rm or chmod as root can break the whole system.'],
]

const practiceRows = [
  ['Where to practise', 'Ubuntu (WSL): stay in your Linux home, type cd ~', 'Terminal: any folder in your home works'],
  ['Folders to avoid for chmod', '/mnt/c/… (Windows drives ignore most Linux permissions)', 'None, but don’t experiment in system folders'],
  ['sudo asks for…', 'the Linux password you set when you installed Ubuntu', 'your Mac login password (admin accounts only)'],
  ['Typing a password', 'Nothing appears, not even ••• : that’s normal. Type it and press [Enter]', 'Same: type it blind and press [Return]'],
  ['ls -l, chmod, chown, id, groups, umask', 'Work exactly as shown', 'Work exactly as shown'],
  ['useradd, usermod, groupadd, userdel', 'Work with sudo', 'Not on macOS: watch that part, or use an Ubuntu virtual machine'],
]

export default function Intro() {
  return (
    <>
      <Section
        id="intro"
        eyebrow="Part 1 · Why permissions?"
        title="Can you share your secrets with fifty others?"
        intro="Of course not. You choose who may read your diary, and who may write in it. Try it."
        steps={2}
      >
        <Reveal>
          <Diary />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">A computer has the same problem</h3>
          <p className="l6-lead">
            Many users and programs share one Linux machine. The system must decide <strong>who can open a file</strong>, <strong>who can change it</strong>,
            and <strong>who can’t even see what’s inside</strong>. That control is called permissions.
          </p>
        </Step>
        <Step n={2} className="l6-rwx3">
          {[
            ['r', 'Read', 'Open it and look inside', '👀'],
            ['w', 'Write', 'Change it, add to it, empty it', '✏️'],
            ['x', 'Execute', 'Run it as a program', '▶️'],
          ].map(([l, t, d, e], k) => (
            <motion.div key={l} className="l6-rwx-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
              <span className="l6-rwx-letter">{l}</span>
              <span aria-hidden="true" className="l6-rwx-emoji">
                {e}
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
              <small>Permission {k + 1} of 3</small>
            </motion.div>
          ))}
        </Step>
      </Section>

      <Section
        id="security"
        eyebrow="Why it matters"
        title="Permissions are your server’s seat belts"
        intro="The servers you’ll deploy websites to run Linux. When something goes wrong, permissions decide how bad it gets."
        tone="alt"
        steps={1}
      >
        <Reveal>
          <BlastRadius />
        </Reveal>
        <Step n={1} className="card-grid four">
          {rules.map(([icon, t, d]) => (
            <div key={t} className="card">
              <span className="card-icon" aria-hidden="true">
                {icon}
              </span>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </Step>
      </Section>

      <Section
        id="setup"
        eyebrow="Before you practise"
        title="Your computer: Windows or Mac"
        intro="Most of you are on Windows with Ubuntu (WSL). Mac users have a Terminal that understands almost everything today."
      >
        <Reveal>
          <OsKeys rows={practiceRows} title="Practising permissions on your laptop" winLabel="Windows (Ubuntu / WSL)" macLabel="Mac (Terminal)" />
        </Reveal>
        <Callout label="Watch out">
          On WSL, your Windows files live under /mnt/c. Windows doesn’t store Linux permissions there, so chmod seems to do nothing. Always practise in your
          Linux home: cd ~
        </Callout>
      </Section>
    </>
  )
}
