import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'

const HOME = '/home/jason'

// The little tree used by the path builder. Folders end without a dot; files have one.
const tree = [
  '/',
  '/bin',
  '/etc',
  '/home',
  '/home/jason',
  '/home/jason/notes.txt',
  '/home/jason/scripts',
  '/home/jason/scripts/myScripts.sh',
  '/home/pat',
  '/home/pat/todo.txt',
  '/tmp',
  '/var',
  '/var/log',
  '/var/log/syslog',
]
const isFile = (p) => /\.[a-z]+$/.test(p) || p === '/var/log/syslog'
const depth = (p) => (p === '/' ? 0 : p.split('/').length - 1)
const name = (p) => (p === '/' ? '/' : p.slice(p.lastIndexOf('/') + 1))
const parts = (p) => p.split('/').filter(Boolean)

function relative(from, to) {
  const a = parts(from)
  const b = parts(to)
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  const ups = a.length - i
  const rel = [...Array(ups).fill('..'), ...b.slice(i)].join('/')
  const steps = [
    ...a
      .slice(i)
      .reverse()
      .map((n) => `up out of ${n} (..)`),
    ...b.slice(i).map((n) => `into ${n}`),
  ]
  return { rel: rel || '.', steps }
}

function PathBuilder() {
  const [here, setHere] = useState('/home')
  const [target, setTarget] = useState('/home/jason/scripts/myScripts.sh')
  const [mode, setMode] = useState('target')
  const [msg, setMsg] = useState('')

  function pick(p) {
    if (mode === 'here') {
      if (isFile(p)) {
        setMsg('You can only stand inside a folder, not a file.')
        return
      }
      setHere(p)
      setMode('target')
      setMsg('')
    } else {
      setTarget(p)
      setMsg('')
    }
  }
  const { rel, steps } = relative(here, target)
  const tilde = target === HOME ? '~' : target.startsWith(HOME + '/') ? '~' + target.slice(HOME.length) : null

  return (
    <div className="l5-pb">
      <div className="l5-pb-left">
        <div className="l5-seg" role="group" aria-label="What does a click do?">
          <button type="button" className={mode === 'here' ? 'is-on' : ''} onClick={() => setMode('here')}>
            📍 Move “you are here”
          </button>
          <button type="button" className={mode === 'target' ? 'is-on' : ''} onClick={() => setMode('target')}>
            🎯 Pick a destination
          </button>
        </div>
        <ul className="l5-pb-tree">
          {tree.map((p) => {
            const onWay = target === p || target.startsWith(p === '/' ? '/' : p + '/')
            return (
              <li key={p} style={{ '--depth': depth(p) }}>
                <button
                  type="button"
                  className={`l5-pb-node ${isFile(p) ? 'is-file' : ''} ${p === here ? 'is-here' : ''} ${p === target ? 'is-target' : ''} ${onWay ? 'is-way' : ''}`}
                  onClick={() => pick(p)}
                >
                  <span aria-hidden="true">{isFile(p) ? '📄' : '📁'}</span> {name(p)}
                  {p === here && <span className="l5-pb-tag">📍 you are here</span>}
                  {p === target && <span className="l5-pb-tag t">🎯</span>}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="l5-pb-msg" aria-live="polite">
          {msg || (mode === 'here' ? 'Click a folder to stand in it.' : 'Click any file or folder to get directions to it.')}
        </p>
      </div>
      <div className="l5-pb-out" aria-live="polite">
        <div className="l5-pb-row">
          <p className="eyebrow">Absolute path · works from anywhere</p>
          <AnimatePresence mode="wait">
            <motion.code key={target} className="l5-pb-path" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {target}
            </motion.code>
          </AnimatePresence>
        </div>
        <div className="l5-pb-row">
          <p className="eyebrow">Relative path · from {here}</p>
          <AnimatePresence mode="wait">
            <motion.code key={here + target} className="l5-pb-path rel" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {rel}
            </motion.code>
          </AnimatePresence>
          <ol className="l5-pb-steps">{steps.length ? steps.map((s, i) => <li key={i + s}>{s}</li>) : <li>You are already there.</li>}</ol>
        </div>
        {tilde && (
          <div className="l5-pb-row">
            <p className="eyebrow">Using ~ (jason’s home)</p>
            <code className="l5-pb-path tl">{tilde}</code>
          </div>
        )}
      </div>
    </div>
  )
}

const anatomy = [
  ['/', 'root', 'Starts at the top'],
  ['home', 'folder', ''],
  ['/', 'separator', 'Slashes separate the steps'],
  ['jason', 'folder', ''],
  ['/', 'separator', ''],
  ['scripts', 'folder', ''],
  ['/', 'separator', ''],
  ['myScripts.sh', 'file', 'Ends at the file you want'],
]

function Anatomy() {
  const [on, setOn] = useState(null)
  return (
    <div className="l5-anat">
      <code className="l5-anat-path">
        {anatomy.map(([t, k], i) => (
          <button
            key={i}
            type="button"
            className={`l5-anat-part k-${k} ${on === i ? 'is-on' : ''}`}
            onMouseEnter={() => setOn(i)}
            onFocus={() => setOn(i)}
            onClick={() => setOn(i)}
          >
            {t}
          </button>
        ))}
      </code>
      <p className="l5-anat-say" aria-live="polite">
        {on === null ? 'Hover or tap each part.' : `${anatomy[on][0]} → ${anatomy[on][1]}${anatomy[on][2] ? ': ' + anatomy[on][2] : ''}`}
      </p>
      <p className="l5-muted">Like directions: “go here → then here → then here, and you will find the file.”</p>
    </div>
  )
}

const shortcuts = [
  ['.', 'This folder', 'The folder you are in right now. ./run.sh = the run.sh right here.'],
  ['..', 'The parent', 'One folder up. From /home/jason/scripts, ../notes.txt = /home/jason/notes.txt'],
  ['~', 'Home', 'Your home folder. For jason, ~ = /home/jason and ~/scripts = /home/jason/scripts'],
]

export default function Paths() {
  return (
    <>
      <Section
        id="paths"
        eyebrow="Part 4 · Paths"
        title="Giving directions to a file"
        intro="A path is the list of folders you walk through to reach a file."
        steps={2}
      >
        <Reveal>
          <Anatomy />
        </Reveal>
        <Step n={1}>
          <div className="l5-absrel">
            <div className="l5-absrel-card">
              <p className="eyebrow">Absolute path</p>
              <h3>Starts with /</h3>
              <p>A full address from the root, like a postal address. Works from anywhere.</p>
              <code>/home/jason/scripts</code>
            </div>
            <div className="l5-absrel-card rel">
              <p className="eyebrow">Relative path</p>
              <h3>Starts from where you are</h3>
              <p>Like “second door on the left”: only makes sense from your current spot. Never starts with /.</p>
              <code>jason/scripts</code>
            </div>
          </div>
        </Step>
        <Step n={2}>
          <h3 className="sub">Path builder: move the pin, pick a destination</h3>
          <PathBuilder />
        </Step>
      </Section>
      <Section id="shortcuts" eyebrow="Three shortcuts" title=".   ..   ~" intro="You will type these every single day." tone="alt">
        <div className="l5-short">
          {shortcuts.map(([k, t, d], i) => (
            <Reveal key={k} className="l5-short-card" delay={i * 0.1}>
              <code>{k}</code>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
        <Callout>
          In code you use the same idea: import Header from &#39;./Header&#39; or &lt;img src=&quot;../images/logo.png&quot;&gt; are relative paths.
        </Callout>
      </Section>
    </>
  )
}
