import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- What the shell does with one command ---------- */

const PATH = ['/usr/local/bin', '/usr/bin', '/bin']
const stages = [
  ['Read', 'You press Enter. The shell reads the line you typed.'],
  ['Split', 'It splits the line at the spaces: a command, an option and an argument.'],
  ['Find', 'It looks for a program called ls in each folder listed in $PATH, in order.'],
  ['Run', 'Found /usr/bin/ls. The shell asks the kernel (with system calls) to start it.'],
  ['Show', 'ls prints its output. The shell shows a fresh prompt, ready for the next command.'],
]

function Interpreter() {
  const [s, setS] = useState(0)
  const parts = [
    ['ls', 'command'],
    ['-l', 'option'],
    ['/home', 'argument'],
  ]
  return (
    <div className="l4-interp">
      <ol className="l4-stages" aria-label="What the shell does">
        {stages.map(([t], i) => (
          <li key={t}>
            <button type="button" className={`${i === s ? 'is-on' : ''} ${i < s ? 'is-done' : ''}`} aria-pressed={i === s} onClick={() => setS(i)}>
              <span>{i + 1}</span>
              {t}
            </button>
          </li>
        ))}
      </ol>
      <div className="tty l4-interp-tty">
        <div className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          bash
        </div>
        <div className="tty-body">
          <p>
            <span className="tty-prompt">student@laptop:~$</span>{' '}
            {parts.map(([w, k]) => (
              <span key={w} className={`l4-tok ${s >= 1 ? `l4-tok-${k}` : ''}`}>
                {w}
                {s >= 1 && <small>{k}</small>}
              </span>
            ))}
          </p>
          <AnimatePresence>
            {s === 2 && (
              <motion.div className="l4-path" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                {PATH.map((p, i) => (
                  <motion.p
                    key={p}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.5 }}
                    className={p === '/usr/bin' ? 'found' : 'miss'}
                  >
                    {p}/ls {p === '/usr/bin' ? '✓ found' : '✗ not here'}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {s === 3 && (
            <motion.p className="tty-sys" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              execve(&quot;/usr/bin/ls&quot;, [&quot;ls&quot;, &quot;-l&quot;, &quot;/home&quot;]) → kernel starts the program
            </motion.p>
          )}
          {s === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="tty-out">drwxr-xr-x 5 student student 4096 Nov 19 09:30 student</p>
              <p>
                <span className="tty-prompt">student@laptop:~$</span> <span className="tty-caret" />
              </p>
            </motion.div>
          )}
        </div>
      </div>
      <p className="l4-interp-cap" aria-live="polite">
        {stages[s][1]}
      </p>
      <div className="l4-interp-ctl">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setS((x) => Math.max(0, x - 1))} disabled={s === 0}>
          ← Back
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setS((x) => (x + 1) % stages.length)}>
          {s === stages.length - 1 ? '↺ Start again' : 'Next step →'}
        </button>
      </div>
    </div>
  )
}

const vars = [
  ['$HOME', '/home/student', 'Your home folder'],
  ['$USER', 'student', 'Who you are logged in as'],
  ['$SHELL', '/bin/bash', 'Which shell you are using'],
  ['$PATH', '/usr/local/bin:/usr/bin:/bin', 'Where the shell looks for programs'],
]

/* ---------- Terminal vs shell vs command ---------- */

const tsc = {
  terminal: [
    'Terminal',
    'The window. It shows text and sends your keystrokes on. Examples: Terminal (macOS), Windows Terminal, GNOME Terminal, the VS Code terminal.',
  ],
  shell: ['Shell', 'The program running inside the window (bash, zsh). It shows the prompt and works out what your command means.'],
  command: ['Command', 'What you type. Here: pwd, which asks ""which folder am I in?""'],
}

function Tsc() {
  const [k, setK] = useState('terminal')
  return (
    <div className="l4-tsc">
      <div className={`l4-tsc-term ${k === 'terminal' ? 'is-on' : ''}`} aria-hidden="true">
        <span className="l4-tsc-label">Terminal</span>
        <span className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          Terminal
        </span>
        <span className="l4-tsc-body">
          <span className={`l4-tsc-shell ${k === 'shell' ? 'is-on' : ''}`}>
            <span className="l4-tsc-label">Shell</span>
            student@laptop:~${' '}
            <span className={`l4-tsc-cmd ${k === 'command' ? 'is-on' : ''}`}>
              <span className="l4-tsc-label">Command</span>
              pwd
            </span>
          </span>
          <span className="l4-tsc-out">/home/student</span>
        </span>
      </div>
      <div>
        <div className="segmented" role="group" aria-label="Terminal, shell or command">
          {Object.entries(tsc).map(([key, [t]]) => (
            <button key={key} type="button" className={k === key ? 'is-on' : ''} aria-pressed={k === key} onClick={() => setK(key)}>
              {t}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={k}
            className="l4-tsc-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            aria-live="polite"
          >
            <h3>{tsc[k][0]}</h3>
            <p>{tsc[k][1]}</p>
            <p className="l4-tsc-line">Terminal is the door. Shell is the brain behind it.</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Shell() {
  return (
    <Section id="shell" eyebrow="Part 5 · The shell" title="The shell: the part you'll use every day" steps={3}>
      <div className="l4-nut">
        <Reveal className="l4-nut-pic">
          <img src={img.nut} alt="A nut: the kernel inside, the shell around it" />
        </Reveal>
        <div>
          <p className="lead">Think of a nut: the shell wraps around the kernel, and you only ever touch the shell.</p>
          <ul className="l4-ticks">
            {['Acts as a bridge between you and the kernel', 'Accepts the commands you type', 'Passes them to the kernel to be carried out'].map((t, i) => (
              <Step as="li" key={t} n={i + 1} delay={i * 0.08}>
                {t}
              </Step>
            ))}
          </ul>
          <p className="l4-shells">
            Popular shells: <b>bash</b> (most Linux systems) · <b>zsh</b> (the default on macOS)
          </p>
        </div>
      </div>
      <h3 className="sub">What the shell does when you press Enter</h3>
      <Reveal>
        <Interpreter />
      </Reveal>
      <h3 className="sub">Environment variables the shell keeps for you</h3>
      <div className="l4-vars">
        {vars.map(([k, v, d]) => (
          <div key={k} className="l4-var" tabIndex={0}>
            <code>{k}</code>
            <span className="l4-var-val">{v}</span>
            <small>{d}</small>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* Export the terminal clarification as a separate component for reordering */
export function TerminalClarity() {
  return (
    <Section id="terminal" eyebrow="Three words people mix up" title="Terminal vs shell vs command" tone="alt">
      <Reveal>
        <Tsc />
      </Reveal>
      <Callout>When someone says "open a terminal and run npm install", they mean: open the window, and let the shell run that command.</Callout>
    </Section>
  )
}
