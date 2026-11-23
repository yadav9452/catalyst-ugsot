import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Illo, Reveal, Section, Step, useStep } from '../../../design-system'
import { CodeEditor } from '../../../design-system/illustrations'
import { logo, photos } from '../images'
import { DevicePic } from './devices'

/* ---------- What's missing? ---------- */

const parts = [
  ['CPU', photos.cpu],
  ['RAM', photos.ram],
  ['Keyboard', photos.keyboard],
  ['Monitor', photos.monitor],
]

function Missing() {
  const { shown } = useStep()
  const lit = shown(2)
  return (
    <div className="missing">
      <div className="missing-sw">
        <motion.div className="missing-code" animate={{ opacity: lit ? 1 : 0.15, scale: lit ? 1 : 0.9 }}>
          <CodeEditor size={96} />
          <strong>Software</strong>
        </motion.div>
        <motion.div className="missing-arrow" animate={{ opacity: lit ? 1 : 0 }} aria-hidden="true">
          <span>instructions</span>
          <span className="flow-line" />
        </motion.div>
      </div>
      <div className="missing-hw">
        {parts.map(([t, img], i) => (
          <motion.div
            key={t}
            className="missing-part"
            animate={{ filter: lit ? 'grayscale(0)' : 'grayscale(1)', opacity: lit ? 1 : 0.55 }}
            transition={{ delay: lit ? i * 0.12 : 0 }}
          >
            <img src={img} alt={t} />
            <span>{lit ? t : '?'}</span>
          </motion.div>
        ))}
      </div>
      <p className="missing-caption">
        {lit ? 'Software gives the instructions. Hardware carries them out.' : 'All this hardware… but who tells it what to do, and when?'}
      </p>
    </div>
  )
}

/* ---------- System software: the kinds ---------- */

const systemKinds = [
  {
    name: 'Operating system (OS)',
    illo: 'OsWindows',
    what: 'The main program that starts when you switch on. It runs the whole computer and every other program runs on top of it.',
    ex: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'],
  },
  {
    name: 'Device drivers',
    illo: 'Printer',
    what: 'Small programs that teach the OS how to talk to one device: a printer, a Wi-Fi card, a graphics card, a webcam.',
    ex: ['Printer driver', 'Graphics driver', 'Wi-Fi driver'],
  },
  {
    name: 'Utility software',
    illo: 'Shield',
    what: 'Helper programs that look after the computer: keep it safe, clean and backed up.',
    ex: ['Antivirus', 'Disk Cleanup', 'Backup tools', 'File compression (zip)'],
  },
  {
    name: 'Firmware (BIOS / UEFI)',
    illo: 'Motherboard',
    what: 'Software stored in the ROM chip. It checks the hardware and starts the OS when you press the power button.',
    ex: ['BIOS', 'UEFI', 'Router firmware'],
  },
]

const functions = [
  ['Memory management', 'Decides which program gets which part of RAM', 'Ram'],
  ['Processor scheduling', 'Decides which program uses the CPU, and when', 'Clock'],
  ['File handling', 'Keeps files and folders organised on storage', 'Folder'],
  ['Security', 'Controls who can open what, and blocks threats', 'Shield'],
]

/* ---------- Application software: categories ---------- */

const appCats = [
  ['Web browsers', 'BrowserWindow', 'Open websites', ['Chrome', 'Edge', 'Safari', 'Firefox']],
  ['Communication', 'Phone', 'Talk, message and meet', ['WhatsApp', 'Gmail', 'Zoom', 'Google Meet']],
  ['Office and study', 'Folder', 'Write, calculate, present', ['MS Word', 'Excel', 'PowerPoint', 'Google Docs']],
  ['Entertainment', 'Headphones', 'Watch, listen, play', ['YouTube', 'Netflix', 'Spotify', 'Games']],
  ['Photos and design', 'Camera', 'Create and edit pictures', ['Canva', 'Photoshop', 'Phone gallery editor']],
  ['Shopping and payments', 'Atm', 'Buy things and pay', ['Amazon', 'Flipkart', 'Google Pay', 'PhonePe']],
]

/* ---------- Sorting game ---------- */

const sortItems = [
  ['Windows 11', 'system', 'An operating system: it runs the whole computer.'],
  ['Google Chrome', 'app', 'A browser: it does one job for you, opening websites.'],
  ['Printer driver', 'system', 'A device driver: it lets the OS talk to the printer.'],
  ['WhatsApp', 'app', 'A messaging app you use directly.'],
  ['Antivirus', 'system', 'Utility software: it protects the system in the background.'],
  ['Android', 'system', 'The operating system of most phones.'],
  ['Microsoft Excel', 'app', 'A spreadsheet app for a specific task.'],
  ['BIOS', 'system', 'Firmware: it starts the computer before the OS loads.'],
  ['Spotify', 'app', 'A music app you use directly.'],
]

function SortGame() {
  const [picks, setPicks] = useState({})
  const done = Object.keys(picks).length
  const right = sortItems.filter(([n, k]) => picks[n] === k).length
  return (
    <div className="sort-game">
      <div className="sort-grid">
        {sortItems.map(([name, kind, why]) => {
          const pick = picks[name]
          const state = pick ? (pick === kind ? 'is-right' : 'is-wrong') : ''
          return (
            <div key={name} className={`sort-card ${state}`}>
              <strong>{name}</strong>
              <div className="sort-btns" role="group" aria-label={`Is ${name} system or application software?`}>
                {[
                  ['system', 'System'],
                  ['app', 'Application'],
                ].map(([k, label]) => (
                  <button key={k} type="button" aria-pressed={pick === k} onClick={() => setPicks((p) => ({ ...p, [name]: k }))}>
                    {label}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {pick && (
                  <motion.p className="sort-why" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    {pick === kind ? '✓ ' : `✗ It’s ${kind === 'system' ? 'system' : 'application'} software. `}
                    {why}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      <div className="sort-foot" aria-live="polite">
        <span>
          {done === 0 ? 'Pick an answer for each one.' : `${right} of ${done} correct`}
          {done === sortItems.length && right === sortItems.length && ' 🎉 Perfect!'}
        </span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPicks({})} disabled={done === 0}>
          ↺ Try again
        </button>
      </div>
    </div>
  )
}

/* ---------- Clicking Print: how the layers work together ---------- */

const chain = [
  ['MS Word', 'Application software', 'You click Print. Word doesn’t know how to control a printer, so it asks Windows to print the page.', 'Folder'],
  ['Windows', 'Operating system', 'Windows puts the page in the print queue and hands it to the printer’s driver.', 'OsWindows'],
  ['Printer driver', 'Device driver', 'The driver translates the page into the exact signals this printer model understands.', 'Gear'],
  ['Printer', 'Hardware', 'The printer receives the signals and puts ink on paper.', 'Printer'],
]

function PrintChain() {
  const [at, setAt] = useState(-1)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return undefined
    const t = setTimeout(
      () => {
        if (at + 1 >= chain.length - 1) setPlaying(false)
        setAt(at + 1)
      },
      at < 0 ? 200 : 1500,
    )
    return () => clearTimeout(t)
  }, [playing, at])
  return (
    <div className="print-chain">
      <div className="print-row">
        {chain.map(([name, kind, , illo], i) => (
          <div key={name} className={`print-node ${at === i ? 'is-on' : ''} ${at > i ? 'is-done' : ''}`}>
            <span className="print-art">
              {kind === 'Hardware' ? <DevicePic id="printer" alt="An inkjet printer" size={64} /> : <Illo name={illo} size={64} />}
            </span>
            <strong>{name}</strong>
            <small>{kind}</small>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={at} className="print-caption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
          {at < 0 ? 'What really happens when you click Print? Press the button to follow the page.' : chain[at][2]}
        </motion.p>
      </AnimatePresence>
      <div className="print-btns">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setAt(-1)
            setPlaying(true)
          }}
          disabled={playing}
        >
          🖨 Click Print
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setAt((a) => Math.min(a + 1, chain.length - 1))}
          disabled={playing || at >= chain.length - 1}
        >
          Next step ▶
        </button>
      </div>
    </div>
  )
}

/* ---------- Layers and comparison ---------- */

function Rings() {
  const { shown } = useStep()
  const ring = (n) => ({ opacity: shown(n) ? 1 : 0.1, scale: shown(n) ? 1 : 0.85 })
  const chrome = logo('chrome')
  const win = logo('windows')
  return (
    <div className="rings" role="img" aria-label="Layers: hardware in the centre, system software around it, application software on the outside">
      <motion.div className="ring r3" animate={ring(4)}>
        <span className="ring-label">
          Application software
          <span className="ring-logos">{chrome && <img src={chrome} alt="" />}</span>
        </span>
        <motion.div className="ring r2" animate={ring(3)}>
          <span className="ring-label">
            System software
            <span className="ring-logos">{win && <img src={win} alt="" />}</span>
          </span>
          <motion.div className="ring r1" animate={ring(2)}>
            <Illo name="Cpu" size={56} />
            <span className="ring-label">Hardware</span>
          </motion.div>
        </motion.div>
      </motion.div>
      <p className="rings-note">Apps never talk to the hardware directly: they go through the operating system.</p>
    </div>
  )
}

const compare = [
  ['Works with', 'The hardware', 'The user'],
  ['Purpose', 'Runs and manages the computer', 'Does one specific task for you'],
  ['When it runs', 'All the time, in the background', 'Only when you open it'],
  ['Can the computer work without it?', 'No: without an OS, nothing runs', 'Yes: other apps still work'],
  ['How you get it', 'Comes with the computer', 'You install the ones you need'],
  ['Examples', 'Windows, Android, drivers, BIOS', 'Chrome, WhatsApp, Word, Spotify'],
]

function CompareFill() {
  const { guided, shown } = useStep()
  const [open, setOpen] = useState(false)
  const show = guided ? shown(5) : open
  return (
    <div>
      <div className="table-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">System software</th>
              <th scope="col">Application software</th>
            </tr>
          </thead>
          <tbody>
            {compare.map(([f, s, a]) => (
              <tr key={f}>
                <th scope="row">{f}</th>
                <td>
                  {show ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {s}
                    </motion.span>
                  ) : (
                    '?'
                  )}
                </td>
                <td>
                  {show ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {a}
                    </motion.span>
                  ) : (
                    '?'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!guided && (
        <button type="button" className="btn btn-ghost btn-sm compare-btn" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide answers' : 'Pause, fill it in, then show answers'}
        </button>
      )}
    </div>
  )
}

export default function Software() {
  return (
    <>
      <Section
        id="software"
        eyebrow="Part 2 · Software and instructions"
        title="What’s missing?"
        intro="We have all these parts. But who tells them what to do, and when?"
        steps={5}
      >
        <Step n={1}>
          <Missing />
        </Step>
        <h3 className="sub">Software is a set of instructions that tells a computer…</h3>
        <div className="card-grid three">
          {[
            ['What to do', 'Add these numbers, show this page'],
            ['When to do it', 'When the user clicks Save'],
            ['How to do it', 'Step by step, in the right order'],
          ].map(([t, d], i) => (
            <Step key={t} n={i + 3} className="card wwh-card" delay={i * 0.08}>
              <span className="wwh-q">?</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <Callout>When you write code, you are writing software.</Callout>
      </Section>


      <Section
        id="software-types"
        eyebrow="Two types of software"
        title="System software vs application software"
        intro="All software falls into two groups: software that runs the computer, and software that does jobs for you."
        steps={3}
      >
        <div className="sw-types">
          <Step n={1} className="sw-type system">
            <p className="sw-type-tag">System software</p>
            <h3>The manager</h3>
            <p>Software that runs and manages the computer itself. It works in the background so that the hardware and every app can work.</p>
            <ul>
              <li>Works closest to the hardware</li>
              <li>Starts first, when you switch on</li>
              <li>Runs all the time, mostly unseen</li>
              <li>Gives apps a safe way to use the hardware</li>
            </ul>
            <p className="sw-examples">
              {logo('windows') && <img src={logo('windows')} alt="" />}
              Windows, macOS, Linux, Android, drivers, BIOS
            </p>
          </Step>
          <Step n={1} className="sw-type app" delay={0.1}>
            <p className="sw-type-tag">Application software</p>
            <h3>The task doer</h3>
            <p>Software you open to get a specific job done: browse, chat, write, watch, pay. Often just called an “app”.</p>
            <ul>
              <li>Works closest to the user</li>
              <li>Each app does one kind of job</li>
              <li>Runs only when you open it</li>
              <li>Most of what you’ll build is application software</li>
            </ul>
            <p className="sw-examples">
              {logo('chrome') && <img src={logo('chrome')} alt="" />}
              Chrome, WhatsApp, Word, YouTube, Google Pay
            </p>
          </Step>
        </div>
        <Step n={2}>
          <Callout label="Think of a school">
            The principal, office staff and electrician keep the school running. You rarely see them, but nothing works without them: that’s{' '}
            <strong>system software</strong>. Each subject teacher helps you with one thing you came to learn: that’s <strong>application software</strong>.
          </Callout>
        </Step>
        <Step n={3}>
          <Callout label="Quick test">
            Ask: <em>“Can the computer still work without it?”</em> Remove Windows and the computer can’t run anything, so Windows is system software. Remove
            Chrome and everything else still works, so Chrome is application software.
          </Callout>
        </Step>
      </Section>

      <Section
        id="system-sw"
        eyebrow="System software"
        title="System software: the computer’s manager"
        intro="System software comes in four kinds. The operating system is the most important one."
        tone="alt"
        steps={4}
      >
        <div className="sw-kinds">
          {systemKinds.map((k, i) => (
            <Step key={k.name} n={i < 2 ? 1 : 2} className="sw-kind" delay={(i % 2) * 0.08}>
              <span className="sw-kind-art">
                <Illo name={k.illo} size={72} />
              </span>
              <div>
                <h3>{k.name}</h3>
                <p>{k.what}</p>
                <p className="sw-chips">
                  {k.ex.map((e) => (
                    <span key={e}>{e}</span>
                  ))}
                </p>
              </div>
            </Step>
          ))}
        </div>
        <Step n={3}>
          <h3 className="sub">What does the operating system do?</h3>
        </Step>
        <div className="card-grid four">
          {functions.map(([t, d, illo], i) => (
            <Step key={t} n={i < 2 ? 3 : 4} className="card fn-card" delay={i * 0.08}>
              <Illo name={illo} size={56} />
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
      </Section>

      <Section
        id="app-sw"
        eyebrow="Application software"
        title="Application software: the apps you use every day"
        intro="Every app is built for a job. Here are the main groups, with apps you already use."
        steps={2}
      >
        <div className="app-cats">
          {appCats.map(([t, illo, job, ex], i) => (
            <Reveal key={t} delay={(i % 3) * 0.08} className="app-cat">
              <span className="app-cat-art">
                <Illo name={illo} size={60} />
              </span>
              <h3>{t}</h3>
              <p className="app-cat-job">{job}</p>
              <p className="sw-chips">
                {ex.map((e) => (
                  <span key={e}>{e}</span>
                ))}
              </p>
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <h3 className="sub">Try it: system or application?</h3>
          <SortGame />
        </Step>
        <Step n={2}>
          <Callout label="Your future job">
            In this program you’ll build application software: websites and apps that people open to get something done. They will run on top of system software
            like Linux, Windows and Android.
          </Callout>
        </Step>
      </Section>

      <Section
        id="sw-together"
        eyebrow="Working together"
        title="How system and application software work together"
        intro="Apps never talk to the hardware directly. Every request goes down through the layers."
        tone="alt"
        steps={5}
      >
        <Step n={1}>
          <PrintChain />
        </Step>
        <h3 className="sub">Layers of a computer system</h3>
        <Rings />
        <h3 className="sub">Compare them</h3>
        <CompareFill />
        <Callout label="Coming up">In the next lecture we start learning Linux: the operating system that runs most web servers.</Callout>
      </Section>
    </>
  )
}
