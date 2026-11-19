import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { OsKeys, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { terminalKeys } from '../../../course/shortcuts'
import { HOME, complete, makeFs, run, shortPath } from './shellSim'

/* ---------- Reading the prompt ---------- */

const promptParts = [
  ['student', 'user', 'Who you are logged in as'],
  ['@', 'at', '“at”'],
  ['laptop', 'host', 'The computer’s name'],
  [':', 'sep', 'Separator'],
  ['~', 'dir', 'The folder you are in (~ = your home folder)'],
  ['$', 'sign', 'Ready for a command. # would mean you are root, the all-powerful admin'],
]

function Prompt() {
  const [k, setK] = useState('dir')
  const part = promptParts.find((p) => p[1] === k)
  return (
    <div className="l4-prompt">
      <div className="l4-prompt-line" role="group" aria-label="Parts of the prompt">
        {promptParts.map(([t, key]) => (
          <button
            key={key}
            type="button"
            className={`l4-pp l4-pp-${key} ${k === key ? 'is-on' : ''}`}
            onMouseEnter={() => setK(key)}
            onFocus={() => setK(key)}
            onClick={() => setK(key)}
          >
            {t}
          </button>
        ))}
        <span className="tty-caret" aria-hidden="true" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={k}
          className="l4-prompt-info"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          aria-live="polite"
        >
          <code>{part[0]}</code> {part[2]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Build a command ---------- */

const optChoices = [
  ['', 'none'],
  ['-l', '-l (long)'],
  ['-a', '-a (all, incl. hidden)'],
  ['-la', '-la (both)'],
]
const argChoices = [
  ['', 'here'],
  ['/home', '/home'],
  ['/etc', '/etc'],
]

function Builder() {
  const [opt, setOpt] = useState('-l')
  const [arg, setArg] = useState('/home')
  const line = ['ls', opt, arg].filter(Boolean).join(' ')
  const res = run(line, { cwd: HOME, fs: makeFs(), history: [] })
  return (
    <div className="l4-builder">
      <div className="l4-builder-ctl">
        <div>
          <p className="l4-builder-lbl">
            <span className="l4-tok-command">command</span> what to do
          </p>
          <span className="l4-chip is-on">ls</span>
        </div>
        <div>
          <p className="l4-builder-lbl">
            <span className="l4-tok-option">option</span> how to do it
          </p>
          {optChoices.map(([v, t]) => (
            <button key={t} type="button" className={`l4-chip ${opt === v ? 'is-on' : ''}`} aria-pressed={opt === v} onClick={() => setOpt(v)}>
              {t}
            </button>
          ))}
        </div>
        <div>
          <p className="l4-builder-lbl">
            <span className="l4-tok-argument">argument</span> what to do it on
          </p>
          {argChoices.map(([v, t]) => (
            <button key={t} type="button" className={`l4-chip ${arg === v ? 'is-on' : ''}`} aria-pressed={arg === v} onClick={() => setArg(v)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="tty">
        <div className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          {line}
        </div>
        <div className="tty-body">
          <p>
            <span className="tty-prompt">student@laptop:~$</span> <span className="l4-tok l4-tok-command">ls</span>
            {opt && (
              <>
                {' '}
                <span className="l4-tok l4-tok-option">{opt}</span>
              </>
            )}
            {arg && (
              <>
                {' '}
                <span className="l4-tok l4-tok-argument">{arg}</span>
              </>
            )}
          </p>
          {res.out.map((o, i) => (
            <p key={i} className="tty-out">
              {o}
            </p>
          ))}
        </div>
      </div>
      <p className="l4-builder-note">Spaces separate the parts, and capitals matter: LS is not ls.</p>
    </div>
  )
}

/* ---------- Practice terminal with a checklist ---------- */

const tasks = [
  ['pwd', 'Find out which folder you are in'],
  ['whoami', 'Print your username'],
  ['ls', 'List the files here'],
  ['echo $SHELL', 'Find out which shell you are using'],
  ['uname -a', 'Show the kernel name and version'],
]

function Practice() {
  const [state, setState] = useState({ cwd: HOME, fs: makeFs(), history: [] })
  const [log, setLog] = useState([])
  const [line, setLine] = useState('')
  const [hist, setHist] = useState(-1)
  const [done, setDone] = useState([])
  const input = useRef(null)
  const body = useRef(null)

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight
  }, [log])

  function submit(e) {
    e.preventDefault()
    const typed = line.trim()
    const history = typed ? [...state.history, typed] : state.history
    const res = run(typed, { ...state, history })
    const prompt = `student@laptop:${shortPath(state.cwd)}$`
    setLog((l) => (res.clear ? [] : [...l, { prompt, cmd: typed, out: res.out }].slice(-40)))
    setState({ cwd: res.cwd, fs: res.fs, history })
    const norm = typed.replace(/\s+/g, ' ')
    const hit = tasks.find(([t]) => t === norm)
    if (hit && !done.includes(hit[0])) setDone((d) => [...d, hit[0]])
    setLine('')
    setHist(-1)
  }
  function onKey(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      setLine((l) => complete(l, state))
    } else if (e.key === 'ArrowUp' && state.history.length) {
      e.preventDefault()
      const n = hist < 0 ? state.history.length - 1 : Math.max(0, hist - 1)
      setHist(n)
      setLine(state.history[n])
    } else if (e.key === 'ArrowDown' && hist >= 0) {
      e.preventDefault()
      const n = hist + 1
      if (n >= state.history.length) {
        setHist(-1)
        setLine('')
      } else {
        setHist(n)
        setLine(state.history[n])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLog([])
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      setLog((l) => [...l, { prompt: `student@laptop:${shortPath(state.cwd)}$`, cmd: line + '^C', out: [] }])
      setLine('')
    }
  }
  const all = done.length === tasks.length
  return (
    <div className="l4-practice">
      <div className="tty l4-practice-tty">
        <div className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          student@laptop: {shortPath(state.cwd)}
        </div>
        <div className="tty-body l4-practice-body" ref={body} onClick={() => input.current?.focus()} role="presentation">
          {log.length === 0 && <p className="tty-dim">Practice terminal. Try the tasks on the right. Tab completes, ↑ repeats, help lists commands.</p>}
          {log.map((l, i) => (
            <div key={i}>
              <p>
                <span className="tty-prompt">{l.prompt}</span> {l.cmd}
              </p>
              {l.out.map((o, j) => (
                <p key={j} className="tty-out">
                  {o}
                </p>
              ))}
            </div>
          ))}
          <form onSubmit={submit} className="tty-input">
            <label htmlFor="l4-cli" className="tty-prompt">
              student@laptop:{shortPath(state.cwd)}$
            </label>
            <input
              id="l4-cli"
              ref={input}
              value={line}
              onChange={(e) => setLine(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="Type a command"
            />
          </form>
        </div>
      </div>
      <div className="l4-tasks">
        <p className="eyebrow">Your first five commands</p>
        <ol>
          {tasks.map(([c, d]) => (
            <li key={c} className={done.includes(c) ? 'is-done' : ''}>
              <span className="l4-task-box" aria-hidden="true">
                {done.includes(c) ? '✓' : ''}
              </span>
              <span>
                <code>{c}</code>
                <small>{d}</small>
              </span>
            </li>
          ))}
        </ol>
        <div className="l4-task-bar" aria-hidden="true">
          <motion.i animate={{ width: `${(done.length / tasks.length) * 100}%` }} />
        </div>
        <p className="l4-task-msg" aria-live="polite">
          {all ? '🎉 All five done. You just used the terminal like a developer.' : `${done.length} of ${tasks.length} done`}
        </p>
        <p className="l4-task-more">Then explore: cd projects, cd .., ls -la, cat notes.txt, history, man ls</p>
      </div>
    </div>
  )
}

const help = [
  ['man ls', 'Open the manual for ls (press q to quit)'],
  ['ls --help', 'A quick summary of the options'],
  ['Tab', 'Completes names for you'],
  ['↑', 'Brings back your last command'],
  ['Ctrl + C', 'Stops a command that is running. On a Mac too: it’s the Control key, not Cmd'],
  ['command not found', 'Just a typo, or a program that isn’t installed. Check the spelling.'],
]

export default function HandsOn() {
  return (
    <>
      <Section
        id="hands-on"
        eyebrow="Part 6 · Your first terminal session"
        title="Read the prompt, build a command"
        intro="Open your terminal now (Ubuntu on WSL, Terminal on a Mac, or your Ubuntu VM) and follow along."
        steps={3}
      >
        <h3 className="sub">Reading the prompt: hover each part</h3>
        <Reveal>
          <Prompt />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">Anatomy of a command: ls -l /home</h3>
          <Builder />
        </Step>
        <Step n={2}>
          <h3 className="sub">Getting help and getting unstuck</h3>
          <div className="l4-help">
            {help.map(([k, d]) => (
              <div key={k} className="l4-help-card">
                <kbd>{k}</kbd>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </Step>
        <Step n={3}>
          <OsKeys
            title="Windows vs Mac: the keys you’ll use every day"
            rows={terminalKeys}
            note="Inside a terminal, a Mac uses the Control key for Ctrl shortcuts. Cmd + C on a Mac copies text; it does not stop a command."
          />
        </Step>
      </Section>
      <Section
        id="practice"
        eyebrow="Pause and try"
        title="Your first five commands"
        intro="Type each command in the practice terminal, or in your real one. The checklist ticks itself."
        tone="alt"
      >
        <Reveal>
          <Practice />
        </Reveal>
        <PauseBadge>Mac users: uname prints Darwin, not Linux. That’s expected: it’s macOS’s own UNIX-based kernel.</PauseBadge>
      </Section>
    </>
  )
}
