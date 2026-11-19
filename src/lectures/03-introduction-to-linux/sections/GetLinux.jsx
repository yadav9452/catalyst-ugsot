import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Code, CopyButton, PauseBadge, Section, Step } from '../../../design-system'
import { img } from '../images'

const ways = [
  {
    k: 'win',
    label: 'I use Windows',
    logo: img.windows,
    title: 'Install WSL (Windows Subsystem for Linux)',
    steps: [
      'Press Win + X (or right-click Start) and choose “Terminal (Admin)” or “PowerShell (Admin)”',
      'Type the command below and press Enter. It installs WSL with Ubuntu (needs Windows 11, or Windows 10 version 2004 or newer)',
      'Restart your laptop when it asks',
      'Press the Windows key, type “Ubuntu” and press Enter. Create a username and password (the password stays invisible while you type: that’s normal)',
      'Tip: right-click Ubuntu on the taskbar → Pin to taskbar, so it’s one click away',
    ],
    code: 'wsl --install',
    note: 'You now have a real Ubuntu terminal running inside Windows.',
  },
  {
    k: 'mac',
    label: 'I use a Mac',
    logo: img.apple,
    title: 'Open Terminal: you already have a UNIX shell',
    steps: [
      'Press ⌘ Cmd + Space to open Spotlight and type “Terminal”',
      'Press Return (the Mac’s Enter key) to open it',
      'Type the command below and press Return',
      'Tip: right-click the Terminal icon in the Dock → Options → Keep in Dock',
    ],
    code: 'uname -s',
    note: 'It prints “Darwin”: macOS’s own UNIX-based core. Most Linux commands work here as they are.',
  },
  {
    k: 'vm',
    label: 'Any laptop',
    logo: img.tux,
    title: 'Run Ubuntu in a virtual machine',
    steps: [
      'Install VirtualBox (free) from virtualbox.org',
      'Download the Ubuntu Desktop .iso file from ubuntu.com',
      'In VirtualBox, click New, choose the .iso, and give it 4 GB RAM or more',
      'Start the VM and follow the Ubuntu installer',
    ],
    code: '',
    note: 'A virtual machine is a computer inside your computer. Nothing on your laptop is changed.',
  },
]

function Setup() {
  const [k, setK] = useState('win')
  const w = ways.find((x) => x.k === k)
  return (
    <div className="setup">
      <div className="setup-tabs" role="tablist" aria-label="Your laptop">
        {ways.map((x) => (
          <button key={x.k} type="button" role="tab" aria-selected={k === x.k} className={`setup-tab ${k === x.k ? 'is-on' : ''}`} onClick={() => setK(x.k)}>
            <img src={x.logo} alt="" />
            {x.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={w.k}
          role="tabpanel"
          className="setup-panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <h3>{w.title}</h3>
          <ol className="setup-steps">
            {w.steps.map((s, i) => (
              <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                {s}
              </motion.li>
            ))}
          </ol>
          {w.code && (
            <div className="setup-code">
              <Code lines={[w.code]} />
              <CopyButton text={w.code} />
            </div>
          )}
          <p className="setup-note">{w.note}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Which OS when? ---------- */

const os = [
  ['Windows', img.windows],
  ['macOS', img.apple],
  ['Linux', img.tux],
]
const scenarios = [
  ['Hosting your website on a cloud server', 'Linux', 'Servers and cloud machines almost always run Linux.'],
  ['Playing the latest PC games', 'Windows', 'Most games are made for Windows first.'],
  ['Building an iPhone app in Xcode', 'macOS', 'Xcode, Apple’s tool for iPhone apps, runs only on macOS.'],
  ['Running a DevOps pipeline with Docker', 'Linux', 'Docker containers are built on Linux kernel features.'],
  ['Editing video in Final Cut Pro', 'macOS', 'Final Cut Pro is an Apple app for the Mac.'],
]

function WhichOS() {
  const [ans, setAns] = useState({})
  return (
    <div className="which">
      {scenarios.map(([s, right, why], i) => {
        const a = ans[i]
        return (
          <div key={s} className={`which-row ${a ? (a === right ? 'ok' : 'no') : ''}`}>
            <p className="which-s">{s}</p>
            <div className="which-btns">
              {os.map(([n, logo]) => (
                <button
                  key={n}
                  type="button"
                  aria-label={n}
                  title={n}
                  aria-pressed={a === n}
                  className={a === n ? 'is-on' : ''}
                  onClick={() => setAns((x) => ({ ...x, [i]: n }))}
                >
                  <img src={logo} alt="" />
                </button>
              ))}
            </div>
            <p className="which-why" aria-live="polite">
              {a ? (a === right ? `✓ ${why}` : `✗ Try again. Hint: ${why}`) : ' '}
            </p>
          </div>
        )
      })}
    </div>
  )
}

const table = [
  ['Windows', 'General use, students, gaming, business', 'Easy to use, compatible, widely available'],
  ['macOS', 'Creative professionals, development, Apple ecosystem', 'Stable, secure, seamless with Apple devices'],
  ['Linux', 'Developers, IT professionals, servers, cloud', 'Secure, customisable, free'],
]

export default function GetLinux() {
  return (
    <>
      <Section
        id="which-os"
        eyebrow="When to use which?"
        title="Pick the best OS for the job"
        intro="There’s no single best operating system, only the right one for the task. Click a logo for each situation."
        steps={1}
      >
        <WhichOS />
        <Step n={1}>
          <h3 className="sub">Summary</h3>
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">Operating system</th>
                  <th scope="col">Best use case</th>
                  <th scope="col">Key strengths</th>
                </tr>
              </thead>
              <tbody>
                {table.map(([o, u, k]) => (
                  <tr key={o}>
                    <th scope="row">{o}</th>
                    <td>{u}</td>
                    <td>{k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
      </Section>

      <Section
        id="get-linux"
        eyebrow="Before the next lecture"
        title="Get Linux on your laptop"
        intro="You don’t need to replace your OS. Pick your laptop and follow the steps."
        tone="alt"
      >
        <Setup />
        <PauseBadge>Set this up before Lecture 4: we start typing commands there</PauseBadge>
      </Section>
    </>
  )
}
