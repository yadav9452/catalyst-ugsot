import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, OsKeys, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- Ask Linux who you are ---------- */

const probes = [
  { cmd: 'whoami', what: 'Username', out: ['demo'], mark: 'demo', note: 'The user you are logged in as.' },
  {
    cmd: 'id',
    what: 'UID & GID',
    out: ['uid=1001(demo) gid=1001(demo) groups=1001(demo),1004(new_group)'],
    mark: 'uid=1001(demo)',
    note: 'Linux really tracks users by number. Names are labels for people.',
  },
  { cmd: 'echo $HOME', what: 'Home folder', out: ['/home/demo'], mark: '/home/demo', note: 'On a Mac this prints /Users/yourname.' },
  {
    cmd: 'echo $SHELL',
    what: 'Default shell',
    out: ['/bin/sh'],
    mark: '/bin/sh',
    note: 'The program that reads your commands. Often /bin/bash, or /bin/zsh on a Mac.',
  },
  {
    cmd: 'groups',
    what: 'Group membership',
    out: ['demo new_group'],
    mark: 'new_group',
    note: 'Every group you belong to. On WSL you’ll see sudo in your list.',
  },
]

function Probe() {
  const [i, setI] = useState(0)
  const p = probes[i]
  return (
    <div className="l6-probe">
      <div className="l6-probe-btns" role="tablist" aria-label="Commands">
        {probes.map((x, k) => (
          <button key={x.cmd} type="button" role="tab" aria-selected={i === k} className={`l6-cmdbtn ${i === k ? 'is-on' : ''}`} onClick={() => setI(k)}>
            <b>{x.cmd}</b>
            <small>{x.what}</small>
          </button>
        ))}
      </div>
      <div className="l6-tty is-static">
        <div className="l6-tty-bar">
          <span className="l6-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>demo@server: ~</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={i} className="l6-tty-body is-static" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="l6k-cmd">$ {p.cmd}</p>
            {p.out.map((l) => (
              <p key={l} className="l6k-out">
                {l.split(p.mark).map((part, k, arr) => (
                  <span key={k}>
                    {part}
                    {k < arr.length - 1 && <mark className="l6-mark">{p.mark}</mark>}
                  </span>
                ))}
              </p>
            ))}
            <p className="l6k-dim"># {p.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- One line of /etc/passwd ---------- */

const fields = [
  ['demo', 'Username'],
  ['x', 'Password: the real (scrambled) password is kept in /etc/shadow, which only root can read'],
  ['1001', 'UID: the user’s ID number'],
  ['1001', 'GID: the ID of the user’s primary group'],
  ['', 'Comment: full name, often empty'],
  ['/home/demo', 'Home folder'],
  ['/bin/sh', 'Default shell'],
]

function PasswdLine() {
  const [on, setOn] = useState(0)
  return (
    <div className="l6-pw">
      <p className="l6-prompt">$ grep demo /etc/passwd</p>
      <div className="l6-pw-line" role="group" aria-label="Fields of one /etc/passwd line">
        {fields.map(([t], i) => (
          <span key={i} className="l6-pw-cell">
            <button
              type="button"
              className={`l6-pw-field ${on === i ? 'is-on' : ''} ${t === '' ? 'is-empty' : ''}`}
              onClick={() => setOn(i)}
              aria-pressed={on === i}
            >
              {t || '(empty)'}
            </button>
            {i < fields.length - 1 && <span className="l6-pw-colon">:</span>}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={on} className="l6-anat-explain" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <strong>Field {on + 1}.</strong> {fields[on][1]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ---------- UID ranges ---------- */

const ranges = [
  { from: 0, to: 0, label: 'root', icon: '👑', text: 'UID 0: can do anything.' },
  { from: 1, to: 999, label: 'System users', icon: '⚙️', text: 'Run services: www-data (web server), mysql, sshd…' },
  { from: 1000, to: 60000, label: 'Regular users', icon: '🧑‍💻', text: 'Real people like you. The first account gets 1000.' },
]

function UidRuler() {
  const [uid, setUid] = useState(1000)
  const r = ranges.find((x) => uid >= x.from && uid <= x.to) ?? ranges[2]
  const stops = [0, 33, 999, 1000, 1001]
  return (
    <div className="l6-uid">
      <div className="l6-uid-btns">
        {stops.map((s) => (
          <button key={s} type="button" className={`l6-chip ${uid === s ? 'is-on' : ''}`} onClick={() => setUid(s)}>
            UID {s}
          </button>
        ))}
      </div>
      <motion.div key={r.label} className="l6-uid-card" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span aria-hidden="true">{r.icon}</span>
        <div>
          <strong>{r.label}</strong>
          <p>
            {uid === 33 ? 'UID 33 is www-data on Ubuntu: the user a web server runs as. ' : ''}
            {r.text}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/* ---------- sudo, step by step ---------- */

const sudoSteps = [
  ['You type', 'sudo apt update'],
  ['sudo asks', '[sudo] password for student: (your own password, typed blind)'],
  ['sudo checks', 'Is student in the sudo group?'],
  ['Runs as root', 'apt update runs with admin rights, just this once'],
]

function SudoFlow() {
  const [inGroup, setInGroup] = useState(true)
  const [n, setN] = useState(0)
  return (
    <div className="l6-sudo">
      <div className="l6-sudo-top">
        <button
          type="button"
          className={`l6-toggle ${inGroup ? 'is-on' : ''}`}
          aria-pressed={inGroup}
          onClick={() => {
            setInGroup(!inGroup)
            setN(0)
          }}
        >
          student is in the sudo group {inGroup ? '✓' : '✗'}
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setN((x) => (x >= 4 ? 0 : x + 1))}>
          {n >= 4 ? '↺ Again' : 'Next step →'}
        </button>
      </div>
      <ol className="l6-sudo-steps">
        {sudoSteps.map(([t, d], i) => {
          const blocked = !inGroup && i === 3
          const show = i < n
          return (
            <motion.li key={t} className={`${show ? 'is-on' : ''} ${show && blocked ? 'is-bad' : ''}`} animate={{ opacity: show ? 1 : 0.35 }}>
              <b>{i + 1}</b>
              <div>
                <strong>{blocked && show ? 'Refused' : t}</strong>
                <p>{blocked && show ? 'student is not in the sudoers file. This incident will be reported.' : d}</p>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

const sudoRows = [
  ['Run one command as admin', 'sudo <command>', 'sudo <command>'],
  ['Which password?', 'Your Linux (Ubuntu) password', 'Your Mac login password'],
  ['Who may use sudo?', 'Users in the sudo group (your WSL user already is)', 'Admin accounts'],
  ['Become root for a while (rarely needed)', 'sudo -i, then exit', 'sudo -i, then exit'],
]

export default function Users() {
  return (
    <>
      <Section
        id="users"
        eyebrow="Part 5 · Users"
        title="A user is an identity in Linux"
        intro="Every login, every running program and every file belongs to some user. Each user has a username, a UID, a primary group (GID), a home folder, a shell and a password."
        steps={2}
      >
        <div className="l6-two l6-two-top">
          <Reveal className="l6-user-fig">
            <img src={img.user} alt="" />
            <ul>
              <li>Log in</li>
              <li>Run commands</li>
              <li>Own and access files</li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <Probe />
          </Reveal>
        </div>
        <Step n={1}>
          <h3 className="sub">Where is all this stored? /etc/passwd</h3>
          <PasswdLine />
        </Step>
        <Step n={2}>
          <Callout label="Mac users">
            /etc/passwd exists on macOS but doesn’t list your own account (macOS keeps users elsewhere). whoami, id and groups work the same.
          </Callout>
        </Step>
      </Section>

      <Section id="types" eyebrow="Types of users" title="root, system users and regular users" intro="The UID tells you what kind of user it is." tone="alt">
        <div className="l6-two">
          <Reveal className="l6-shot">
            <img
              src={img['user-types']}
              alt="Three cards: Root user with complete control, system users for specific applications, regular users with limited permissions"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <UidRuler />
          </Reveal>
        </div>
      </Section>

      <Section
        id="sudo"
        eyebrow="Borrowing admin power"
        title="sudo: superuser do"
        intro="Creating users, changing owners and installing software need root. sudo runs one command as root, after checking it’s really you."
        steps={1}
      >
        <Reveal>
          <SudoFlow />
        </Reveal>
        <Step n={1}>
          <OsKeys rows={sudoRows} title="sudo on your computer" />
        </Step>
        <Callout label="Good habit">Use sudo only when a command needs it. Root can delete or break anything, and there is no undo.</Callout>
      </Section>
    </>
  )
}
