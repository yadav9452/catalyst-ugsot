import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'

/* ---------- Hook: how do you install an app on your phone? ---------- */

const ways = [
  {
    k: 'store',
    icon: '🛍',
    label: 'Open the app store and tap Install',
    good: true,
    msg: 'One tap. The store finds the app, checks it’s safe, downloads it and keeps it updated. You never think about what’s inside.',
  },
  {
    k: 'web',
    icon: '🌐',
    label: 'Search the web and download the file from any site',
    good: false,
    msg: 'Risky. Is that file the real app or a copy with a virus? Which version? And who updates it next month?',
  },
  {
    k: 'friend',
    icon: '📲',
    label: 'Ask a friend to send you the file',
    good: false,
    msg: 'It may not work on your phone, it may be an old version, and it will never update itself.',
  },
]

const twins = [
  ['🛍', 'App store', '🗄', 'Repository', 'A trusted place that stores the software'],
  ['👆', 'The Install button', '⌨️', 'sudo apt install', 'One command installs it'],
  ['🔄', '“Update all”', '⬆️', 'sudo apt upgrade', 'Brings everything up to date'],
  ['🧩', 'The parts an app needs', '📦', 'Dependencies', 'Installed for you, automatically'],
]

function PhoneHook() {
  const [pick, setPick] = useState(null)
  const w = ways.find((x) => x.k === pick)
  return (
    <div className="l7-hook">
      <div className="l7-hook-phone" aria-hidden="true">
        <span>📱</span>
        <small>You want a new app…</small>
      </div>
      <div className="l7-hook-side">
        <div className="l7-hook-opts" role="group" aria-label="How would you install it?">
          {ways.map((x) => (
            <button key={x.k} type="button" className={`l7-opt-card ${pick === x.k ? (x.good ? 'is-right' : 'is-wrong') : ''}`} aria-pressed={pick === x.k} onClick={() => setPick(x.k)}>
              <span aria-hidden="true">{x.icon}</span> {x.label}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {w && (
              <motion.p key={w.k} className={`l7-msg ${w.good ? '' : 'is-bad'}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {w.msg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Twin({ t }) {
  const [open, setOpen] = useState(false)
  return (
    <button type="button" className={`l7-twin ${open ? 'is-open' : ''}`} aria-pressed={open} onClick={() => setOpen(!open)}>
      <span className="l7-twin-phone">
        <span aria-hidden="true">{t[0]}</span> {t[1]}
      </span>
      <span className="l7-twin-arrow" aria-hidden="true">
        {open ? '↓' : '?'}
      </span>
      {open ? (
        <motion.span className="l7-twin-linux" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <span aria-hidden="true">{t[2]}</span> <strong>{t[3]}</strong>
          <small>{t[4]}</small>
        </motion.span>
      ) : (
        <span className="l7-twin-linux is-hidden">Tap to see the Linux version</span>
      )}
    </button>
  )
}

/* ---------- The problem: install nginx by hand ---------- */

const PARTS = {
  nginx: { needs: ['nginx-common', 'libpcre2', 'libssl3', 'zlib1g'], what: 'the web server itself' },
  'nginx-common': { needs: [], what: 'shared config files' },
  libpcre2: { needs: [], what: 'pattern-matching library' },
  libssl3: { needs: ['libc6 (newer)'], what: 'encryption library for HTTPS' },
  zlib1g: { needs: [], what: 'compression library' },
  'libc6 (newer)': { needs: [], what: 'the core C library', warn: true },
}

function DependencyHunt() {
  const [seen, setSeen] = useState(['nginx'])
  const [done, setDone] = useState([])
  const [log, setLog] = useState('Click “Install” on nginx to begin.')
  const [steps, setSteps] = useState(0)
  const [apt, setApt] = useState(false)

  function tryInstall(name) {
    setSteps((s) => s + 1)
    const missing = PARTS[name].needs.filter((n) => !done.includes(n))
    if (missing.length) {
      setSeen((s) => [...s, ...missing.filter((m) => !s.includes(m))])
      setLog(`❌ ${name} won’t install. It needs: ${missing.join(', ')}. Go and find ${missing.length > 1 ? 'them' : 'it'} first…`)
      return
    }
    setDone((d) => [...d, name])
    setLog(
      PARTS[name].warn
        ? `⚠️ Installed ${name}, but replacing the core C library could break hundreds of other programs. Hope nothing else needed the old one!`
        : `✓ ${name} installed.${name === 'nginx' ? ' Finally!' : ''}`,
    )
  }

  function reset() {
    setSeen(['nginx'])
    setDone([])
    setSteps(0)
    setApt(false)
    setLog('Click “Install” on nginx to begin.')
  }

  const finished = done.includes('nginx')
  return (
    <div className="l7-hunt">
      <div className="l7-hunt-panel">
        <p className="l7-pick-label">
          The manual way: download each piece from its website <span className="l7-hunt-count">{steps} clicks · about {steps * 4} min</span>
        </p>
        <ul className="l7-hunt-list">
          {seen.map((n) => (
            <motion.li key={n} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={done.includes(n) ? 'is-done' : ''}>
              <span className="l7-hunt-name">
                <code>{n}</code> <small>{PARTS[n].what}</small>
              </span>
              {done.includes(n) ? (
                <span className="l7-hunt-ok">✓ installed</span>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => tryInstall(n)} disabled={apt}>
                  Install
                </button>
              )}
            </motion.li>
          ))}
        </ul>
        <p className={`l7-msg ${log.startsWith('❌') || log.startsWith('⚠️') ? 'is-bad' : ''}`} aria-live="polite">
          {log}
        </p>
        {finished && (
          <p className="l7-hunt-sum">
            {steps} clicks and about {steps * 4} minutes for one program. Now imagine 500 programs, and doing it all again for every update.
          </p>
        )}
      </div>
      <div className="l7-hunt-panel is-apt">
        <p className="l7-pick-label">The package manager way</p>
        <div className="l7-cmd">
          <span className="l7-p">~$</span> sudo apt install <b>nginx</b>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setApt(true)} disabled={apt}>
          ▶ Run it
        </button>
        <AnimatePresence>
          {apt && (
            <motion.ul className="l7-apt-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Object.keys(PARTS)
                .filter((n) => !PARTS[n].warn)
                .map((n, k) => (
                  <motion.li key={n} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.15 }}>
                    ✓ {n}
                  </motion.li>
                ))}
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="l7-apt-time">
                1 command · about 10 seconds · every piece checked and compatible
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
        <button type="button" className="l7-link-btn" onClick={reset}>
          ↺ Start again
        </button>
      </div>
    </div>
  )
}

const consequences = [
  ['🌀', 'Chaos', 'Every program needs other pieces, which need more pieces. Nobody can track thousands of them by hand, and versions clash.'],
  ['☠️', 'Security risk', 'Files from random websites can be fake or infected, and forgotten programs never get their security fixes.'],
  ['⏳', 'Time waste', 'Hours spent hunting files and fixing broken installs, instead of building your project.'],
]

/* ---------- History ---------- */

const eras = [
  ['1990s', 'Manual', '🧰', 'People downloaded source code, compiled it and copied files around by hand. Every computer was a little different.'],
  ['1993–97', '.deb and .rpm', '📦', 'Debian (1993) and Red Hat bring package files: one file holds a program plus details like its version and what it needs. Tools like dpkg install them.'],
  ['1998', 'APT', '🧠', 'APT arrives on Debian. It downloads packages from repositories and installs dependencies automatically. Ubuntu still uses it today.'],
  ['Today', 'Universal formats', '🌍', 'Snap, Flatpak and AppImage run the same app on many Linux versions. Developers also use npm, pip and Homebrew: the same idea for code.'],
]

function Timeline() {
  const { guided, step } = useStep()
  const [pick, setPick] = useState(0)
  const active = guided ? Math.max(0, Math.min(step, eras.length) - 1) : pick
  return (
    <div className="l7-time">
      <div className="l7-time-track" role="group" aria-label="Pick a point in history">
        {eras.map((e, k) => (
          <button key={e[0]} type="button" className={`l7-time-dot ${k === active ? 'is-on' : ''} ${k < active ? 'is-past' : ''}`} aria-pressed={k === active} onClick={() => setPick(k)} disabled={guided}>
            <span aria-hidden="true">{e[2]}</span>
            <strong>{e[0]}</strong>
            <small>{e[1]}</small>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} className="l7-time-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
          <h3>
            {eras[active][0]}: {eras[active][1]}
          </h3>
          <p>{eras[active][3]}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Intro() {
  return (
    <>
      <Section id="intro" eyebrow="Part 1 · Warm-up" title="How do you install software on your phone?" intro="Pick the way you’d do it. Then see how Linux does the same job." steps={1}>
        <Reveal>
          <PhoneHook />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">Linux had an “app store” long before phones did</h3>
          <p className="l7-lead">It’s called a package manager. Each part of your phone’s app store has a Linux twin. Tap a card to find it.</p>
          <div className="l7-twins">
            {twins.map((t) => (
              <Twin key={t[1]} t={t} />
            ))}
          </div>
        </Step>
      </Section>

      <Section
        id="problem"
        eyebrow="The problem"
        title="Why package management exists"
        intro="Let’s install nginx, a popular web server, without a package manager. Each piece needs other pieces, called dependencies. Try it."
        tone="alt"
        steps={1}
      >
        <Reveal>
          <DependencyHunt />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">Doing this by hand for thousands of pieces leads to three things</h3>
          <div className="card-grid three">
            {consequences.map(([icon, t, d]) => (
              <div key={t} className="card">
                <span className="card-icon" aria-hidden="true">
                  {icon}
                </span>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Step>
      </Section>

      <Section id="history" eyebrow="A short history" title="From copying files by hand to one command" intro="Package management grew up with Linux. Click through the timeline." steps={4}>
        <Reveal>
          <Timeline />
        </Reveal>
        <Callout>
          You’ll meet the same idea again and again: npm for JavaScript, pip for Python, Composer for PHP. Learn how apt works today and every package manager will feel
          familiar.
        </Callout>
      </Section>
    </>
  )
}
