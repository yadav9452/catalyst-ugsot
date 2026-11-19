import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { globToRegex } from './fsSim'

/* ---------- Name checker ---------- */

const SPECIAL = /[<>|:&;*?"'\\!$#(){}[\]`]/g

function suggest(n) {
  const dot = n.lastIndexOf('.')
  const ext = dot > 0 ? n.slice(dot).toLowerCase() : ''
  const base = (dot > 0 ? n.slice(0, dot) : n).replace(SPECIAL, '').trim().replace(/\s+/g, '_').replace(/^-+/, '').toLowerCase()
  return (base || 'file') + ext.replace(SPECIAL, '')
}

function Checker() {
  const [n, setN] = useState('My Project Final Version.txt')
  const specials = [...new Set(n.match(SPECIAL) ?? [])]
  const words = n.trim().split(/\s+/).filter(Boolean)
  const checks = [
    { ok: !/\s/.test(n), t: 'No spaces', bad: 'Has spaces: the shell splits the name into separate words' },
    { ok: !specials.length, t: 'No special characters', bad: `Special characters: ${specials.join(' ')} mean something to the shell` },
    { ok: !n.startsWith('-'), t: 'Doesn’t start with -', bad: 'Starts with -, so commands think it’s an option' },
    { ok: n.length > 0 && n.length <= 255, t: 'Not empty, not huge', bad: 'Names must be 1 to 255 characters' },
  ]
  const good = checks.every((c) => c.ok)
  return (
    <div className="l5-check">
      <label className="l5-check-in">
        <span className="eyebrow">Type a file name</span>
        <input value={n} onChange={(e) => setN(e.target.value)} spellCheck="false" maxLength={80} />
      </label>
      <div className="l5-check-presets">
        {['My Project Final Version.txt', 'project_final_v2.txt', 'report:2026?.pdf', '-notes.txt', 'Photo.JPG'].map((p) => (
          <button key={p} type="button" className="l5-chip" onClick={() => setN(p)}>
            {p}
          </button>
        ))}
      </div>
      <ul className="l5-check-list">
        {checks.map((c) => (
          <li key={c.t} className={c.ok ? 'ok' : 'bad'}>
            <span aria-hidden="true">{c.ok ? '✓' : '✗'}</span> {c.ok ? c.t : c.bad}
          </li>
        ))}
        {/[A-Z]/.test(n) && (
          <li className="info">
            <span aria-hidden="true">i</span> Capitals are allowed, but Linux is case-sensitive: {n} and {n.toLowerCase()} are two different files.
          </li>
        )}
      </ul>
      <motion.div key={good ? 'g' : 'b'} className={`l5-check-verdict ${good ? 'good' : 'bad'}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
        {good ? (
          <strong>✓ Good name</strong>
        ) : (
          <>
            <strong>✗ Risky name.</strong> Better: <code>{suggest(n)}</code>
          </>
        )}
      </motion.div>
      {words.length > 1 && (
        <div className="l5-check-split">
          <p>
            <code>rm {n}</code> is read by the shell as <strong>{words.length} separate files</strong>:
          </p>
          <div>
            {words.map((w, i) => (
              <span key={i} className="l5-check-word">
                {w}
              </span>
            ))}
          </div>
          <p className="l5-muted">
            It would try to delete each of them! You’d have to write <code>rm &quot;{n}&quot;</code>. Easier to never use spaces.
          </p>
        </div>
      )}
    </div>
  )
}

/* ---------- Wildcard playground ---------- */

const files = [
  'app.log',
  'error.log',
  'debug.log',
  'a.txt',
  'notes.txt',
  'file0.txt',
  'file1.txt',
  'file2.txt',
  'file3.txt',
  'file10.txt',
  'fileA.txt',
  'filea.txt',
  'fileb.txt',
  'filec.txt',
  'photo.png',
  'report.pdf',
]

const presets = [
  ['*.log', 'every .log file'],
  ['*.txt', 'every .txt file'],
  ['file?.txt', 'file + exactly one character'],
  ['file[123].txt', 'one character from 1, 2, 3'],
  ['file[a-c].txt', 'one character from a to c'],
  ['file[0-9].txt', 'one digit'],
  ['*', 'everything'],
]

function Wildcards() {
  const [pat, setPat] = useState('*.log')
  let re = null
  try {
    re = globToRegex(pat.trim())
  } catch {
    re = null
  }
  const hits = re && pat.trim() ? files.filter((f) => re.test(f)) : []
  return (
    <div className="l5-wild">
      <div className="l5-wild-in">
        <code className="l5-p">$ ls</code>
        <input value={pat} onChange={(e) => setPat(e.target.value)} aria-label="Wildcard pattern" spellCheck="false" maxLength={30} />
        <span className="l5-wild-count">
          {hits.length} match{hits.length === 1 ? '' : 'es'}
        </span>
      </div>
      <div className="l5-wild-presets">
        {presets.map(([p, d]) => (
          <button key={p} type="button" className={`l5-chip ${pat === p ? 'is-on' : ''}`} onClick={() => setPat(p)}>
            {p}
            <small>{d}</small>
          </button>
        ))}
      </div>
      <ul className="l5-wild-files">
        {files.map((f) => {
          const on = hits.includes(f)
          return (
            <motion.li
              key={f}
              className={on ? 'is-on' : ''}
              animate={{ scale: on ? 1.04 : 1, opacity: on || !hits.length ? 1 : 0.35 }}
              transition={{ duration: 0.2 }}
            >
              {f}
            </motion.li>
          )
        })}
      </ul>
      <AnimatePresence>
        {hits.length > 0 && pat.includes('*') && (
          <motion.p className="l5-wild-warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            ⚠ <code>rm {pat}</code> would delete these {hits.length} file{hits.length === 1 ? '' : 's'}. That’s why you check with ls first.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const table = [
  ['*', 'zero or more characters', 'ls *.txt', 'a.txt, notes.txt'],
  ['?', 'exactly one character', 'ls file?.txt', 'file1.txt, fileA.txt (not file10.txt)'],
  ['[ ]', 'one character from a set', 'ls file[123].txt', 'file1.txt, file2.txt, file3.txt'],
  ['[a-z]', 'one character in a range', 'ls file[a-c].txt', 'filea.txt, fileb.txt, filec.txt'],
  ['[0-9]', 'one digit', 'ls file[0-9].txt', 'file0.txt to file9.txt'],
]

export default function Names() {
  return (
    <>
      <Section
        id="names"
        eyebrow="Part 10 · Naming rules"
        title="Good names save you trouble"
        intro="Linux allows almost any name, but some names fight the shell. Type a name and see."
        steps={1}
      >
        <div className="l5-rules">
          {['Case-sensitive: File.txt ≠ file.txt', 'Avoid spaces', 'Join words with _ or -', 'Avoid > < | : & ; * ? and friends'].map((r, i) => (
            <Reveal key={r} className="l5-rule" delay={i * 0.08}>
              {r}
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <Checker />
        </Step>
      </Section>
      <Section
        id="wildcards"
        eyebrow="Part 11 · Wildcards"
        title="Match many files at once"
        intro="Instead of typing every name, describe a pattern. Try the presets, then write your own."
        tone="alt"
      >
        <Reveal>
          <Wildcards />
        </Reveal>
        <div className="l5-table-wrap">
          <table className="l5-table">
            <thead>
              <tr>
                <th>Wildcard</th>
                <th>Matches</th>
                <th>Example</th>
                <th>Finds</th>
              </tr>
            </thead>
            <tbody>
              {table.map(([w, m, e, f]) => (
                <tr key={w}>
                  <td>
                    <code>{w}</code>
                  </td>
                  <td>{m}</td>
                  <td>
                    <code>{e}</code>
                  </td>
                  <td className="l5-muted">{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PauseBadge>Try ls *.log in your terminal on the files you made earlier.</PauseBadge>
        <Callout>Wildcards show up in developer tools too: .gitignore lines like *.log, and build tools matching src/**/*.js.</Callout>
      </Section>
    </>
  )
}
