import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PauseBadge, Reveal, Section } from './ui'

const files = [
  { name: 'index.html', type: 'document' },
  { name: 'style.css', type: 'stylesheet' },
  { name: 'logo.png', type: 'image' },
  { name: 'app.js', type: 'script' },
]

// phase: idle → request → server → response → done
function ClientServer() {
  const [phase, setPhase] = useState('idle')
  const [log, setLog] = useState([])
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function go() {
    timers.current.forEach(clearTimeout)
    setLog([])
    setPhase('request')
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))
    at(1100, () => setPhase('server'))
    at(2000, () => setPhase('response'))
    files.forEach((f, i) =>
      at(2100 + i * 350, () => setLog((l) => [...l, { ...f, ms: 20 + Math.round(Math.random() * 160) }])),
    )
    at(3800, () => setPhase('done'))
  }

  return (
    <div className="cs">
      <div className="cs-stage">
        <div className="cs-box cs-client">
          <span className="cs-tag">Client</span>
          <div className="browser">
            <div className="browser-bar">
              <span className="dots"><i /><i /><i /></span>
              <span className="url">https://catalyst-demo.dev</span>
            </div>
            <div className="browser-page">
              <AnimatePresence mode="wait">
                {phase === 'done' ? (
                  <motion.div key="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mini-page">
                    <div className="mini-nav" />
                    <div className="mini-hero">Hello, Catalyst!</div>
                    <div className="mini-row"><span /><span /><span /></div>
                  </motion.div>
                ) : (
                  <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="browser-wait">
                    {phase === 'idle' ? 'Press “Send request”' : 'Loading…'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          <p className="cs-caption">Your browser</p>
        </div>

        <div className="cs-wire" aria-hidden="true">
          <span className="cs-line" />
          <AnimatePresence>
            {phase === 'request' && (
              <motion.span key="req" className="cs-packet req" initial={{ left: '0%', opacity: 0 }} animate={{ left: '92%', opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: 'easeInOut' }}>
                GET /
              </motion.span>
            )}
            {phase === 'response' &&
              files.map((f, i) => (
                <motion.span key={f.name} className="cs-packet res" initial={{ left: '92%', opacity: 0 }} animate={{ left: '0%', opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2, delay: 0 } }} transition={{ duration: 0.9, delay: i * 0.25, ease: 'easeInOut' }} style={{ top: `${20 + i * 18}%` }}>
                  {f.name}
                </motion.span>
              ))}
          </AnimatePresence>
        </div>

        <div className={`cs-box cs-server ${phase === 'server' ? 'is-busy' : ''}`}>
          <span className="cs-tag">Server</span>
          <div className="rack">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rack-unit">
                <motion.i animate={phase === 'server' ? { opacity: [1, 0.2, 1] } : { opacity: 1 }} transition={{ repeat: phase === 'server' ? Infinity : 0, duration: 0.4, delay: i * 0.1 }} />
                <span />
              </div>
            ))}
          </div>
          <p className="cs-caption">{phase === 'server' ? 'Finding the files…' : 'In a data center, running 24/7'}</p>
        </div>
      </div>

      <div className="cs-controls">
        <button type="button" className="btn btn-primary" onClick={go} disabled={phase !== 'idle' && phase !== 'done'}>
          {phase === 'done' ? '↻ Send it again' : '➜ Send request'}
        </button>
        <p className="cs-status" aria-live="polite">
          {{
            idle: 'The browser (client) is about to ask a server for a web page.',
            request: '1 · Request: “Please send me the home page.”',
            server: '2 · The server finds the files.',
            response: '3 · Response: HTML, CSS, images and scripts travel back.',
            done: '4 · The browser puts them together into the page you see.',
          }[phase]}
        </p>
      </div>

      <div className="netlog" aria-label="Simulated Network tab">
        <div className="netlog-head"><span>Name</span><span>Status</span><span>Type</span><span>Time</span></div>
        {log.length === 0 && <p className="netlog-empty">Requests will appear here, like in the browser’s Network tab.</p>}
        {log.map((r) => (
          <motion.div key={r.name} className="netlog-row" initial={{ opacity: 0, backgroundColor: 'rgba(224,12,22,0.18)' }} animate={{ opacity: 1, backgroundColor: 'rgba(224,12,22,0)' }} transition={{ duration: 0.8 }}>
            <span>{r.name}</span>
            <span className="ok">200</span>
            <span>{r.type}</span>
            <span>{r.ms} ms</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function Servers() {
  return (
    <>
      <Section
        id="servers"
        eyebrow="The most important one for you"
        title="Servers: the computers behind every website"
        intro="A server is a computer that provides data or services to other computers, called clients. When you open a website, your browser is the client."
      >
        <Reveal>
          <ClientServer />
        </Reveal>
        <div className="card-grid three">
          {[
            ['Runs 24/7', 'So websites are always available'],
            ['Serves many clients', 'Thousands of browsers at the same time'],
            ['Lives in data centers', 'Buildings full of servers, cooled and powered round the clock'],
          ].map(([t, d], i) => (
            <Reveal key={t} className="card" delay={i * 0.08}>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="try-network" eyebrow="Try it · 2 minutes" title="Watch your real browser talk to servers" tone="red">
        <div className="split">
          <Reveal>
            <ol className="steps-on-red">
              <li>Open any website, e.g. <strong>wikipedia.org</strong></li>
              <li>Press <kbd>F12</kbd> and open the <strong>Network</strong> tab</li>
              <li>Reload the page (<kbd>Ctrl</kbd> + <kbd>R</kbd> or <kbd>Cmd</kbd> + <kbd>R</kbd>)</li>
              <li>Each new row is one request to a server</li>
            </ol>
          </Reveal>
          <Reveal className="card card-on-red" delay={0.1}>
            <h3>What to look for</h3>
            <p><strong>Status 200</strong> means OK: the server found the file and sent it.</p>
            <p>The first row is the HTML document. Then come CSS, images and scripts.</p>
            <p>The names and times on your screen will be different, and that’s fine.</p>
          </Reveal>
        </div>
        <PauseBadge />
      </Section>
    </>
  )
}
