import { motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { modeToString, octal, stringToMode } from './permSim'

const CLASSES = [
  ['u', 'User (owner)'],
  ['g', 'Group'],
  ['o', 'Others'],
]
const NAMES = { r: 'read', w: 'write', x: 'execute' }

/** Click letters to switch them on and off, or type a whole string. */
export function Decoder({ start = 'rw-r--r--', showNumber = true }) {
  const [mode, setMode] = useState(stringToMode(start))
  const [typed, setTyped] = useState('-' + start)
  const str = modeToString(mode)
  const flip = (i) => {
    const m = mode ^ (1 << (8 - i))
    setMode(m)
    setTyped((t) => (t[0] === 'd' ? 'd' : '-') + modeToString(m))
  }
  const onType = (v) => {
    setTyped(v)
    const body = v.length === 10 ? v.slice(1) : v
    const m = stringToMode(body)
    if (m !== null) setMode(m)
  }
  const valid = stringToMode(typed.length === 10 ? typed.slice(1) : typed) !== null
  return (
    <div className="l6-dec">
      <label className="l6-dec-input">
        Type a permission string
        <input value={typed} onChange={(e) => onType(e.target.value.trim())} maxLength={10} spellCheck="false" className={valid ? '' : 'is-bad'} />
      </label>
      <div className="l6-dec-sets">
        {CLASSES.map(([c, label], k) => (
          <div key={c} className={`l6-dec-set l6c-${c}`}>
            <p>{label}</p>
            <div className="l6-dec-letters">
              {['r', 'w', 'x'].map((p, j) => {
                const i = k * 3 + j
                const on = str[i] !== '-'
                return (
                  <motion.button
                    key={p}
                    type="button"
                    className={`l6-bit ${on ? 'is-on' : ''}`}
                    onClick={() => flip(i)}
                    aria-pressed={on}
                    aria-label={`${label}: ${NAMES[p]} ${on ? 'allowed' : 'not allowed'}`}
                    whileTap={{ scale: 0.85 }}
                  >
                    {on ? p : '-'}
                  </motion.button>
                )
              })}
            </div>
            <ul>
              {['r', 'w', 'x'].map((p, j) => (
                <li key={p} className={str[k * 3 + j] !== '-' ? 'yes' : 'no'}>
                  {str[k * 3 + j] !== '-' ? '✓' : '✗'} {NAMES[p]}
                </li>
              ))}
            </ul>
            {showNumber && <b className="l6-dec-num">{octal(mode)[k]}</b>}
          </div>
        ))}
      </div>
      {showNumber && (
        <p className="l6-dec-total">
          As a number: <code>chmod {octal(mode)}</code> <span className="small">(you’ll learn this in Part 4)</span>
        </p>
      )}
    </div>
  )
}

/** A challenge: answer each question, then check. */
function Challenge({ title, str, qs }) {
  const [picked, setPicked] = useState({})
  const [checked, setChecked] = useState(false)
  return (
    <div className="l6-chal">
      <div className="l6-chal-head">
        <span className="l6-chal-tag">{title}</span>
        <code className="l6-chal-str">{str}</code>
      </div>
      <ol className="l6-chal-qs">
        {qs.map(([q, opts, a], i) => (
          <li key={q}>
            <span>{q}</span>
            <div>
              {opts.map((o, j) => {
                const mine = picked[i] === j
                const state = checked ? (j === a ? 'is-right' : mine ? 'is-wrong' : '') : mine ? 'is-on' : ''
                return (
                  <button
                    key={o}
                    type="button"
                    className={`l6-opt ${state}`}
                    onClick={() => !checked && setPicked((p) => ({ ...p, [i]: j }))}
                    aria-pressed={mine}
                  >
                    {o}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>
      <div className="l6-chal-foot">
        {!checked ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setChecked(true)}>
            Check my answers
          </button>
        ) : (
          <>
            <motion.strong initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              {qs.filter(([, , a], i) => picked[i] === a).length} / {qs.length} right
            </motion.strong>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setPicked({})
                setChecked(false)
              }}
            >
              ↺ Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const yn = ['Allowed', 'Not allowed']

export default function Reading() {
  return (
    <Section
      id="read"
      eyebrow="Reading permission strings"
      title="Split it into three, read left to right"
      intro="rw-r--r-- is three sets of three: the owner’s, the group’s, and everyone else’s. A letter means allowed, a dash means not allowed."
      tone="alt"
      steps={2}
    >
      <Reveal>
        <Decoder />
      </Reveal>
      <Callout label="Key rule">The order never changes: r, then w, then x. A dash in a position means that permission is missing.</Callout>
      <Step n={1}>
        <h3 className="sub">Challenge 1</h3>
        <PauseBadge>Pause and answer before you check</PauseBadge>
        <Challenge
          title="Decode one set"
          str="r-x"
          qs={[
            ['Read?', yn, 0],
            ['Write?', yn, 1],
            ['Execute?', yn, 0],
          ]}
        />
      </Step>
      <Step n={2}>
        <h3 className="sub">Challenge 2: a whole line</h3>
        <Challenge
          title="Decode it"
          str="-rwxr-x---"
          qs={[
            ['Is it a file or a directory?', ['A regular file', 'A directory'], 0],
            ['What can the owner do?', ['Read only', 'Read and write', 'Read, write and run'], 2],
            ['What can the group do?', ['Nothing', 'Read and run', 'Everything'], 1],
            ['What can everyone else do?', ['Nothing', 'Read only', 'Read and run'], 0],
          ]}
        />
      </Step>
    </Section>
  )
}
