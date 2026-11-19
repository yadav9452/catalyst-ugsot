import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { img, img3 } from '../images'

/* ---------- Crash simulator: app crash vs kernel panic ---------- */

const apps0 = [
  { k: 'chrome', t: 'Chrome', pic: img3.chrome },
  { k: 'code', t: 'VS Code', pic: img3['cli-terminal'] },
  { k: 'music', t: 'Music', pic: img3.music },
]

function CrashSim() {
  const [crashed, setCrashed] = useState(null) // app key
  const [closed, setClosed] = useState([])
  const [panic, setPanic] = useState(false)

  function crashApp() {
    setCrashed('chrome')
    setTimeout(() => {
      setClosed(['chrome'])
      setCrashed(null)
    }, 1600)
  }
  function reset() {
    setCrashed(null)
    setClosed([])
    setPanic(false)
  }
  return (
    <div className="l4-crash">
      <div className="l4-screen">
        <AnimatePresence>
          {panic ? (
            <motion.div key="panic" className="l4-panic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p>Kernel panic - not syncing: Fatal exception</p>
              <p className="l4-panic-sub">The whole computer has stopped. Every app is gone. You must restart.</p>
            </motion.div>
          ) : (
            <motion.div key="desk" className="l4-desk" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="l4-desk-tag">User space</span>
              <div className="l4-wins">
                {apps0.map((a) => (
                  <AnimatePresence key={a.k}>
                    {!closed.includes(a.k) && (
                      <motion.div
                        className={`l4-win ${crashed === a.k ? 'is-crashing' : ''}`}
                        exit={{ scale: 0.4, opacity: 0, rotate: -8 }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="l4-win-bar">
                          <i />
                          <i />
                          <i />
                          {a.t}
                          {crashed === a.k && ' (Not responding)'}
                        </span>
                        <img src={a.pic} alt="" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
              <span className="l4-desk-kernel">Kernel space: still running ✓</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="l4-crash-ctl">
        <button type="button" className="btn btn-ghost" onClick={crashApp} disabled={panic || closed.length > 0 || crashed}>
          💥 Crash an app (Chrome)
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setPanic(true)} disabled={panic}>
          ☠ Crash the kernel
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          ↺ Restart
        </button>
      </div>
      <p className="l4-crash-cap" aria-live="polite">
        {panic
          ? 'A kernel crash takes everything down. That’s why only the kernel gets full control, and it’s protected.'
          : closed.length
            ? 'Chrome crashed and closed. VS Code and Music kept running: user space keeps apps apart.'
            : 'Try both buttons and compare what happens.'}
      </p>
    </div>
  )
}

export default function Spaces() {
  return (
    <>
      <Section
        id="spaces"
        eyebrow="Part 2 · Two spaces"
        title="What if apps directly controlled the hardware?"
        intro="Think for a moment before you scroll: what could go wrong?"
        steps={4}
      >
        <div className="l4-whatif">
          <Reveal className="l4-whatif-q">
            <img src={img.question} alt="" />
          </Reveal>
          <ul className="l4-whatif-list">
            {['System crashes', 'Security risks', 'Data corruption'].map((t, i) => (
              <Step as="li" key={t} n={i + 1} delay={i * 0.1}>
                <span aria-hidden="true">✗</span> {t}
              </Step>
            ))}
          </ul>
        </div>
        <Step n={4}>
          <h3 className="sub">The solution: two separate spaces</h3>
          <div className="l4-spaces">
            <div className="l4-space us">
              <p className="eyebrow">User space</p>
              <h3>Limited access</h3>
              <p>Where your apps, the shell and the desktop run. They must ask the kernel for anything involving hardware.</p>
            </div>
            <div className="l4-space ks">
              <p className="eyebrow">Kernel space</p>
              <h3>Full control</h3>
              <p>Only the kernel runs here. It talks to the CPU, memory and devices directly.</p>
            </div>
          </div>
        </Step>
      </Section>
      <Section id="crash" eyebrow="Separation = stability + security" title="Crash an app, then crash the kernel" tone="alt">
        <Reveal>
          <CrashSim />
        </Reveal>
        <Callout>On a server, this separation means one broken app can’t take down every website on the machine.</Callout>
      </Section>
    </>
  )
}
