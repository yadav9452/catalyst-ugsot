import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, OsKeys, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { fileManagerKeys } from '../../../course/shortcuts'
import { expandBraces } from './fsSim'

/* ---------- Hidden files: ls vs ls -a ---------- */

const homeItems = [
  ['.bashrc', 'Your shell settings: aliases, colours, the prompt. Runs every time you open a terminal.'],
  ['.config/', 'Settings folders for many apps (VS Code, Git tools, …).'],
  ['.env', 'Secret settings for an app, e.g. a database password. Never commit it to GitHub!'],
  ['.gitignore', 'Tells Git which files to leave out (like .env and node_modules/).'],
  ['.secret', 'The file you make with touch .secret. Hidden because its name starts with a dot.'],
  ['Documents/', ''],
  ['notes.txt', ''],
  ['projects/', ''],
]

function Hidden() {
  const [all, setAll] = useState(false)
  const [info, setInfo] = useState(null)
  const items = homeItems.filter(([n]) => all || !n.startsWith('.'))
  return (
    <div className="l5-hidden">
      <div className="l5-seg" role="group" aria-label="Which ls?">
        <button type="button" className={!all ? 'is-on' : ''} onClick={() => setAll(false)}>
          ls
        </button>
        <button type="button" className={all ? 'is-on' : ''} onClick={() => setAll(true)}>
          ls -a
        </button>
      </div>
      <div className="l5-hidden-grid">
        <AnimatePresence initial={false}>
          {items.map(([n, d]) => (
            <motion.button
              key={n}
              type="button"
              layout
              className={`l5-hfile ${n.startsWith('.') ? 'is-dot' : ''} ${info === n ? 'is-on' : ''}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => setInfo(d ? n : null)}
              disabled={!d}
            >
              <span aria-hidden="true">{n.endsWith('/') ? '📁' : '📄'}</span>
              {n}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <p className="l5-hidden-say" aria-live="polite">
        {info
          ? `${info}: ${homeItems.find(([n]) => n === info)[1]}`
          : all
            ? 'ls -a shows everything, including names that start with a dot. Click a dot file.'
            : 'A normal ls hides every name that starts with a dot. Switch to ls -a.'}
      </p>
    </div>
  )
}

/* ---------- mkdir and mkdir -p ---------- */

const tries = [
  { c: 'mkdir newdir', note: 'One new folder.' },
  { c: 'mkdir AI_Project/src', note: 'Fails if AI_Project doesn’t exist yet.' },
  { c: 'mkdir AI_Project', note: 'Step by step: the parent first…' },
  { c: 'mkdir AI_Project/src AI_Project/docs AI_Project/logs', note: '…then the folders inside it.' },
  { c: 'mkdir -p web/css/themes', note: '-p creates every missing folder on the way, in one go.' },
  { c: 'mkdir -p project/{src,docs,tests}', note: 'Bonus: {a,b,c} expands to three paths before mkdir runs.' },
]

function Mkdir() {
  const [dirs, setDirs] = useState([])
  const [log, setLog] = useState([])

  function runIt({ c }) {
    const words = c.split(' ').slice(1)
    const p = words.includes('-p')
    const raw = words.filter((w) => w !== '-p')
    const args = raw.flatMap(expandBraces)
    const out = [{ t: '$ ' + c, k: 'cmd' }]
    if (args.length !== raw.length) out.push({ t: 'bash expands it to: mkdir -p ' + args.join(' '), k: 'dim' })
    let next = [...dirs]
    for (const a of args) {
      if (next.includes(a)) {
        if (!p) out.push({ t: `mkdir: cannot create directory '${a}': File exists`, k: 'err' })
        continue
      }
      const parts = a.split('/')
      const parent = parts.slice(0, -1).join('/')
      if (parent && !next.includes(parent) && !p) {
        out.push({ t: `mkdir: cannot create directory '${a}': No such file or directory`, k: 'err' })
        continue
      }
      parts.forEach((_, i) => {
        const sub = parts.slice(0, i + 1).join('/')
        if (!next.includes(sub)) next.push(sub)
      })
    }
    setDirs(next)
    setLog((l) => [...l, ...out].slice(-14))
  }

  const sorted = [...dirs].sort()
  return (
    <div className="l5-mk">
      <div className="l5-mk-cmds">
        {tries.map((t) => (
          <button key={t.c} type="button" className="l5-cmdbtn" onClick={() => runIt(t)}>
            {t.c}
            <small>{t.note}</small>
          </button>
        ))}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setDirs([])
            setLog([])
          }}
        >
          ↺ Reset
        </button>
      </div>
      <div className="l5-mk-right">
        <div className="l5-mk-log" aria-live="polite">
          {log.length ? (
            log.map((l, i) => (
              <p key={i} className={`l5k-${l.k}`}>
                {l.t}
              </p>
            ))
          ) : (
            <p className="l5k-dim">Click a command on the left.</p>
          )}
        </div>
        <ul className="l5-mk-tree" aria-label="Folders in ~">
          <li className="l5-mk-root">~/</li>
          <AnimatePresence initial={false}>
            {sorted.map((d) => (
              <motion.li
                key={d}
                style={{ '--depth': d.split('/').length }}
                initial={{ opacity: 0, x: -16, backgroundColor: 'rgba(224,12,22,0.18)' }}
                animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(224,12,22,0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                📁 {d.split('/').pop()}/
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  )
}

export default function Folders() {
  return (
    <>
      <Section
        id="folders"
        eyebrow="Part 8 · Hidden files and folders"
        title="Files that start with a dot are hidden"
        intro="Not secret, just tidied away so they don’t clutter your view."
        steps={1}
      >
        <Reveal>
          <Hidden />
        </Reveal>
        <Step n={1}>
          <Callout label="Challenge 2">You made a hidden file with touch .secret. Which command shows it? (Answer: ls -a. The -a means all.)</Callout>
          <OsKeys title="Seeing hidden files outside the terminal" rows={fileManagerKeys} winLabel="Windows (File Explorer)" macLabel="Mac (Finder)" />
        </Step>
      </Section>
      <Section
        id="mkdir"
        eyebrow="Making folders"
        title="mkdir, and the magic of -p"
        intro="Click the commands from top to bottom. Watch which ones fail, and why."
        tone="alt"
      >
        <Reveal>
          <Mkdir />
        </Reveal>
        <PauseBadge>Challenge 3: build AI_Project with src, docs and logs inside, first step by step, then in one mkdir -p command.</PauseBadge>
      </Section>
    </>
  )
}
