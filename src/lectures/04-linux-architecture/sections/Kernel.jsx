import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Section, Step, useStep } from '../../../design-system'

const jobs = [
  ['⏱', 'Process scheduling', 'Which program runs on the CPU, and when'],
  ['🧠', 'Memory allocation', 'Which program gets which part of RAM'],
  ['🔌', 'Device communication', 'Talks to disks, keyboards and network cards through drivers'],
  ['🗂', 'File system management', 'Keeps files and folders on storage'],
  ['🔐', 'Security & permissions', 'Who may open, change or run what'],
]

/* ---------- Monolithic vs microkernel ---------- */

const services = ['Scheduler', 'Memory', 'File systems', 'Drivers']

function Designs() {
  const { guided, shown } = useStep()
  const [pick, setPick] = useState('mono')
  const mode = guided ? (shown(7) ? 'micro' : 'mono') : pick
  const mono = mode === 'mono'
  return (
    <div className="l4-design">
      <div className="segmented" role="group" aria-label="Kernel design">
        <button type="button" className={mono ? 'is-on' : ''} aria-pressed={mono} onClick={() => setPick('mono')}>
          Monolithic (Linux)
        </button>
        <button type="button" className={!mono ? 'is-on' : ''} aria-pressed={!mono} onClick={() => setPick('micro')}>
          Microkernel (MINIX, QNX)
        </button>
      </div>
      <div className={`l4-design-stage ${mono ? 'mono' : 'micro'}`}>
        <div className="l4-design-user">
          <span className="l4-design-tag">User space</span>
          <span className="l4-svc app">Apps</span>
          <AnimatePresence>
            {!mono &&
              services.map((s) => (
                <motion.span key={s} layoutId={`svc-${s}`} className="l4-svc moved">
                  {s}
                </motion.span>
              ))}
          </AnimatePresence>
        </div>
        <div className="l4-design-line">system calls / messages</div>
        <motion.div layout className="l4-design-kernel">
          <span className="l4-design-tag">Kernel space</span>
          {mono ? (
            services.map((s) => (
              <motion.span key={s} layoutId={`svc-${s}`} className="l4-svc">
                {s}
              </motion.span>
            ))
          ) : (
            <span className="l4-svc tiny">Tiny core: messages + basic scheduling</span>
          )}
        </motion.div>
      </div>
      <div className="l4-design-pros">
        {mono ? (
          <>
            <p>✓ Fast: everything talks directly inside the kernel</p>
            <p>✓ Efficient resource handling</p>
            <p className="con">✗ Trade-off: one buggy driver can crash the whole system</p>
          </>
        ) : (
          <>
            <p>✓ A crashed service can restart without taking the kernel down</p>
            <p className="con">✗ Slower: services must send messages across the boundary</p>
            <p>Windows and macOS sit in between, with “hybrid” kernels.</p>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- Loadable modules ---------- */

const baseMods = ['ext4', 'snd_hda_intel', 'i915', 'usbhid']

function Modules() {
  const [wifi, setWifi] = useState(false)
  const mods = wifi ? [...baseMods, 'rtl8xxxu'] : baseMods
  return (
    <div className="l4-mods">
      <div className="l4-mods-kernel">
        <span className="l4-design-tag">Running kernel</span>
        <div className="l4-mods-slots">
          <AnimatePresence>
            {mods.map((m) => (
              <motion.span
                key={m}
                className={`l4-mod ${m === 'rtl8xxxu' ? 'new' : ''}`}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {m}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <button type="button" className="btn btn-sm l4-plug" onClick={() => setWifi((w) => !w)}>
          {wifi ? '⏏ Unplug the USB Wi-Fi adapter' : '🔌 Plug in a USB Wi-Fi adapter'}
        </button>
      </div>
      <div className="tty">
        <div className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          Terminal
        </div>
        <div className="tty-body">
          <p>
            <span className="tty-prompt">$</span> lsmod
          </p>
          <p className="tty-out">Module Used by</p>
          {mods.map((m) => (
            <p key={m} className={`tty-out ${m === 'rtl8xxxu' ? 'tty-hl' : ''}`}>
              {m.padEnd(18, ' ')}
              {m === 'rtl8xxxu' ? '0   ← just loaded' : '1'}
            </p>
          ))}
        </div>
      </div>
      <p className="l4-mods-cap" aria-live="polite">
        {wifi ? 'Linux loaded the Wi-Fi driver as a module, without restarting.' : 'Loadable modules let Linux add or remove drivers while it runs.'}
      </p>
    </div>
  )
}

export default function Kernel() {
  return (
    <Section id="kernel" eyebrow="Part 4 · The kernel" title="Kernel = the core of Linux. What does it do?" steps={7}>
      <div className="l4-jobs">
        {jobs.map(([ico, t, d], i) => (
          <Step key={t} n={i + 1} className="l4-job" delay={i * 0.06}>
            <span className="l4-job-ico" aria-hidden="true">
              {ico}
            </span>
            <strong>{t}</strong>
            <span>{d}</span>
          </Step>
        ))}
      </div>
      <Step n={6}>
        <h3 className="sub">Kernel design: Linux uses a monolithic kernel with loadable modules</h3>
        <Designs />
      </Step>
      <h3 className="sub">Loadable modules: add a driver while Linux runs</h3>
      <Modules />
      <Callout label="Link back">
        These five jobs are Lecture 3’s six OS jobs, seen from inside: scheduling is multitasking, memory allocation is memory management…
      </Callout>
    </Section>
  )
}
