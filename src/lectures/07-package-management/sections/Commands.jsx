import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Callout, OsKeys, PauseBadge, Reveal, Section } from '../../../design-system'
import { freshState, run } from './aptSim'
import { img } from '../images'

const setupRows = [
  ['Package manager', 'apt (Ubuntu inside WSL)', 'Homebrew (brew). Macs don’t have apt.'],
  ['Refresh the list', 'sudo apt update', 'brew update'],
  ['Install a program', 'sudo apt install tree', 'brew install tree'],
  ['Upgrade everything', 'sudo apt upgrade', 'brew upgrade'],
  ['Remove a program', 'sudo apt remove tree', 'brew uninstall tree'],
  ['Search', 'apt search tree', 'brew search tree'],
  ['sudo asks for…', 'the Linux password you set when you installed Ubuntu. Nothing appears while you type: that’s normal. Press [Enter].', 'brew never needs sudo'],
  ['Answering [Y/n]', 'Press [Enter] for yes (Y is the default), or type n', 'brew doesn’t ask'],
]

/* State helpers: each example runs on a pretend Ubuntu prepared for it. */
const exec = (st, cmds) => cmds.reduce((s, c) => run(c, s).state, st)
const base = () => ({ ...freshState(), sudoAsked: true })
const updated = () => exec(base(), ['sudo apt update'])

const groups = [
  {
    name: 'Find',
    cmds: [
      { c: 'apt search tree', sudo: false, what: 'Searches the repository for packages whose name or description contains a word.', tip: 'Use it when you don’t know the exact package name.', prep: updated },
      { c: 'apt show tree', sudo: false, what: 'Shows a package’s details: version, size, what it depends on, and a description.', tip: 'Read before you install.', prep: updated },
    ],
  },
  {
    name: 'Install',
    cmds: [
      { c: 'sudo apt update', sudo: true, what: 'Refreshes the package index: downloads the latest list of packages and versions from every repository.', tip: 'It does NOT install anything. Run it first, every time.', prep: base },
      { c: 'sudo apt install tree', sudo: true, what: 'Downloads and installs a package plus all its dependencies. You can list several: sudo apt install git curl tree.', tip: 'Add -y to answer yes automatically (handy in scripts).', prep: updated, shot: 'install-out' },
    ],
  },
  {
    name: 'Keep up to date',
    cmds: [
      { c: 'sudo apt upgrade', sudo: true, what: 'Installs newer versions of the packages you already have. It never removes anything or adds new packages.', tip: 'Run sudo apt update first, or apt won’t know there are new versions.', prep: updated },
      { c: 'sudo apt full-upgrade', sudo: true, what: 'A full system upgrade: like upgrade, but it may also install new packages or remove old ones when an upgrade needs it.', tip: 'Packages that upgrade “kept back” get upgraded here.', prep: updated },
    ],
  },
  {
    name: 'Clean up',
    cmds: [
      { c: 'sudo apt remove tree', sudo: true, what: 'Uninstalls a package but keeps its configuration files, in case you install it again.', tip: 'Dependencies it pulled in stay behind.', prep: () => exec(updated(), ['sudo apt install tree']), shot: 'remove-out' },
      { c: 'sudo apt purge nginx', sudo: true, what: 'Complete removal: uninstalls the package AND deletes its configuration files.', tip: 'Use it when you want a fresh start.', prep: () => exec(updated(), ['sudo apt install nginx']) },
      { c: 'sudo apt autoremove', sudo: true, what: 'Removes orphaned dependencies: packages installed only because something else needed them, and nothing needs them now.', tip: 'apt tells you when it’s worth running.', prep: () => exec(updated(), ['sudo apt install git', 'sudo apt remove git']) },
    ],
  },
]

const all = groups.flatMap((g) => g.cmds.map((c) => ({ ...c, group: g.name })))

function Explorer() {
  const [pick, setPick] = useState('sudo apt update')
  const c = all.find((x) => x.c === pick)
  const out = useMemo(() => run(c.c, c.prep()).out.filter((l) => !(l.k === 'dim' && l.t.startsWith('('))), [c])
  const words = c.c.split(' ')
  return (
    <div className="l7-explorer">
      <div className="l7-explorer-menu">
        {groups.map((g) => (
          <div key={g.name} role="group" aria-label={g.name}>
            <p className="l7-pick-label">{g.name}</p>
            {g.cmds.map((x) => (
              <button key={x.c} type="button" className={`l7-cmdbtn ${pick === x.c ? 'is-on' : ''}`} aria-pressed={pick === x.c} onClick={() => setPick(x.c)}>
                {x.c.replace('sudo ', '')}
              </button>
            ))}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={pick} className="l7-explorer-main" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <div className="l7-cmd l7-cmd-big">
            <span className="l7-p">~$</span>{' '}
            {words.map((w, k) => (
              <span key={k} className={w === 'sudo' ? 'l7-w-sudo' : k === words.length - 1 && !['update', 'upgrade', 'full-upgrade', 'autoremove'].includes(w) ? 'l7-w-pkg' : 'l7-w-sub'}>
                {w}{' '}
              </span>
            ))}
          </div>
          <p className="l7-explorer-what">{c.what}</p>
          <p className="l7-explorer-tags">
            <span className={`l7-tag ${c.sudo ? 'is-sudo' : ''}`}>{c.sudo ? '🔑 needs sudo: it changes the system' : '👀 no sudo: it only reads'}</span>
            <span className="l7-tag">💡 {c.tip}</span>
          </p>
          <div className="l7-tty">
            <div className="l7-tty-body is-static" aria-label={`Example output of ${c.c}`}>
              {out.map((l, i) => (
                <p key={i} className={`l7k-${l.k}`}>
                  {l.t || ' '}
                </p>
              ))}
            </div>
          </div>
          {c.shot && (
            <figure className="l7-shot l7-mt">
              <img src={img[c.shot]} alt={c.shot === 'install-out' ? 'Real terminal output while apt installs packages, with a green progress bar at 41%' : 'Real terminal output of sudo apt remove vlc on an Ubuntu server'} />
              <figcaption className="small">From the lecture slides: the same command on a real Ubuntu machine.</figcaption>
            </figure>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Commands() {
  return (
    <>
      <Section
        id="setup"
        eyebrow="Before you type"
        title="Your computer: Windows or Mac"
        intro="On Windows you’ll use apt inside Ubuntu (WSL), exactly like a real server. Macs use a different package manager, Homebrew, but the ideas are the same."
        tone="alt"
      >
        <Reveal>
          <OsKeys rows={setupRows} title="Package commands on your laptop" winLabel="Windows (Ubuntu / WSL)" macLabel="Mac (Terminal + Homebrew)" />
        </Reveal>
        <Callout label="Mac users">
          Homebrew isn’t installed by default: get it from brew.sh. To practise apt itself, use the terminal on this page, or the Ubuntu servers you’ll use later in the
          course.
        </Callout>
      </Section>

      <Section
        id="commands"
        eyebrow="Part 6 · Using apt"
        title="The apt commands you’ll use every week"
        intro="Pick a command to see what it does and what it prints. Red words need sudo; yellow words are package names."
      >
        <Reveal>
          <Explorer />
        </Reveal>
        <PauseBadge>Pause the video: in Ubuntu, run sudo apt update, then apt show tree</PauseBadge>
      </Section>
    </>
  )
}
