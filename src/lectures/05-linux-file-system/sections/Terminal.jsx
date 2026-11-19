import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { complete, HOME, makeFs, run, shortPath } from './fsSim'

const fresh = (welcome) => ({
  cwd: HOME,
  prev: HOME,
  fs: makeFs(),
  lines: welcome.map((t) => ({ t, k: 'dim' })),
  history: [],
  events: [],
})

/**
 * A practice terminal with a checklist that ticks itself.
 * tasks: [{ label, hint, done: ({ fs, cwd, events }) => boolean }]
 * events: every command run so far, as { cmd, flags, args, cwdBefore, cwdAfter }.
 */
export default function Terminal({
  tasks = [],
  welcome = ['Type help to see the commands. Tab completes names, ↑ repeats.'],
  title = 'student@laptop: ~',
  label,
}) {
  const [st, setSt] = useState(() => fresh(welcome))
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
    const r = run(line, { ...st })
    const words = line.trim().split(/\s+/)
    const ev = {
      cmd: words[0] ?? '',
      flags: words
        .filter((w) => /^-[a-zA-Z]+$/.test(w))
        .join('')
        .replace(/-/g, ''),
      args: words.slice(1).filter((w) => !/^-[a-zA-Z]+$/.test(w)),
      cwdBefore: st.cwd,
      cwdAfter: r.cwd,
      ok: !r.out.some((x) => x.k === 'err'),
    }
    const echo = { t: `${shortPath(st.cwd)}$ ${line}`, k: 'cmd' }
    const next = {
      ...st,
      cwd: r.cwd,
      prev: r.prev ?? st.prev,
      fs: r.fs,
      lines: r.clear ? [] : [...st.lines, echo, ...r.out].slice(-200),
      history: line.trim() ? [...st.history, line] : st.history,
      events: line.trim() ? [...st.events, ev] : st.events,
    }
    // Ticks stay ticked, even if a later step changes the files again.
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
    <div className={`l5-term ${tasks.length ? 'has-tasks' : ''}`}>
      <div className="l5-tty" onClick={() => field.current?.focus()}>
        <div className="l5-tty-bar">
          <span className="l5-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{title.replace('~', shortPath(st.cwd))}</span>
          <button
            type="button"
            className="l5-tty-reset"
            onClick={(e) => {
              e.stopPropagation()
              setSt(fresh(welcome))
            }}
          >
            ↺ Reset
          </button>
        </div>
        <div className="l5-tty-body" ref={body} aria-live="polite">
          {st.lines.map((l, i) => (
            <p key={i} className={`l5k-${l.k}`}>
              {l.t || ' '}
            </p>
          ))}
          <form className="l5-tty-input" onSubmit={submit}>
            <span className="l5-p">{shortPath(st.cwd)}$</span>
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
        <div className="l5-tasks">
          <p className="l5-tasks-head">
            <strong>
              {count} / {tasks.length}
            </strong>{' '}
            done
            <span className="l5-tasks-bar">
              <motion.i animate={{ width: `${(count / tasks.length) * 100}%` }} />
            </span>
          </p>
          <ol>
            {tasks.map((t, i) => (
              <li key={t.label} className={done[i] ? 'is-done' : ''}>
                <span className="l5-tick" aria-hidden="true">
                  {done[i] ? '✓' : i + 1}
                </span>
                <span>
                  {t.label}
                  {t.hint && !done[i] && (
                    <>
                      {' '}
                      {shown.includes(i) ? (
                        <code className="l5-hint">{t.hint}</code>
                      ) : (
                        <button type="button" className="l5-hint-btn" onClick={() => setShown((s) => [...s, i])}>
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
            <motion.p className="l5-tasks-win" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              🎉 All done. Nicely navigated!
            </motion.p>
          )}
        </div>
      )}
    </div>
  )
}
