import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'

/* ---------- The copy / move / delete lab (the Challenge 6 project) ---------- */

const start = () => ({
  project: [
    { id: 1, n: 'report.txt', v: 'Latest version' },
    { id: 2, n: 'draft.txt', v: 'Work in progress' },
  ],
  archive: [
    { id: 3, n: 'report.txt', v: 'Old version' },
    { id: 4, n: 'draft.txt', v: 'Important old draft' },
  ],
})

const optInfo = {
  '': 'no option',
  '-i': 'interactive: ask first',
  '-n': 'no-clobber: never overwrite',
  '-f': 'force: no questions',
}

function OpsLab() {
  const nextId = useRef(10)
  const [fs, setFs] = useState(start)
  const [cmd, setCmd] = useState('mv')
  const [opt, setOpt] = useState('-i')
  const [name, setName] = useState('report.txt')
  const [ask, setAsk] = useState(null) // { q, yes: () => void }
  const [say, setSay] = useState({ t: 'Pick a command, an option and a file, then press Run.', k: 'dim' })
  const [boom, setBoom] = useState(null)

  const line = cmd === 'rm' ? `rm ${opt ? opt + ' ' : ''}${name}` : `${cmd} ${opt ? opt + ' ' : ''}${name} archive/`

  function doIt() {
    const src = fs.project.find((f) => f.n === name)
    if (cmd === 'rm') {
      setBoom(src.id)
      setTimeout(() => setBoom(null), 500)
      setFs((s) => ({ ...s, project: s.project.filter((f) => f.n !== name) }))
      setSay({ t: `${name} is gone for good. There is no Trash or Recycle Bin in the terminal.`, k: 'err' })
      return
    }
    setFs((s) => {
      const moved = { ...src, id: nextId.current++ }
      return {
        project: cmd === 'mv' ? s.project.filter((f) => f.n !== name) : s.project,
        archive: [...s.archive.filter((f) => f.n !== name), moved],
      }
    })
    const replaced = fs.archive.some((f) => f.n === name)
    setSay({
      t:
        cmd === 'cp'
          ? `Copied. ${replaced ? `The old archive/${name} was replaced. ` : ''}The original stays in project/.`
          : `Moved. ${replaced ? `The old archive/${name} was replaced. ` : ''}It’s no longer in project/.`,
      k: replaced ? 'warn' : 'ok',
    })
  }

  function runIt() {
    setAsk(null)
    const src = fs.project.find((f) => f.n === name)
    if (cmd === 'rm' && opt === '-n') return setSay({ t: "rm: invalid option -- 'n'   (rm has no -n; use -i to be asked)", k: 'err' })
    if (!src) return setSay({ t: `${cmd}: cannot ${cmd === 'rm' ? 'remove' : 'stat'} '${name}': No such file or directory`, k: 'err' })
    if (cmd === 'rm') {
      if (opt === '-i') return setAsk({ q: `rm: remove regular file '${name}'?` })
      return doIt()
    }
    const clash = fs.archive.some((f) => f.n === name)
    if (clash && opt === '-n') return setSay({ t: `archive/${name} already exists, so -n left everything as it was. Nothing was overwritten.`, k: 'ok' })
    if (clash && opt === '-i') return setAsk({ q: `${cmd}: overwrite 'archive/${name}'?` })
    doIt()
  }

  return (
    <div className="l5-ops">
      <div className="l5-ops-ctl">
        <div>
          <p className="eyebrow">Command</p>
          <div className="l5-seg" role="group" aria-label="Command">
            {[
              ['cp', 'copy'],
              ['mv', 'move'],
              ['rm', 'delete'],
            ].map(([c, t]) => (
              <button key={c} type="button" className={cmd === c ? 'is-on' : ''} onClick={() => setCmd(c)}>
                {c} <small>{t}</small>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Option</p>
          <div className="l5-seg" role="group" aria-label="Option">
            {Object.keys(optInfo).map((o) => (
              <button key={o || 'none'} type="button" className={opt === o ? 'is-on' : ''} onClick={() => setOpt(o)} title={optInfo[o]}>
                {o || 'none'}
              </button>
            ))}
          </div>
          <small className="l5-muted">{optInfo[opt]}</small>
        </div>
        <div>
          <p className="eyebrow">File</p>
          <div className="l5-seg" role="group" aria-label="File">
            {['report.txt', 'draft.txt'].map((n) => (
              <button key={n} type="button" className={name === n ? 'is-on' : ''} onClick={() => setName(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="l5-ops-line">
        <code>
          <span className="l5-p">~/project$</span> {line}
        </code>
        <button type="button" className="btn btn-primary btn-sm" onClick={runIt}>
          Run ▶
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setFs(start())
            setAsk(null)
            setSay({ t: 'Reset to the starting files.', k: 'dim' })
          }}
        >
          ↺ Reset
        </button>
      </div>
      <AnimatePresence>
        {ask && (
          <motion.div className="l5-ops-ask" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <code>{ask.q}</code>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setAsk(null)
                doIt()
              }}
            >
              y (yes)
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setAsk(null)
                setSay({ t: 'You answered n, so nothing changed. That’s what -i is for.', k: 'ok' })
              }}
            >
              n (no)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="l5-ops-cols">
        {[
          ['project', 'project/'],
          ['archive', 'project/archive/'],
        ].map(([k, t]) => (
          <div key={k} className={`l5-ops-col c-${k}`}>
            <p className="l5-ops-head">📁 {t}</p>
            <ul>
              <AnimatePresence>
                {fs[k].map((f) => (
                  <motion.li
                    key={f.id}
                    layout
                    className={`l5-ops-file ${boom === f.id ? 'is-boom' : ''}`}
                    initial={{ opacity: 0, x: k === 'archive' ? -60 : 0, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.3, rotate: cmd === 'rm' ? -20 : 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                  >
                    <span aria-hidden="true">📄</span>
                    <strong>{f.n}</strong>
                    <small>{f.v}</small>
                  </motion.li>
                ))}
              </AnimatePresence>
              {!fs[k].length && <li className="l5-muted">(empty)</li>}
            </ul>
          </div>
        ))}
      </div>
      <p className={`l5-ops-say s-${say.k}`} aria-live="polite">
        {say.t}
      </p>
    </div>
  )
}

const tasks6 = [
  ['Safe move', 'Move report.txt into archive/, but decide yourself before anything is overwritten.', 'mv -i report.txt archive/'],
  ['Force move', 'You are 100% sure. Overwrite with no question asked.', 'mv -f report.txt archive/'],
  ['Protect the old draft', 'Move draft.txt into archive/, but never overwrite the important old draft.', 'mv -n draft.txt archive/'],
]

function Tasks6() {
  const [open, setOpen] = useState([])
  return (
    <div className="l5-t6">
      {tasks6.map(([t, d, a], i) => (
        <div key={t} className="l5-t6-card">
          <p className="eyebrow">Task {i + 1}</p>
          <h3>{t}</h3>
          <p>{d}</p>
          {open.includes(i) ? (
            <code className="l5-hint">{a}</code>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((o) => [...o, i])}>
              Show solution
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

const syntax = [
  ['cp source destination', 'Copy: the original stays.', 'cp notes.txt backup/'],
  ['cp -r folder destination', 'Copy a folder and everything in it (-r = recursive).', 'cp -r project/ project-backup/'],
  ['mv source destination', 'Move: the original disappears from its old place.', 'mv notes.txt archive/'],
  ['mv old-name new-name', 'Rename: just “move” it to a new name. Folders too, no -r needed.', 'mv draft.txt final.txt'],
  ['rm file', 'Delete a file. Several at once: rm a.log b.log', 'rm file.txt'],
  ['rm -r folder', 'Delete a folder with everything inside. Careful!', 'rm -r old-project/'],
  ['rmdir folder', 'Delete a folder only if it’s empty. The safe choice.', 'rmdir -p temp/old'],
]

export default function FileOps() {
  return (
    <>
      <Section
        id="file-ops"
        eyebrow="Part 9 · Copy, move, rename, delete"
        title="cp, mv and rm"
        intro="Source first, destination last. That’s the whole pattern for cp and mv."
        steps={1}
      >
        <div className="l5-syntax">
          {syntax.map(([c, d, eg], i) => (
            <Reveal key={c} className="l5-syntax-row" delay={i * 0.05}>
              <code>{c}</code>
              <span>{d}</span>
              <code className="l5-muted">{eg}</code>
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <div className="l5-norm">
            <span className="l5-norm-icon" aria-hidden="true">
              ⚠
            </span>
            <div>
              <h3>Before you rm: there is no undo</h3>
              <ul>
                <li>No Recycle Bin, no Trash. Deleted means deleted.</li>
                <li>
                  Use <code>rm -i</code> to be asked before each file.
                </li>
                <li>
                  Check a wildcard with ls first: <code>ls *.log</code>, then <code>rm *.log</code>.
                </li>
                <li>
                  Never run <code>rm -rf</code> on <code>/</code> or <code>~</code>.
                </li>
              </ul>
            </div>
          </div>
        </Step>
      </Section>
      <Section
        id="ops-lab"
        eyebrow="Lab · Challenge 6"
        title="Overwrite or not? You decide"
        intro="project/ has the latest files; archive/ has older copies with the same names. Try every option and watch what survives."
        tone="alt"
      >
        <Reveal>
          <OpsLab />
        </Reveal>
        <h3 className="sub">Now solve Challenge 6</h3>
        <Tasks6 />
        <Callout>Deploy scripts copy new code over old files all day. Knowing -i, -n and -f is how you avoid wiping the wrong thing.</Callout>
      </Section>
    </>
  )
}
