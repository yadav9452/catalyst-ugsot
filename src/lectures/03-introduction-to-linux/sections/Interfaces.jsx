import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Callout, PauseBadge, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- GUI: three clicks and some typing ---------- */

const guiSteps = [
  'Right-click on the desktop (on a Mac: two-finger click, or Control + click)',
  'Choose “New Folder”',
  'Type the name and press Enter (Return on a Mac)',
]

function GuiPane() {
  const [stage, setStage] = useState(0)
  const done = stage >= guiSteps.length
  return (
    <div className="pane gui-pane">
      <div className="pane-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        Desktop (GUI)
      </div>
      <div className="gui-desk">
        <AnimatePresence>
          {stage === 1 && (
            <motion.ul className="ctx-menu" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <li className="on">New Folder</li>
              <li>Get Info</li>
              <li>Change Wallpaper…</li>
            </motion.ul>
          )}
        </AnimatePresence>
        {stage >= 2 && (
          <motion.div className="gui-folder" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
            <img src={img.folder} alt="" />
            <span className={done ? '' : 'is-editing'}>{done ? 'projects' : 'untitled folder'}</span>
          </motion.div>
        )}
        {stage === 0 && <img className="gui-cursor" src={img.cursor} alt="" />}
      </div>
      <div className="pane-foot">
        {done ? (
          <>
            <span className="pane-done">✓ Done in 3 actions</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStage(0)}>
              Reset
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setStage((s) => s + 1)}>
            {stage + 1}. {guiSteps[stage]}
          </button>
        )}
      </div>
    </div>
  )
}

/* ---------- CLI: a tiny pretend shell ---------- */

function run(cmd, files) {
  const [name, ...args] = cmd.trim().split(/\s+/)
  if (!name) return { out: [] }
  switch (name) {
    case 'mkdir':
      if (!args.length) return { out: ['mkdir: missing folder name. Try: mkdir projects'] }
      if (args.some((a) => files.includes(a))) return { out: [`mkdir: ${args.find((a) => files.includes(a))}: File exists`] }
      return { out: [], files: [...files, ...args] }
    case 'ls':
      return { out: [files.length ? files.join('   ') : '(empty folder)'] }
    case 'pwd':
      return { out: ['/home/student'] }
    case 'whoami':
      return { out: ['student'] }
    case 'rm':
      return { out: ['rm deletes files for good, so it’s switched off in this practice shell. We’ll use it carefully in a later lecture.'] }
    case 'clear':
      return { clear: true }
    case 'help':
      return { out: ['Try: mkdir projects · ls · pwd · whoami · clear'] }
    default:
      return { out: [`${name}: command not found. Type help to see what works here.`] }
  }
}

function CliPane() {
  const [files, setFiles] = useState([])
  const [log, setLog] = useState([])
  const [cmd, setCmd] = useState('')
  const input = useRef(null)
  function submit(e) {
    e.preventDefault()
    const r = run(cmd, files)
    if (r.clear) setLog([])
    else setLog((l) => [...l, { cmd, out: r.out }].slice(-8))
    if (r.files) setFiles(r.files)
    setCmd('')
  }
  return (
    <div className="pane term" onClick={() => input.current?.focus()}>
      <div className="term-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        Terminal (CLI)
      </div>
      <div className="term-body cli-body">
        {log.length === 0 && <p className="term-out">Type mkdir projects and press Enter. Then type ls.</p>}
        {log.map((l, i) => (
          <div key={i}>
            <p>
              <span className="term-prompt">$</span> {l.cmd}
            </p>
            {l.out.map((o) => (
              <p key={o} className="term-out">
                {o}
              </p>
            ))}
          </div>
        ))}
        <form onSubmit={submit} className="term-input">
          <label htmlFor="cli-in" className="term-prompt">
            $
          </label>
          <input
            id="cli-in"
            ref={input}
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            placeholder="mkdir projects"
            autoComplete="off"
            spellCheck="false"
            aria-label="Type a command"
          />
        </form>
      </div>
      <div className="pane-foot dark">
        {files.length ? <span className="pane-done">✓ Done in 1 line</span> : <span>One line, then Enter</span>}
        <span className="cli-files" aria-label="Folders created">
          {files.slice(-6).map((f) => (
            <span key={f}>📁 {f}</span>
          ))}
        </span>
      </div>
    </div>
  )
}

/* ---------- Now do it 50 times ---------- */

function FiftyTimes() {
  const [made, setMade] = useState(false)
  return (
    <div className="fifty">
      <div className="fifty-side">
        <p className="eyebrow">GUI</p>
        <p className="fifty-big">≈150</p>
        <p>clicks, plus typing 50 names by hand</p>
      </div>
      <div className="fifty-side dark">
        <p className="eyebrow">CLI</p>
        <code>mkdir project-{'{1..50}'}</code>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setMade((m) => !m)}>
          {made ? 'Reset' : '▶ Run it'}
        </button>
        <div className="fifty-grid" aria-hidden="true">
          {made &&
            Array.from({ length: 50 }).map((_, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.015 }}>
                📁
              </motion.span>
            ))}
        </div>
        <p aria-live="polite">{made ? '50 folders, one line. Same command works next week, on any Linux server.' : 'One line makes all 50.'}</p>
      </div>
    </div>
  )
}

export default function Interfaces() {
  return (
    <Section
      id="interfaces"
      eyebrow="Job 1 up close"
      title="Two ways to talk to an OS: GUI and CLI"
      intro="A graphical user interface (GUI) uses windows, icons and a mouse. A command line interface (CLI) uses typed commands."
      steps={5}
    >
      <div className="card-grid two">
        <Step n={1} className="card iface-card">
          <img src={img['gui-launchpad']} alt="A macOS screen full of app icons" />
          <h3>Graphical User Interface (GUI)</h3>
          <p>Point and click. Easy to learn, and you can see everything.</p>
        </Step>
        <Step n={2} className="card iface-card">
          <img className="contain" src={img['cli-terminal']} alt="A dark terminal window with a command typed in" />
          <h3>Command Line Interface (CLI)</h3>
          <p>Type a command, press Enter. Fast, exact, and easy to repeat.</p>
        </Step>
      </div>

      <Step n={3}>
        <h3 className="sub">Same task, two ways: make a folder called “projects”</h3>
        <div className="panes">
          <GuiPane />
          <CliPane />
        </div>
        <PauseBadge>Pause the video and try both. Then type ls in the terminal.</PauseBadge>
      </Step>

      <Step n={4}>
        <h3 className="sub">Now make 50 folders</h3>
        <FiftyTimes />
      </Step>

      <Callout step={5} label="As a developer">
        Servers usually have no screen at all, so developers manage them through the CLI. We start practising it in Lecture 4.
      </Callout>
    </Section>
  )
}
