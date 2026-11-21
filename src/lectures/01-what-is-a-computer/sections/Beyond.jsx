import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useRef, useState } from 'react'
import { Callout, Illo, PauseBadge, Reveal, Section, useStep } from '../../../design-system'
import { StepContext } from '../../../design-system/guided'

/* ================= 1 · A website runs the same IPOS cycle ================= */

const webSteps = (name) => [
  {
    tag: 'Input',
    cls: 't-in',
    at: 'browser',
    text: `You type “${name}” into the sign-up form and press Sign up.`,
    who: 'Frontend: HTML, CSS and JavaScript. You start building this part this semester.',
  },
  {
    tag: 'Processing',
    cls: 't-pr',
    at: 'server',
    wire: ['browser', 'server'],
    text: 'The form data travels to the server. Its code checks it: is the email valid? Is it already taken?',
    who: 'Backend: code that runs on the server. Later in the programme.',
  },
  {
    tag: 'Storage',
    cls: 't-st',
    at: 'db',
    wire: ['server', 'db'],
    text: `The server saves ${name}’s account in a database, so it’s still there tomorrow.`,
    who: 'Database: organised, permanent storage for an app’s data. Later in the programme.',
  },
  {
    tag: 'Output',
    cls: 't-out',
    at: 'browser',
    wire: ['server', 'browser'],
    text: `The server sends back a new page, and the browser shows “Welcome, ${name}!”`,
    who: 'Frontend again: the page you designed shows the result.',
  },
]

function WebIpos() {
  const [name, setName] = useState('Rahul')
  const [local, setLocal] = useState(0)
  const { guided, step: gStep } = useStep()
  const ctx = useContext(StepContext)
  const step = guided ? Math.min(gStep, 4) : local
  const go = (n) => (guided ? ctx.setStep(n) : setLocal(n))
  const who = name.trim() || 'you'
  const steps = webSteps(who)
  const cur = steps[step - 1]
  const wire = cur?.wire
  const saved = step >= 3

  return (
    <div className="bx-web">
      <div className="bx-web-stage">
        {/* Browser */}
        <div className={`bx-node ${cur?.at === 'browser' ? 'is-on' : ''}`}>
          <Illo name="BrowserWindow" size={100} />
          <strong>Browser</strong>
          <small>your laptop · the client</small>
          <div className="bx-screen">
            {step >= 4 ? (
              <motion.p className="bx-welcome" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7 }}>
                Welcome, {who}! 🎉
              </motion.p>
            ) : (
              <form
                className="bx-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  go(1)
                }}
              >
                <label>
                  Name
                  <input
                    value={name}
                    maxLength={14}
                    onChange={(e) => {
                      setName(e.target.value)
                      go(0)
                    }}
                  />
                </label>
                <span className="bx-fake">{who.toLowerCase().replace(/\s+/g, '')}@mail.com</span>
                <button type="submit" className={`btn btn-primary btn-sm ${step === 1 ? 'is-pressed' : ''}`}>
                  Sign up
                </button>
              </form>
            )}
          </div>
        </div>

        <Wire
          on={wire && wire.includes('browser') && wire.includes('server')}
          back={wire?.[0] === 'server' && wire?.[1] === 'browser'}
          label={wire?.[0] === 'server' ? 'page' : 'form data'}
          k={step}
        />

        {/* Server */}
        <div className={`bx-node ${cur?.at === 'server' ? 'is-on' : ''}`}>
          <Illo name="Server" size={100} />
          <strong>Server</strong>
          <small>a computer in a data centre</small>
          <div className="bx-checks">
            {['Email looks valid', 'Not taken yet'].map((c, i) => (
              <motion.span key={c} animate={{ opacity: step >= 2 ? 1 : 0.25 }} transition={{ delay: step === 2 ? 0.8 + i * 0.4 : 0 }}>
                {step >= 2 ? '✓' : '·'} {c}
              </motion.span>
            ))}
          </div>
        </div>

        <Wire on={wire && wire.includes('db')} label="save" k={step} />

        {/* Database */}
        <div className={`bx-node ${cur?.at === 'db' ? 'is-on' : ''}`}>
          <Illo name="Ssd" size={100} />
          <strong>Database</strong>
          <small>permanent storage</small>
          <div className="bx-table">
            <span>Amit</span>
            <span>Priya</span>
            <AnimatePresence>
              {saved && (
                <motion.span className="is-new" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: step === 3 ? 0.8 : 0 }}>
                  {who}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="walk-controls">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(Math.max(step - 1, 0))} disabled={step === 0}>
          ◀ Back
        </button>
        <span className="walk-count">Step {step} / 4</span>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => go(Math.min(step + 1, 4))} disabled={step === 4}>
          Next ▶
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(0)}>
          ↺ Reset
        </button>
      </div>

      <ol className="bx-steps">
        {steps.map((s, i) => (
          <motion.li key={s.tag + i} className={step === i + 1 ? 'is-now' : ''} animate={{ opacity: step > i ? 1 : 0.4 }}>
            <button type="button" onClick={() => go(i + 1)} aria-current={step === i + 1 ? 'step' : undefined}>
              <span className={`tag ${s.cls}`}>
                {i + 1} · {s.tag}
              </span>
              <span>
                {s.text}
                <small>{s.who}</small>
              </span>
            </button>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

/** A connector between two boxes. A packet slides along it when it's active. */
function Wire({ on, back = false, label, k }) {
  return (
    <div className={`bx-wire ${on ? 'is-on' : ''}`} aria-hidden="true">
      <span className="bx-wire-line" />
      {on && (
        <motion.span
          key={k}
          className="bx-packet"
          initial={{ left: back ? '100%' : '0%', opacity: 0 }}
          animate={{ left: back ? '0%' : '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}

/* ================= 2 · Is ChatGPT a computer? ================= */

const prompts = [
  ['Explain RAM in one line', 'RAM is your computer’s short-term memory: fast, but it forgets everything when the power goes off.'],
  ['Give me a name for my portfolio', 'How about “Pixels by Priya”? Short, personal and easy to remember.'],
  ['What is a server?', 'A server is a computer that sends websites and data to other computers, called clients.'],
]

const aiStages = [
  ['Input', 't-in', 'Your prompt leaves your laptop and travels over the internet to a data centre.'],
  ['Processing', 't-pr', 'Thousands of powerful chips (GPUs) in many server computers work out the reply.'],
  ['Output', 't-out', 'The answer streams back to your screen, a few words at a time.'],
  ['Storage', 't-st', 'Your chat is saved on the company’s servers, so it’s there next time.'],
]

function AiChat() {
  const [pick, setPick] = useState(0)
  const [stage, setStage] = useState(0)
  const [words, setWords] = useState(0)
  const [history, setHistory] = useState([])
  const timers = useRef([])
  const reply = prompts[pick][1].split(' ')

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function send() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))
    setWords(0)
    setStage(1)
    at(1300, () => setStage(2))
    at(3000, () => setStage(3))
    reply.forEach((_, i) => at(3100 + i * 140, () => setWords(i + 1)))
    at(3400 + reply.length * 140, () => {
      setStage(4)
      setHistory((h) => [prompts[pick][0], ...h.filter((x) => x !== prompts[pick][0])].slice(0, 3))
    })
  }

  return (
    <div className="bx-ai">
      <div className="bx-ai-chat">
        <div className="bx-ai-top">
          <Illo name="Laptop" size={66} />
          <strong>AI chat app</strong>
        </div>
        <div className="bx-ai-msgs" aria-live="polite">
          {stage >= 1 && <p className="bx-msg me">{prompts[pick][0]}</p>}
          {stage === 2 && (
            <p className="bx-msg ai bx-typing">
              <i />
              <i />
              <i />
            </p>
          )}
          {stage >= 3 && <p className="bx-msg ai">{reply.slice(0, words).join(' ')}</p>}
        </div>
        <div className="bx-ai-prompts">
          {prompts.map(([p], i) => (
            <button
              key={p}
              type="button"
              className={`bx-chip ${pick === i ? 'is-on' : ''}`}
              onClick={() => {
                setPick(i)
                setStage(0)
              }}
              disabled={stage > 0 && stage < 4}
            >
              {p}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={stage > 0 && stage < 4}>
          Send ➤
        </button>
      </div>

      <div className="bx-ai-cloud">
        <div className={`bx-dc ${stage === 2 ? 'is-busy' : ''}`}>
          <Illo name="DataCenter" size={112} />
          <strong>Data centre</strong>
          <div className="bx-gpus" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.i
                key={i}
                animate={stage === 2 ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.2 }}
                transition={stage === 2 ? { repeat: Infinity, duration: 0.6, delay: (i % 6) * 0.08 } : { duration: 0.3 }}
              />
            ))}
          </div>
          <div className="bx-history">
            <small>Saved chats</small>
            {history.length === 0 ? <span className="walk-hint">none yet</span> : history.map((h) => <span key={h}>💬 {h}</span>)}
          </div>
        </div>
        <ol className="bx-ai-stages">
          {aiStages.map(([t, cls, d], i) => (
            <motion.li key={t} animate={{ opacity: stage > i ? 1 : 0.35 }} className={stage === i + 1 ? 'is-now' : ''}>
              <span className={`tag ${cls}`}>{t}</span>
              <span>{d}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ================= 3 · Myth or fact? ================= */

const myths = [
  ['The monitor is the computer.', false, 'The monitor is only an output device. The computer is inside the case, or inside the laptop body.'],
  ['Your phone is a computer.', true, 'It takes input, processes it, gives output and stores data. Same IPOS cycle.'],
  [
    'Wi-Fi and the internet are the same thing.',
    false,
    'Wi-Fi only connects your device to the router nearby. The internet is the worldwide network beyond it.',
  ],
  [
    'A deleted file is gone forever.',
    false,
    'It first goes to the Recycle Bin (Windows) or Trash (Mac). Even after emptying, it can often be recovered until it is overwritten.',
  ],
  ['A web browser is software.', true, 'Chrome, Edge and Safari are programs: instructions you can’t touch.'],
  ['Opening more apps makes a computer faster.', false, 'Every open app uses CPU and RAM. More apps open usually means slower, not faster.'],
]

function MythCard({ m, i }) {
  const [ans, setAns] = useState(null)
  const right = ans !== null && ans === m[1]
  return (
    <Reveal delay={i * 0.05} className={`bx-myth ${ans === null ? '' : right ? 'is-right' : 'is-wrong'}`}>
      <p className="bx-myth-q">“{m[0]}”</p>
      {ans === null ? (
        <div className="bx-myth-btns">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAns(false)}>
            Myth
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAns(true)}>
            Fact
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="bx-myth-verdict">
            {right ? '✓ Right!' : '✗ Not quite.'} It’s a <strong>{m[1] ? 'fact' : 'myth'}</strong>.
          </p>
          <p className="bx-myth-why">{m[2]}</p>
          <button type="button" className="bx-again" onClick={() => setAns(null)}>
            ↺ try again
          </button>
        </motion.div>
      )}
    </Reveal>
  )
}

/* ================= 4 · Practice: the IPOS of an app you use ================= */

const apps = {
  UPI: {
    icon: '💸',
    example: [
      ['You scan a QR code and type ₹250 and your PIN', 'phone'],
      ['The bank’s servers check your PIN and balance, then move the money', 'server'],
      ['Both bank accounts and your payment history are updated', 'server'],
      ['“Payment successful” with a tick appears, and the shop gets a sound alert', 'phone'],
    ],
  },
  Instagram: {
    icon: '📸',
    example: [
      ['You pick a photo, add a caption and tap Share', 'phone'],
      ['The photo is resized on your phone, then Instagram’s servers process it', 'both'],
      ['The photo is saved on Instagram’s servers so everyone can see it', 'server'],
      ['It appears on your profile and in your friends’ feeds', 'phone'],
    ],
  },
  Swiggy: {
    icon: '🍔',
    example: [
      ['You choose a dish, your address and tap Place order', 'phone'],
      ['Swiggy’s servers send the order to the restaurant and find a delivery partner', 'server'],
      ['The order is saved in Swiggy’s database and your order history', 'server'],
      ['You see “Order placed” and a live map of your delivery', 'phone'],
    ],
  },
}
const parts = [
  ['Input', 't-in', 'What do you give the app?'],
  ['Processing', 't-pr', 'What work is done with it?'],
  ['Storage', 't-st', 'What is saved, and where?'],
  ['Output', 't-out', 'What do you see or hear?'],
]
const wheres = [
  ['phone', '📱 Phone'],
  ['server', '🖥 Server'],
  ['both', 'Both'],
]

function Practice() {
  const [app, setApp] = useState('UPI')
  const [show, setShow] = useState(false)
  const ex = apps[app].example
  return (
    <div className="bx-task">
      <div className="bx-task-apps" role="group" aria-label="Pick an app">
        {Object.entries(apps).map(([k, a]) => (
          <button
            key={k}
            type="button"
            className={`bx-chip ${app === k ? 'is-on' : ''}`}
            onClick={() => {
              setApp(k)
              setShow(false)
            }}
          >
            <span className="bx-emoji" aria-hidden="true">
              {a.icon}
            </span>{' '}
            {k}
          </button>
        ))}
      </div>
      <div className="bx-task-sheet">
        <div className="bx-task-row bx-task-head">
          <span>Step</span>
          <span>What happens in {app}?</span>
          <span>Where?</span>
        </div>
        {parts.map(([t, cls, q], i) => (
          <div key={t} className="bx-task-row">
            <span className={`tag ${cls}`}>{t}</span>
            <span className="bx-task-cell">
              {show ? (
                <motion.span key={app + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
                  {ex[i][0]}
                </motion.span>
              ) : (
                <em>{q}</em>
              )}
            </span>
            <span className="bx-task-where">
              {wheres.map(([w, label]) => (
                <span key={w} className={show && ex[i][1] === w ? 'is-on' : ''}>
                  {label}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShow(!show)}>
        {show ? 'Hide the example' : `Show a worked example for ${app}`}
      </button>
    </div>
  )
}

/* ================= Sections ================= */

export default function Beyond() {
  return (
    <>
      <Section
        id="website"
        eyebrow="Your future job"
        title="A website runs the same IPOS cycle"
        intro="Signing up on a website is input, processing, storage and output, spread across three computers. Type a name, then press Next to follow it."
        steps={4}
      >
        <Reveal>
          <WebIpos />
        </Reveal>
        <Callout label="Full stack">
          The frontend is what runs in the browser. The backend is what runs on the server. The database stores the data. A full-stack developer builds all
          three.
        </Callout>
      </Section>

      <Section
        id="ai"
        eyebrow="Computers you talk to"
        title="Is ChatGPT a computer?"
        intro="No. It’s software, running on thousands of server computers in data centres. But every chat still follows the IPOS cycle. Pick a prompt and press Send."
        tone="alt"
      >
        <Reveal>
          <AiChat />
        </Reveal>
        <Callout label="Remember">AI tools are clients and servers too: your laptop is the client, the AI company’s data centre is the server.</Callout>
      </Section>

      <Section id="myths" eyebrow="Quick check" title="Myth or fact?" intro="Decide for each one, then see if you were right.">
        <div className="bx-myths">
          {myths.map((m, i) => (
            <MythCard key={m[0]} m={m} i={i} />
          ))}
        </div>
      </Section>

      <Section
        id="practice"
        eyebrow="Practice"
        title="Your turn: the IPOS of an app you use"
        intro="Pick UPI, Instagram or Swiggy. For each IPOS step, say what happens and where: on your phone, on a server, or both. Then check yourself with the worked example."
        tone="rose"
      >
        <Reveal>
          <Practice />
        </Reveal>
        <PauseBadge>Pause the video, try it in your notebook, then press Show a worked example</PauseBadge>
      </Section>
    </>
  )
}
