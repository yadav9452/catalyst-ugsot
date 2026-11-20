import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Code, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'
import { applyChmod, modeToString, octal } from './permSim'

/* ---------- Symbolic mode builder ---------- */

function StringDiff({ before, after }) {
  const a = modeToString(before)
  const b = modeToString(after)
  return (
    <div className="l6-diff" aria-label={`Before ${a}, after ${b}`}>
      <span className="l6-diff-row">
        <small>before</small>
        <code>-{a}</code>
      </span>
      <span className="l6-diff-row">
        <small>after</small>
        <code>
          -
          {b.split('').map((ch, i) => (
            <motion.span
              key={i + ch}
              className={ch !== a[i] ? (ch === '-' ? 'is-off' : 'is-new') : ''}
              initial={{ y: ch !== a[i] ? -10 : 0 }}
              animate={{ y: 0 }}
            >
              {ch}
            </motion.span>
          ))}
        </code>
      </span>
    </div>
  )
}

function SymbolicBuilder() {
  const [who, setWho] = useState('u')
  const [op, setOp] = useState('+')
  const [perms, setPerms] = useState('x')
  const [mode, setMode] = useState(0o644)
  const sort = (v) => [...v].sort((x, y) => 'ugorwx'.indexOf(x) - 'ugorwx'.indexOf(y)).join('')
  const pickWho = (c) => {
    if (c === 'a') return setWho(who === 'a' ? '' : 'a')
    const base = who.replace('a', '')
    setWho(base.includes(c) ? base.replace(c, '') : sort(base + c))
  }
  const pickPerm = (c) => setPerms(perms.includes(c) ? perms.replace(c, '') : sort(perms + c))
  const spec = `${who}${op}${perms}`
  const valid = op === '=' || perms.length > 0
  const after = valid ? applyChmod(mode, spec) : mode
  return (
    <div className="l6-sym">
      <div className="l6-sym-pick">
        <div>
          <p className="l6-pick-label">1 · Whose permissions?</p>
          {[
            ['u', 'user'],
            ['g', 'group'],
            ['o', 'others'],
            ['a', 'all'],
          ].map(([c, t]) => (
            <button key={c} type="button" className={`l6-chip ${who.includes(c) ? 'is-on' : ''}`} onClick={() => pickWho(c)} aria-pressed={who.includes(c)}>
              {c}
              <small>{t}</small>
            </button>
          ))}
        </div>
        <div>
          <p className="l6-pick-label">2 · Add, remove or set exactly?</p>
          {[
            ['+', 'add'],
            ['-', 'remove'],
            ['=', 'set exactly'],
          ].map(([c, t]) => (
            <button key={c} type="button" className={`l6-chip ${op === c ? 'is-on' : ''}`} onClick={() => setOp(c)} aria-pressed={op === c}>
              {c}
              <small>{t}</small>
            </button>
          ))}
        </div>
        <div>
          <p className="l6-pick-label">3 · Which permissions?</p>
          {['r', 'w', 'x'].map((c) => (
            <button
              key={c}
              type="button"
              className={`l6-chip ${perms.includes(c) ? 'is-on' : ''}`}
              onClick={() => pickPerm(c)}
              aria-pressed={perms.includes(c)}
            >
              {c}
              <small>{{ r: 'read', w: 'write', x: 'execute' }[c]}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="l6-sym-out">
        <div className="l6-cmd">
          <span className="l6-prompt">$</span> chmod <b>{who || '?'}</b>
          <b className="op">{op}</b>
          <b>{perms}</b> deploy.sh
        </div>
        <StringDiff before={mode} after={after} />
        <div className="l6-sym-btns">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setMode(after)} disabled={!who || !valid || after === mode}>
            Run it
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMode(0o644)}>
            ↺ Back to rw-r--r--
          </button>
        </div>
        {op === '=' && <p className="small">= wipes that class first, then sets only what you picked.</p>}
      </div>
    </div>
  )
}

/* ---------- Numeric mode: add up 4, 2, 1 ---------- */

const VAL = { r: 4, w: 2, x: 1 }

export function OctalGrid({ mode, setMode, readOnly = false }) {
  const digits = octal(mode)
  return (
    <div className="l6-oct">
      <div className="l6-oct-grid" role="table" aria-label="Permission calculator">
        <div className="l6-oct-row l6-oct-th" role="row">
          <span role="columnheader" />
          {['r', 'w', 'x'].map((p) => (
            <span key={p} role="columnheader">
              {p} <small>= {VAL[p]}</small>
            </span>
          ))}
          <span role="columnheader">sum</span>
        </div>
        {[
          ['u', 'user', 6],
          ['g', 'group', 3],
          ['o', 'others', 0],
        ].map(([c, label, shift], k) => (
          <div key={c} className={`l6-oct-row l6c-${c}`} role="row">
            <span role="rowheader">{label}</span>
            {['r', 'w', 'x'].map((p) => {
              const bit = VAL[p] << shift
              const on = (mode & bit) !== 0
              return (
                <span key={p} role="cell">
                  <motion.button
                    type="button"
                    className={`l6-bit ${on ? 'is-on' : ''}`}
                    onClick={() => setMode(mode ^ bit)}
                    disabled={readOnly}
                    aria-pressed={on}
                    aria-label={`${label} ${p}`}
                    whileTap={{ scale: 0.85 }}
                  >
                    {on ? VAL[p] : 0}
                  </motion.button>
                </span>
              )
            })}
            <span role="cell" className="l6-oct-sum">
              <AnimatePresence mode="popLayout">
                <motion.b key={digits[k]} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}>
                  {digits[k]}
                </motion.b>
              </AnimatePresence>
            </span>
          </div>
        ))}
      </div>
      <div className="l6-oct-result">
        <code className="l6-oct-big">{digits}</code>
        <code>-{modeToString(mode)}</code>
        <span className="l6-prompt">chmod {digits} file</span>
      </div>
    </div>
  )
}

function NumericPlay() {
  const [mode, setMode] = useState(0o755)
  const [typed, setTyped] = useState('755')
  const set = (m) => {
    setMode(m)
    setTyped(octal(m))
  }
  return (
    <div className="l6-num">
      <OctalGrid mode={mode} setMode={set} />
      <label className="l6-dec-input">
        …or type a number
        <input
          value={typed}
          inputMode="numeric"
          maxLength={3}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-7]/g, '')
            setTyped(v)
            if (v.length === 3) setMode(parseInt(v, 8))
          }}
        />
      </label>
    </div>
  )
}

/* ---------- Real-world values ---------- */

const common = [
  ['644', 'Normal files', 'HTML, CSS, images, notes', '📄'],
  ['755', 'Scripts & folders', 'deploy.sh, site/, src/', '▶️'],
  ['600', 'Private files', '.env, SSH keys', '🔐'],
  ['700', 'Private folders', '~/.ssh', '🗄'],
  ['777', 'Anyone, anything', 'Avoid it!', '☠️'],
]

function CommonValues() {
  const [mode, setMode] = useState(0o644)
  return (
    <div className="l6-common">
      <div className="l6-common-cards">
        {common.map(([n, t, e, i]) => (
          <button
            key={n}
            type="button"
            className={`l6-common-card ${octal(mode) === n ? 'is-on' : ''} ${n === '777' ? 'is-danger' : ''}`}
            onClick={() => setMode(parseInt(n, 8))}
          >
            <b>{n}</b>
            <span>
              <span aria-hidden="true">{i}</span> {t}
            </span>
            <small>{e}</small>
          </button>
        ))}
      </div>
      <OctalGrid mode={mode} setMode={setMode} />
    </div>
  )
}

/* ---------- Challenge 3: write the command ---------- */

const ch3 = [
  ['Let the group edit notes.txt', 'letters', 'chmod g+w notes.txt'],
  ['Stop others from reading notes.txt', 'letters', 'chmod o-r notes.txt'],
  ['deploy.sh: everyone may run it, only you may edit it', 'numbers', 'chmod 755 deploy.sh'],
  ['Make .env private to you', 'numbers', 'chmod 600 .env'],
]

function Challenge3() {
  const [open, setOpen] = useState([])
  return (
    <ol className="l6-ch3">
      {ch3.map(([task, how, ans], i) => (
        <li key={task}>
          <span>
            {task} <em>({how})</em>
          </span>
          {open.includes(i) ? (
            <motion.code initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              {ans}
            </motion.code>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((o) => [...o, i])}>
              Show answer
            </button>
          )}
        </li>
      ))}
    </ol>
  )
}

export default function Chmod() {
  return (
    <>
      <Section
        id="chmod"
        eyebrow="Part 4 · Changing permissions"
        title="chmod in letters: who, add or remove, what"
        intro="chmod means change mode. Symbolic mode is perfect for small changes: chmod u+x deploy.sh lets the owner run the script."
        steps={2}
      >
        <Reveal>
          <SymbolicBuilder />
        </Reveal>
        <Step n={1} className="l6-two">
          <Code
            lines={['$ chmod u+x backup.sh', '$ ls -l backup.sh', '-rwxrw-r-- 1 ubuntu ubuntu 0 Feb 20 09:31 backup.sh']}
            caption="u+x: owner (u), add (+), execute (x)"
          />
          <figure className="l6-shot">
            <img src={img['chmod-ux-out']} alt="ls -l backup.sh now shows -rwxrw-r--" />
            <figcaption className="small">The deck’s real output: the owner now has x.</figcaption>
          </figure>
        </Step>
        <Step n={2}>
          <Callout label="Shortcuts">
            Leave out who and it means all: chmod +x deploy.sh. Change several classes at once with a comma: chmod g+w,o-r notes.txt. Only the file’s owner (or
            root) can chmod it.
          </Callout>
        </Step>
      </Section>

      <Section
        id="numeric"
        eyebrow="chmod in numbers"
        title="r = 4, w = 2, x = 1. Add them up."
        intro="Numeric (also called octal or absolute) mode sets everything at once with three digits: one each for user, group and others. Click the cells."
        tone="alt"
        steps={3}
      >
        <Reveal>
          <NumericPlay />
        </Reveal>
        <Step n={1}>
          <Callout label="To remove a permission">
            Just leave it out of the sum. chmod with a number replaces the whole setting, so 644 turns any x off.
          </Callout>
        </Step>
        <Step n={2}>
          <h3 className="sub">The values you’ll actually use</h3>
          <CommonValues />
        </Step>
        <Step n={3}>
          <h3 className="sub">Challenge 3: write the command</h3>
          <PauseBadge />
          <Challenge3 />
        </Step>
      </Section>

      <Section
        id="exercise"
        eyebrow="Worked example from the deck"
        title="reports.txt: user execute only, group read, others read + execute"
        intro="Work out each digit, then check: 1 · 4 · 5."
      >
        <div className="l6-two">
          <Reveal>
            <OctalGrid mode={0o145} setMode={() => {}} readOnly />
          </Reveal>
          <Reveal delay={0.1} className="l6-shot">
            <img src={img['chmod145-out']} alt="ls -l reports.txt shows ---xr--r-x after chmod 145" />
            <p className="small">After chmod 145 reports.txt</p>
          </Reveal>
        </div>
        <Callout label="Real life">
          145 is decoding practice only. A script’s owner needs r as well as x to run it. In real projects you’ll use the values above: 644, 755, 600, 700.
        </Callout>
      </Section>
    </>
  )
}
