import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'

const now = () => new Date().toTimeString().slice(0, 8)

/* ---------- > vs >> lab ---------- */

function RedirectLab() {
  const id = useRef(0)
  const [file, setFile] = useState(null) // { lines: [{id, t}], time }
  const [text, setText] = useState('Version 1')
  const [op, setOp] = useState('>')
  const [say, setSay] = useState('The file doesn’t exist yet. Run a command.')
  const [flash, setFlash] = useState(0)
  const [out, setOut] = useState(null)

  function write(t, o) {
    const line = { id: ++id.current, t }
    setOut(null)
    if (o === '>') {
      setSay(file?.lines.length ? '> emptied the file first, then wrote the new line. The old text is gone!' : '> created the file and wrote the line.')
      setFile({ lines: [line], time: now() })
    } else {
      setSay(file ? '>> added the line at the end. Nothing was deleted.' : '>> created the file (it didn’t exist) and wrote the line.')
      setFile((f) => ({ lines: [...(f?.lines ?? []), line], time: now() }))
    }
  }
  function touch() {
    setOut(null)
    if (!file) {
      setFile({ lines: [], time: now() })
      setSay('touch created an empty file.')
    } else {
      setFile((f) => ({ ...f, time: now() }))
      setFlash((n) => n + 1)
      setSay('touch on an existing file only updates its “last modified” time. The content is safe.')
    }
  }
  function cat() {
    setOut(file ? file.lines.map((l) => l.t) : ['cat: file.txt: No such file or directory'])
    setSay(file ? 'cat prints what’s inside.' : 'There’s no file.txt yet.')
  }

  const presets = [
    ['Version 1', '>'],
    ['Version 2', '>'],
    ['Version 3', '>>'],
  ]

  return (
    <div className="l5-redir">
      <div className="l5-redir-ctl">
        <p className="eyebrow">Quick commands</p>
        <div className="l5-redir-presets">
          {presets.map(([t, o]) => (
            <button key={t + o} type="button" className="l5-cmdbtn" onClick={() => write(t, o)}>
              <span>
                echo &quot;{t}&quot; <b>{o}</b> file.txt
              </span>
            </button>
          ))}
        </div>
        <p className="eyebrow">Or build your own</p>
        <form
          className="l5-redir-own"
          onSubmit={(e) => {
            e.preventDefault()
            if (text.trim()) write(text.trim(), op)
          }}
        >
          <code>echo &quot;</code>
          <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Text to write" maxLength={40} />
          <code>&quot;</code>
          <div className="l5-seg sm" role="group" aria-label="Operator">
            {['>', '>>'].map((o) => (
              <button key={o} type="button" className={op === o ? 'is-on' : ''} onClick={() => setOp(o)}>
                {o}
              </button>
            ))}
          </div>
          <code>file.txt</code>
          <button type="submit" className="btn btn-primary btn-sm">
            Run
          </button>
        </form>
        <div className="l5-redir-more">
          <button type="button" className="l5-cmdbtn" onClick={touch}>
            touch file.txt
          </button>
          <button type="button" className="l5-cmdbtn" onClick={cat}>
            cat file.txt
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setFile(null)
              setOut(null)
              setSay('Reset. The file doesn’t exist yet.')
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>
      <div className="l5-redir-file">
        <div className={`l5-doc ${file ? '' : 'is-missing'}`}>
          <div className="l5-doc-head">
            <span>📄 file.txt</span>
            <motion.small
              key={flash}
              animate={{ backgroundColor: flash ? ['#ffe58a', 'rgba(255,229,138,0)'] : 'rgba(0,0,0,0)' }}
              transition={{ duration: 1.2 }}
            >
              {file ? `modified ${file.time}` : 'does not exist'}
            </motion.small>
          </div>
          <ol className="l5-doc-lines">
            <AnimatePresence initial={false}>
              {file?.lines.map((l) => (
                <motion.li
                  key={l.id}
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80, color: '#e00c16', textDecoration: 'line-through' }}
                  transition={{ duration: 0.4 }}
                >
                  {l.t}
                </motion.li>
              ))}
            </AnimatePresence>
            {file && !file.lines.length && <li className="l5-muted">(empty)</li>}
          </ol>
        </div>
        {out && (
          <pre className="l5-mini-out">
            <span className="l5-p">$</span> cat file.txt{'\n'}
            {out.join('\n')}
          </pre>
        )}
        <p className="l5-redir-say" aria-live="polite">
          {say}
        </p>
      </div>
    </div>
  )
}

/* ---------- Question with a hidden answer ---------- */

function Ask({ q, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`l5-ask ${open ? 'is-open' : ''}`}>
      <p className="l5-ask-q">🤔 {q}</p>
      {open ? (
        <motion.div className="l5-ask-a" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {children}
        </motion.div>
      ) : (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
          Think first, then reveal the answer
        </button>
      )}
    </div>
  )
}

const ways = [
  [
    'touch app.log',
    'Creates an empty file. Several at once: touch a.log b.log c.log',
    ['$ touch app.log', '$ ls -l', '-rw-r--r-- 1 student student 0 Nov 19 09:30 app.log'],
  ],
  [
    'cat > notes.txt',
    'Type the content, then press Ctrl + D on a new line to save and finish.',
    ['$ cat > notes.txt', 'Hello', 'Linux', '^D', '$ cat notes.txt', 'Hello', 'Linux'],
  ],
  ['echo "Hi" > file.txt', 'Writes one line straight into a file. Great inside scripts.', ['$ echo "Hi" > file.txt', '$ cat file.txt', 'Hi']],
]

export default function Create() {
  return (
    <>
      <Section
        id="create"
        eyebrow="Part 6 · Creating files"
        title="Three ways to make a file"
        intro="Each one has its own job. Then we’ll look at the one trap that catches everybody: > versus >>."
        steps={3}
      >
        <div className="l5-ways">
          {ways.map(([c, d, lines], i) => (
            <Reveal key={c} className="l5-way" delay={i * 0.1}>
              <code className="l5-big">{c}</code>
              <p>{d}</p>
              <pre>
                {lines.map((l, k) => (
                  <span key={k} className={l.startsWith('$') ? 'l5-cmdline' : l === '^D' ? 'l5-ctrl' : ''}>
                    {l}
                    {'\n'}
                  </span>
                ))}
              </pre>
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <Ask q="What happens if you touch a file that already exists?">
            <p>
              <strong>Nothing bad.</strong> The content stays exactly the same; touch only updates the file’s “last modified” time. Try it in the lab below.
            </p>
          </Ask>
        </Step>
        <Step n={2}>
          <Ask q="echo “Version 1” > file.txt, then echo “Version 2” > file.txt. What’s in the file now?">
            <p>
              Only <code>Version 2</code>. A single <code>&gt;</code> empties the file before writing. To keep both lines, use <code>&gt;&gt;</code> (append).
            </p>
          </Ask>
        </Step>
        <Step n={3}>
          <div className="l5-gtgt">
            <div>
              <code className="l5-big">&gt;</code>
              <strong>Overwrite</strong>
              <span>Replaces everything in the file</span>
            </div>
            <div>
              <code className="l5-big">&gt;&gt;</code>
              <strong>Append</strong>
              <span>Adds to the end, keeps the rest</span>
            </div>
          </div>
        </Step>
      </Section>
      <Section
        id="redirect"
        eyebrow="Lab"
        title="> vs >>: watch the file"
        intro="Click the commands in order: Version 1, Version 2, then Version 3. Watch what survives."
        tone="alt"
      >
        <Reveal>
          <RedirectLab />
        </Reveal>
        <Callout>
          Logs are written with append (&gt;&gt;) so nothing is lost. One wrong &gt; in a script can wipe a file, so double-check before you press Enter.
        </Callout>
      </Section>
    </>
  )
}
