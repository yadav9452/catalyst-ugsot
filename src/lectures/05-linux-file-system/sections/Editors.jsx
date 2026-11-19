import { useReducer, useRef, useState } from 'react'
import { Callout, PauseBadge, Reveal, Section, Step } from '../../../design-system'

/* ---------- nano: save and exit ---------- */

const NANO_TEXT = 'I am writing some sample notes'

function Nano() {
  // edit → (^O) name → (Enter) wrote → (^X) done.  ^X while unsaved → ask
  const [stage, setStage] = useState('edit')
  const [saved, setSaved] = useState(false)
  const reset = () => {
    setStage('edit')
    setSaved(false)
  }
  const bottom = {
    edit: null,
    name: 'File Name to Write: notes.txt',
    wrote: '[ Wrote 1 line ]',
    ask: 'Save modified buffer?   Y Yes   N No   ^C Cancel',
  }[stage]

  return (
    <div className="l5-ed">
      <div className="l5-nano">
        {stage === 'done' ? (
          <div className="l5-nano-done">
            <p className="l5k-cmd">~$ nano notes.txt</p>
            <p className="l5k-cmd">~$ cat notes.txt</p>
            <p>{saved ? NANO_TEXT : 'cat: notes.txt: No such file or directory'}</p>
            <p className="l5k-dim">{saved ? 'Saved and closed. ✓' : 'You exited without saving, so nothing was written.'}</p>
          </div>
        ) : (
          <>
            <p className="l5-nano-top">
              <span>GNU nano 7.2</span>
              <span>notes.txt{saved ? '' : ' *'}</span>
            </p>
            <div className="l5-nano-body">
              {NANO_TEXT}
              <span className="l5-caret" />
            </div>
            <p className={`l5-nano-msg ${bottom ? 'on' : ''}`}>{bottom ?? ' '}</p>
            <div className="l5-nano-keys">
              <span>
                <b>^G</b> Help
              </span>
              <button type="button" onClick={() => setStage('name')} disabled={stage !== 'edit' && stage !== 'wrote'}>
                <b>^O</b> Write Out
              </button>
              <span>
                <b>^W</b> Where Is
              </span>
              <span>
                <b>^K</b> Cut
              </span>
              <button type="button" onClick={() => setStage(saved ? 'done' : 'ask')} disabled={stage === 'name' || stage === 'ask'}>
                <b>^X</b> Exit
              </button>
            </div>
          </>
        )}
      </div>
      <div className="l5-ed-side">
        <ol className="l5-ed-steps">
          <li className={stage !== 'edit' ? 'is-done' : ''}>
            <kbd>Ctrl</kbd> + <kbd>O</kbd> save (“write out”)
          </li>
          <li className={saved ? 'is-done' : ''}>
            <kbd>Enter</kbd> confirm the file name
          </li>
          <li className={stage === 'done' ? 'is-done' : ''}>
            <kbd>Ctrl</kbd> + <kbd>X</kbd> exit
          </li>
        </ol>
        <div className="l5-ed-act">
          {stage === 'name' && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSaved(true)
                setStage('wrote')
              }}
            >
              Press Enter
            </button>
          )}
          {stage === 'ask' && (
            <>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setStage('name')}>
                Y (yes, save)
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStage('done')}>
                N (don’t save)
              </button>
            </>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            ↺ Start again
          </button>
        </div>
        <p className="l5-muted">The ^ means Ctrl. nano always lists its shortcuts at the bottom, so you never get stuck.</p>
      </div>
    </div>
  )
}

/* ---------- vim: modes trainer ---------- */

const vimGoals = [
  ['insert', 'Press i to enter INSERT mode'],
  ['typed', 'Type some text'],
  ['esc', 'Press Esc to go back to NORMAL mode'],
  ['saved', 'Type :wq and Enter to save and quit'],
]

const vim0 = { mode: 'normal', buf: '', cmd: '', msg: '"text.txt" [New]', saved: null, done: [], shake: 0 }

/** vim as a pure function: (state, key) → new state. Keeps multi-key button presses correct. */
function vimKey(s, k) {
  const tick = (g) => (s.done.includes(g) ? s.done : [...s.done, g])
  if (k === 'reopen') return { ...s, mode: 'normal', buf: s.saved ?? '', msg: s.saved ? `"text.txt" ${s.saved.split('\n').length}L` : '"text.txt" [New]' }
  if (s.mode === 'closed') return s
  if (s.mode === 'normal') {
    if (k === 'i') return { ...s, mode: 'insert', msg: '-- INSERT --', done: tick('insert') }
    if (k === ':') return { ...s, mode: 'cmd', cmd: '' }
    if (k.length === 1 || k === 'Enter') return { ...s, shake: s.shake + 1, msg: 'In NORMAL mode keys are commands, not text. Press i to start typing.' }
    return s
  }
  if (s.mode === 'insert') {
    if (k === 'Escape') return { ...s, mode: 'normal', msg: '', done: tick('esc') }
    if (k === 'Backspace') return { ...s, buf: s.buf.slice(0, -1) }
    if (k === 'Enter') return { ...s, buf: s.buf + '\n' }
    if (k.length === 1) return { ...s, buf: s.buf.length < 200 ? s.buf + k : s.buf, done: tick('typed') }
    return s
  }
  // command line after ':'
  if (k === 'Escape') return { ...s, mode: 'normal', cmd: '' }
  if (k === 'Backspace') return s.cmd ? { ...s, cmd: s.cmd.slice(0, -1) } : { ...s, mode: 'normal' }
  if (k.length === 1) return { ...s, cmd: s.cmd + k }
  if (k !== 'Enter') return s
  const c = s.cmd
  const dirty = s.buf !== (s.saved ?? '')
  if (c === 'wq' || c === 'x')
    return { ...s, cmd: '', saved: s.buf, mode: 'closed', done: tick('saved'), msg: `"text.txt" ${s.buf.split('\n').length}L written` }
  if (c === 'w') return { ...s, cmd: '', saved: s.buf, mode: 'normal', msg: '"text.txt" written' }
  if (c === 'q!') return { ...s, cmd: '', mode: 'closed', msg: 'Quit without saving.' }
  if (c === 'q')
    return dirty ? { ...s, cmd: '', mode: 'normal', msg: 'E37: No write since last change (add ! to override)' } : { ...s, cmd: '', mode: 'closed', msg: '' }
  return { ...s, cmd: '', mode: 'normal', msg: `E492: Not an editor command: ${c}` }
}

function Vim() {
  const [s, dispatch] = useReducer(vimKey, vim0)
  const { mode, buf, cmd, msg, saved, done, shake } = s
  const box = useRef(null)

  function onKeyDown(e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Tab') return
    if (['Escape', 'Enter', 'Backspace'].includes(e.key) || e.key.length === 1) {
      e.preventDefault()
      e.stopPropagation()
      dispatch(e.key)
    }
  }
  const press = (keys) => {
    keys.forEach(dispatch)
    box.current?.focus()
  }
  const reopen = () => dispatch('reopen')

  return (
    <div className="l5-ed">
      <div>
        {mode === 'closed' ? (
          <div className="l5-vim l5-vim-closed">
            <p className="l5k-cmd">~$ vim text.txt</p>
            <p className="l5k-dim">{msg}</p>
            <p className="l5k-cmd">~$ cat text.txt</p>
            {saved !== null ? saved.split('\n').map((l, i) => <p key={i}>{l || ' '}</p>) : <p className="l5k-err">cat: text.txt: No such file or directory</p>}
            <button type="button" className="btn btn-ghost btn-sm" onClick={reopen}>
              Open vim again
            </button>
          </div>
        ) : (
          <div
            ref={box}
            className={`l5-vim mode-${mode} ${shake ? `is-shake${shake % 2}` : ''}`}
            tabIndex={0}
            onKeyDown={onKeyDown}
            role="textbox"
            aria-label="vim trainer. Click here, then use the keyboard: i, Esc, :wq"
          >
            <div className="l5-vim-buf">
              {buf.split('\n').map((l, i, a) => (
                <p key={i}>
                  {l}
                  {i === a.length - 1 && mode === 'insert' && <span className="l5-caret" />}
                </p>
              ))}
              {mode !== 'insert' && !buf && <span className="l5-vim-block" />}
              {[0, 1, 2, 3].map((n) => (
                <p key={'t' + n} className="l5-vim-tilde">
                  ~
                </p>
              ))}
            </div>
            <p className="l5-vim-status">
              <span className={`l5-vim-mode l5m-${mode}`}>{mode === 'insert' ? 'INSERT' : mode === 'cmd' ? 'COMMAND' : 'NORMAL'}</span>
              <span>{mode === 'cmd' ? `:${cmd}` : msg}</span>
            </p>
          </div>
        )}
        <div className="l5-vim-pad" aria-label="On-screen keys">
          <button type="button" onClick={() => press(['i'])}>
            i
          </button>
          <button type="button" onClick={() => press('Hello Linux'.split(''))}>
            type “Hello Linux”
          </button>
          <button type="button" onClick={() => press(['Escape'])}>
            Esc
          </button>
          <button type="button" onClick={() => press([':', 'w', 'q', 'Enter'])}>
            :wq ⏎
          </button>
          <button type="button" onClick={() => press([':', 'q', '!', 'Enter'])}>
            :q! ⏎
          </button>
        </div>
      </div>
      <div className="l5-ed-side">
        <p className="l5-muted">Click the black box and use your keyboard (or the buttons).</p>
        <ol className="l5-ed-steps">
          {vimGoals.map(([g, t]) => (
            <li key={g} className={done.includes(g) ? 'is-done' : ''}>
              {t}
            </li>
          ))}
        </ol>
        <div className="l5-vim-modes">
          <p>
            <span className="l5-vim-mode l5m-normal">NORMAL</span> keys are commands
          </p>
          <p>
            <span className="l5-vim-mode l5m-insert">INSERT</span> keys type text
          </p>
          <p>
            <span className="l5-vim-mode l5m-cmd">:</span> commands like :wq and :q!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Editors() {
  return (
    <>
      <Section
        id="editors"
        eyebrow="Part 7 · Text editors in the terminal"
        title="nano first, then vim"
        intro="For more than one line, open a real editor inside the terminal. nano is the friendliest; vim is on every server, so it’s worth knowing the basics."
        steps={1}
      >
        <h3 className="sub">
          nano: <code>nano notes.txt</code>
        </h3>
        <Reveal>
          <Nano />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">
            vim: <code>vim text.txt</code>
          </h3>
          <Vim />
          <Callout label="Stuck in vim?">Press Esc, then type :q! and Enter. You leave without saving. Every developer has needed this at least once.</Callout>
        </Step>
      </Section>
      <Section id="editors-try" eyebrow="Pause and try" title="Edit a real file" tone="alt">
        <div className="l5-tryrow">
          <pre className="l5-trycode">
            {'nano notes.txt   # type a line, Ctrl+O, Enter, Ctrl+X\ncat notes.txt\n\nvim text.txt     # i, type, Esc, :wq\ncat text.txt'}
          </pre>
          <PauseBadge>Mac users: nano and vim are already installed. Open Terminal and try them.</PauseBadge>
        </div>
      </Section>
    </>
  )
}
