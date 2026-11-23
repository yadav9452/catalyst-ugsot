import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { complete, freshState, run } from './aptSim'

const fresh = (welcome, setup) => ({
  ...(setup ? setup(freshState()) : freshState()),
  lines: welcome.map((t) => ({ t, k: 'dim' })),
  history: [],
  events: [],
})

/**
 * A practice terminal that behaves like apt on Ubuntu, with an optional
 * checklist that ticks itself.
 * tasks: [{ label, hint, done: (state) => boolean }]
 * state.events: every command run so far, as { cmd, sub, args, sudo, ok }.
 * setup: optional function that changes the starting state (e.g. run apt update already).
 */
export default function Terminal({
  tasks = [],
  welcome = ['Type help to see the commands. Tab completes names, ↑ repeats.'],
  title = 'student@laptop: ~',
  label,
  setup,
  height,
}) {
  const [st, setSt] = useState(() => fresh(welcome, setup))
  const [input, setInput] = useState('')
  const [hist, setHist] = useState(-1)
  const [shown, setShown] = useState([])
  const body = useRef(null)
  const field = useRef(null)

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight
  }, [st.lines])

  function submit(e) {
    e.preventDefault()
    const line = input
    const r = run(line, st)
    const words = line.trim().split(/\s+/).filter(Boolean)
    const sudo = words[0] === 'sudo'
    if (sudo) words.shift()
    const ev = {
      cmd: words[0] ?? '',
      sub: words[1] ?? '',
      args: words.slice(1).filter((w) => !w.startsWith('-')),
      sudo,
      ok: !r.out.some((x) => x.k === 'err') && !r.out.some((x) => /not found, but can be installed/.test(x.t)),
    }
    const echo = { t: `~$ ${line}`, k: 'cmd' }
    const next = {
      ...st,
      ...r.state,
      lines: r.clear ? [] : [...st.lines, echo, ...r.out].slice(-300),
      history: line.trim() ? [...st.history, line] : st.history,
      events: line.trim() ? [...st.events, ev] : st.events,
    }
    // Ticks stay ticked, even if a later command undoes the change.
    next.ticked = tasks.map((t, i) => st.ticked?.[i] || t.done(next))
    setSt(next)
    setInput('')
    setHist(-1)
  }

  function onKey(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      setInput((v) => complete(v, st))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = hist < 0 ? st.history.length - 1 : Math.max(hist - 1, 0)
      if (st.history[n] !== undefined) {
        setHist(n)
        setInput(st.history[n])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = hist + 1
      if (hist >= 0 && n < st.history.length) {
        setHist(n)
        setInput(st.history[n])
      } else {
        setHist(-1)
        setInput('')
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setSt((s) => ({ ...s, lines: [] }))
    }
  }

  const done = tasks.map((_, i) => !!st.ticked?.[i])
  const count = done.filter(Boolean).length

  return (
    <div className={`l7-term ${tasks.length ? 'has-tasks' : ''}`}>
      <div className="l7-tty" onClick={() => field.current?.focus()}>
        <div className="l7-tty-bar">
          <span className="l7-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{title}</span>
          <button
            type="button"
            className="l7-tty-reset"
            onClick={(e) => {
              e.stopPropagation()
              setSt(fresh(welcome, setup))
              setShown([])
            }}
          >
            ↺ Reset
          </button>
        </div>
        <div className="l7-tty-body" ref={body} aria-live="polite" style={height ? { height } : undefined}>
          {st.lines.map((l, i) => (
            <p key={i} className={`l7k-${l.k}`}>
              {l.t || ' '}
            </p>
          ))}
          <form className="l7-tty-input" onSubmit={submit}>
            <span className="l7-p">~$</span>
            <input
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              aria-label={label ?? 'Type a command'}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
      {tasks.length > 0 && (
        <div className="l7-tasks">
          <p className="l7-tasks-head">
            <strong>
              {count} / {tasks.length}
            </strong>{' '}
            done
            <span className="l7-tasks-bar">
              <motion.i animate={{ width: `${(count / tasks.length) * 100}%` }} />
            </span>
          </p>
          <ol>
            {tasks.map((t, i) => (
              <li key={t.label} className={done[i] ? 'is-done' : ''}>
                <span className="l7-tick" aria-hidden="true">
                  {done[i] ? '✓' : i + 1}
                </span>
                <span>
                  {t.label}
                  {t.hint && !done[i] && (
                    <>
                      {' '}
                      {shown.includes(i) ? (
                        <code className="l7-hint">{t.hint}</code>
                      ) : (
                        <button type="button" className="l7-hint-btn" onClick={() => setShown((s) => [...s, i])}>
                          hint
                        </button>
                      )}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ol>
          {count === tasks.length && (
            <motion.p className="l7-tasks-win" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              🎉 All done. You can install, update and clean up software like a pro!
            </motion.p>
          )}
        </div>
      )}
    </div>
  )
}
