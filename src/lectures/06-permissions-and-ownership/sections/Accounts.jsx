import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Code, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- A tiny admin console: run account commands, watch the system change ---------- */

const start = () => ({
  users: [{ name: 'student', uid: 1000, groups: ['student', 'sudo'], pw: true }],
  homes: ['student'],
  groups: ['student', 'sudo'],
  log: [],
})

function AdminConsole() {
  const [s, setS] = useState(start)
  const [withM, setWithM] = useState(true)
  const [withR, setWithR] = useState(true)
  const has = (n) => s.users.some((u) => u.name === n)
  const nu = s.users.find((u) => u.name === 'newUser')

  const runCmd = (line, change, out = '') =>
    setS((x) => {
      const next = change(x)
      return { ...next, log: [...x.log, { line, out }].slice(-5) }
    })

  const cmds = [
    {
      line: `sudo useradd ${withM ? '-m ' : ''}newUser`,
      ok: !has('newUser'),
      do: () =>
        runCmd(`sudo useradd ${withM ? '-m ' : ''}newUser`, (x) => ({
          ...x,
          users: [...x.users, { name: 'newUser', uid: 1001, groups: ['newUser'], pw: false }],
          groups: [...x.groups, 'newUser'],
          homes: withM ? [...x.homes, 'newUser'] : x.homes,
        })),
      opt: (
        <label className="l6-check">
          <input type="checkbox" checked={withM} onChange={(e) => setWithM(e.target.checked)} /> -m (make the home folder)
        </label>
      ),
    },
    {
      line: 'sudo passwd newUser',
      ok: has('newUser') && !nu?.pw,
      do: () =>
        runCmd(
          'sudo passwd newUser',
          (x) => ({ ...x, users: x.users.map((u) => (u.name === 'newUser' ? { ...u, pw: true } : u)) }),
          'passwd: password updated successfully',
        ),
    },
    {
      line: 'sudo groupadd analytics',
      ok: !s.groups.includes('analytics'),
      do: () => runCmd('sudo groupadd analytics', (x) => ({ ...x, groups: [...x.groups, 'analytics'] })),
    },
    {
      line: 'sudo usermod -aG analytics newUser',
      ok: has('newUser') && s.groups.includes('analytics') && !nu?.groups.includes('analytics'),
      do: () =>
        runCmd('sudo usermod -aG analytics newUser', (x) => ({
          ...x,
          users: x.users.map((u) => (u.name === 'newUser' ? { ...u, groups: [...u.groups, 'analytics'] } : u)),
        })),
    },
    {
      line: `sudo userdel ${withR ? '-r ' : ''}newUser`,
      ok: has('newUser'),
      do: () =>
        runCmd(`sudo userdel ${withR ? '-r ' : ''}newUser`, (x) => ({
          ...x,
          users: x.users.filter((u) => u.name !== 'newUser'),
          groups: x.groups.filter((g) => g !== 'newUser'),
          homes: withR ? x.homes.filter((h) => h !== 'newUser') : x.homes,
        })),
      opt: (
        <label className="l6-check">
          <input type="checkbox" checked={withR} onChange={(e) => setWithR(e.target.checked)} /> -r (also delete the home folder)
        </label>
      ),
    },
  ]

  const orphan = s.homes.includes('newUser') && !has('newUser')
  const noHome = has('newUser') && !s.homes.includes('newUser')

  return (
    <div className="l6-admin">
      <div className="l6-admin-cmds">
        {cmds.map((c, i) => (
          <div key={i} className="l6-admin-cmd">
            <button type="button" className="l6-cmdbtn" onClick={c.do} disabled={!c.ok}>
              <b>{c.line}</b>
            </button>
            {c.opt}
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setS(start())}>
          ↺ Reset the system
        </button>
      </div>
      <div className="l6-admin-state">
        <div className="l6-admin-box">
          <p className="l6-pick-label">Users (/etc/passwd)</p>
          <AnimatePresence>
            {s.users.map((u) => (
              <motion.div
                key={u.name}
                className="l6-admin-user"
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <strong>{u.name}</strong> <span className="small">UID {u.uid}</span>
                <span className={`l6-pill ${u.pw ? 'is-ok' : 'is-warn'}`}>{u.pw ? 'password set' : 'no password yet'}</span>
                <span className="l6-admin-groups">
                  {u.groups.map((g) => (
                    <motion.code key={g} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      {g}
                    </motion.code>
                  ))}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="l6-admin-box">
          <p className="l6-pick-label">Home folders (/home)</p>
          <div className="l6-admin-homes">
            <AnimatePresence>
              {s.homes.map((h) => (
                <motion.span
                  key={h}
                  className={`l6-admin-home ${orphan && h === 'newUser' ? 'is-orphan' : ''}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  📁 {h}/
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          {noHome && <p className="l6-warn">newUser has no home folder. Next time add -m.</p>}
          {orphan && <p className="l6-warn">The user is gone but /home/newUser is still there. Use -r to remove it too.</p>}
        </div>
        <div className="l6-tty is-static">
          <div className="l6-tty-body is-static l6-admin-log">
            {s.log.length === 0 && <p className="l6k-dim"># Click a command on the left. Most of these print nothing when they work.</p>}
            {s.log.map((l, i) => (
              <div key={i}>
                <p className="l6k-cmd">$ {l.line}</p>
                {l.out && <p className="l6k-out">{l.out}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- The -G trap ---------- */

function GTrap() {
  const [flag, setFlag] = useState('-aG')
  const [done, setDone] = useState(false)
  const before = ['newUser', 'sudo', 'analytics']
  const after = flag === '-aG' ? [...before, 'web'] : ['newUser', 'web']
  const list = done ? after : before
  return (
    <div className="l6-trap">
      <div className="l6-seg" role="group" aria-label="Option">
        {['-aG', '-G'].map((f) => (
          <button
            key={f}
            type="button"
            className={flag === f ? 'is-on' : ''}
            onClick={() => {
              setFlag(f)
              setDone(false)
            }}
            aria-pressed={flag === f}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="l6-cmd">
        <span className="l6-prompt">$</span> sudo usermod {flag} web newUser
      </div>
      <div className="l6-trap-groups">
        <span className="small">groups newUser →</span>
        <AnimatePresence mode="popLayout">
          {list.map((g) => (
            <motion.code
              key={g}
              layout
              className={g === 'web' ? 'is-new' : g === 'sudo' ? 'is-sudo' : ''}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
            >
              {g}
            </motion.code>
          ))}
        </AnimatePresence>
      </div>
      <div className="l6-sym-btns">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setDone(true)} disabled={done}>
          Run it
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDone(false)}>
          ↺ Undo
        </button>
      </div>
      {done && (
        <motion.p className={`l6-del-msg ${flag === '-G' ? 'is-bad' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {flag === '-G'
            ? 'Ouch: -G without -a replaced the whole list. newUser lost sudo and analytics!'
            : 'web was appended. newUser kept sudo and analytics.'}
        </motion.p>
      )}
    </div>
  )
}

export default function Accounts() {
  return (
    <>
      <Section
        id="accounts"
        eyebrow="Part 6 · Managing users"
        title="Create, change and delete accounts"
        intro="These four commands change the system for everyone, so they all need sudo. Click them in order and watch what happens."
        tone="alt"
        steps={2}
      >
        <Reveal>
          <AdminConsole />
        </Reveal>
        <Step n={1} className="l6-two">
          <Code
            lines={[
              '$ sudo useradd -u 1006 -d /home/newUser -m -s /bin/bash newUser',
              '$ id newUser',
              'uid=1006(newUser) gid=1010(newUser) groups=1010(newUser)',
            ]}
            caption="-u sets the UID, -d the home folder path, -m creates it, -s the shell"
          />
          <figure className="l6-shot">
            <img src={img['useradd-out']} alt="Terminal: sudo useradd -u 1006 -d /home/newUser -s /bin/bash newUser, then id newUser shows uid=1006" />
            <figcaption className="small">From the deck: the new user has UID 1006.</figcaption>
          </figure>
        </Step>
        <Step n={2}>
          <Callout label="Good to know">
            On Ubuntu, sudo adduser john is a friendlier version that asks questions and creates the home folder and password for you. To change your own
            password, just type passwd (no sudo). Mac: these commands don’t exist on macOS; use an Ubuntu VM or watch.
          </Callout>
        </Step>
      </Section>

      <Section
        id="groups"
        eyebrow="Groups"
        title="Give access to a team, not one person at a time"
        intro="A group is a collection of users. Give the group access to a folder, then add people to the group."
        steps={2}
      >
        <div className="card-grid two">
          <Reveal className="card">
            <span className="card-icon" aria-hidden="true">
              🏠
            </span>
            <h4>Primary group (exactly one)</h4>
            <p>Created with the user, usually with the same name. New files you create belong to it.</p>
          </Reveal>
          <Reveal className="card" delay={0.08}>
            <span className="card-icon" aria-hidden="true">
              🎟
            </span>
            <h4>Secondary groups (any number)</h4>
            <p>Optional extra memberships that give extra access, like sudo or a project team.</p>
          </Reveal>
        </div>
        <Step n={1} className="l6-two">
          <Code
            lines={['$ sudo groupadd new_group', '$ cat /etc/group | grep new_group', 'new_group:x:1004:']}
            caption="Each group has a name and a GID. They live in /etc/group."
          />
          <figure className="l6-shot">
            <img src={img['groupadd-out']} alt="Terminal: cat /etc/group | grep new_group shows new_group:x:1004:" />
          </figure>
        </Step>
        <Step n={2}>
          <h3 className="sub">Add a user to a group: always -aG</h3>
          <GTrap />
          <Callout label="After joining a group">Log out and back in (on WSL: close and reopen Ubuntu) before the new group takes effect for you.</Callout>
        </Step>
      </Section>
    </>
  )
}
