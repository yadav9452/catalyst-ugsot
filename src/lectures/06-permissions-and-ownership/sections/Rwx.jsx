import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- ls -l anatomy: click a part of the line ---------- */

const parts = [
  ['-', 'type', 'File type. - is a regular file, d a directory, l a link (a shortcut to another file).'],
  ['rw-r--r--', 'perms', 'The nine permission letters: three for the user (owner), three for the group, three for others.'],
  ['1', 'links', 'Number of links. You can ignore it for now.'],
  ['ubuntu', 'owner', 'The owner: the user this file belongs to.'],
  ['ubuntu', 'group', 'The group this file belongs to. (Often a group with the same name as the user.)'],
  ['0', 'size', 'Size in bytes. This file is empty.'],
  ['Feb 19 18:17', 'date', 'When the file was last changed.'],
  ['notes.txt', 'name', 'The file name.'],
]

function Anatomy() {
  const [on, setOn] = useState(1)
  return (
    <div className="l6-anat">
      <div className="l6-anat-line" role="group" aria-label="Parts of one ls -l line">
        <span className="l6-prompt">$ ls -l notes.txt</span>
        <div>
          {parts.map(([t, k], i) => (
            <button key={k} type="button" className={`l6-anat-part l6a-${k} ${on === i ? 'is-on' : ''}`} onClick={() => setOn(i)} aria-pressed={on === i}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={on} className="l6-anat-explain" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <strong>{parts[on][1]}</strong> {parts[on][2]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

const types = [
  ['-', 'Regular file', 'notes.txt, photo.png, deploy.sh', '📄'],
  ['d', 'Directory', 'Documents/, site/, /etc', '📁'],
  ['l', 'Link', 'A shortcut that points to another file', '🔗'],
]

/* ---------- r, w, x for a file vs a folder ---------- */

const meaning = {
  file: {
    r: ['Read', 'Open it and see what’s inside: cat, less, an editor. Copying needs r too.'],
    w: ['Write', 'Change it: edit, add with >>, or empty it with >.'],
    x: ['Execute', 'Run it as a program or script: ./deploy.sh'],
  },
  dir: {
    r: ['List', 'See the names inside it with ls.'],
    w: ['Create & delete inside', 'Make, rename or delete files in it (needs x as well).'],
    x: ['Enter', 'cd into it, or reach anything inside it.'],
  },
}

function FileVsFolder() {
  const [kind, setKind] = useState('file')
  return (
    <div className="l6-fvf">
      <div className="l6-seg" role="group" aria-label="Show the meaning for">
        <button type="button" className={kind === 'file' ? 'is-on' : ''} onClick={() => setKind('file')} aria-pressed={kind === 'file'}>
          📄 a file
        </button>
        <button type="button" className={kind === 'dir' ? 'is-on' : ''} onClick={() => setKind('dir')} aria-pressed={kind === 'dir'}>
          📁 a folder
        </button>
      </div>
      <div className="l6-fvf-cards">
        {['r', 'w', 'x'].map((p, k) => (
          <motion.div
            key={kind + p}
            className="l6-fvf-card"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: k * 0.08 }}
          >
            <span className="l6-rwx-letter">{p}</span>
            <h3>{meaning[kind][p][0]}</h3>
            <p>{meaning[kind][p][1]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Who can delete a file? ---------- */

function DeleteLab() {
  const [fileW, setFileW] = useState(false)
  const [dirW, setDirW] = useState(true)
  const [tried, setTried] = useState(null)
  const ok = dirW
  const reset = () => setTried(null)
  return (
    <div className="l6-del">
      <div className="l6-del-folder">
        <p className="l6-del-label">
          📁 <code>shared/</code>
          <button
            type="button"
            className={`l6-toggle ${dirW ? 'is-on' : ''}`}
            onClick={() => {
              setDirW(!dirW)
              reset()
            }}
            aria-pressed={dirW}
          >
            folder w {dirW ? '✓' : '✗'}
          </button>
        </p>
        <AnimatePresence>
          {tried !== 'gone' && (
            <motion.div className="l6-del-file" exit={{ scale: 0, opacity: 0, rotate: -20 }} transition={{ duration: 0.4 }}>
              📄 <code>old.txt</code>
              <button
                type="button"
                className={`l6-toggle ${fileW ? 'is-on' : ''}`}
                onClick={() => {
                  setFileW(!fileW)
                  reset()
                }}
                aria-pressed={fileW}
              >
                file w {fileW ? '✓' : '✗'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="l6-del-side">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setTried(ok ? 'gone' : 'denied')} disabled={tried === 'gone'}>
          rm shared/old.txt
        </button>
        {tried === 'gone' && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            ↺ Bring it back
          </button>
        )}
        <AnimatePresence mode="wait">
          {tried && (
            <motion.p key={tried} className={`l6-del-msg ${tried === 'denied' ? 'is-bad' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {tried === 'denied'
                ? `rm: cannot remove 'shared/old.txt': Permission denied${fileW ? '  (even though the file itself has w!)' : ''}`
                : `Deleted${!fileW ? ', even though the file had no w! Deleting changes the folder’s list, so the folder’s w is what counts.' : '.'}`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Who am I to this file? ---------- */

const visitors = [
  { k: 'ubuntu', icon: '🧑‍💻', groups: ['ubuntu', 'devs'] },
  { k: 'demo', icon: '👩‍🔧', groups: ['demo', 'devs'] },
  { k: 'guest', icon: '🧳', groups: ['guest'] },
]

function WhoAmI() {
  const [v, setV] = useState(visitors[0])
  const [fileGroup, setFileGroup] = useState('devs')
  const cls = v.k === 'ubuntu' ? 'u' : v.groups.includes(fileGroup) ? 'g' : 'o'
  const str = 'rw-r-----'
  const set = { u: str.slice(0, 3), g: str.slice(3, 6), o: str.slice(6) }[cls]
  return (
    <div className="l6-who">
      <div className="l6-who-file">
        <code>
          -rw-r----- 1 ubuntu{' '}
          <button
            type="button"
            className="l6-who-grp"
            onClick={() => setFileGroup(fileGroup === 'devs' ? 'ubuntu' : 'devs')}
            title="Click to change the file’s group"
          >
            {fileGroup}
          </button>{' '}
          plan.txt
        </code>
        <small>Tip: click the group name to change it.</small>
      </div>
      <div className="l6-who-pick" role="group" aria-label="Who is asking?">
        {visitors.map((x) => (
          <button key={x.k} type="button" className={`l6-who-btn ${v.k === x.k ? 'is-on' : ''}`} onClick={() => setV(x)} aria-pressed={v.k === x.k}>
            <span aria-hidden="true">{x.icon}</span> {x.k}
            <small>groups: {x.groups.join(', ')}</small>
          </button>
        ))}
      </div>
      <ol className="l6-who-steps">
        {[
          ['u', `Is ${v.k} the owner (ubuntu)?`],
          ['g', `Is ${v.k} in the file’s group (${fileGroup})?`],
          ['o', 'Then they count as others.'],
        ].map(([c, q], k) => {
          const idx = { u: 0, g: 1, o: 2 }[cls]
          const state = k < idx ? 'no' : k === idx ? 'yes' : 'skip'
          return (
            <motion.li
              key={c + v.k + fileGroup}
              className={`is-${state}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: k * 0.25 }}
            >
              <span>{state === 'yes' ? '✓' : state === 'no' ? '✗' : '·'}</span> {q}
            </motion.li>
          )
        })}
      </ol>
      <motion.p key={cls + v.k} className="l6-who-result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
        {v.k} uses the <strong>{{ u: 'user', g: 'group', o: 'others' }[cls]}</strong> set <code>{set}</code>:{' '}
        {set === '---' ? 'no access at all.' : set === 'r--' ? 'can read, can’t change.' : 'can read and change.'}
      </motion.p>
    </div>
  )
}

export default function Rwx() {
  return (
    <>
      <Section
        id="see"
        eyebrow="Part 2 · Seeing permissions"
        title="ls -l shows who may do what"
        intro="Run ls -l and every line starts with a ten-character code. Click each part of the line below."
        steps={2}
      >
        <div className="l6-two">
          <Reveal>
            <Anatomy />
          </Reveal>
          <Reveal delay={0.1} className="l6-shot">
            <img src={img['ls-l']} alt="Terminal output of ls -l listing six files, all -rw-rw-r-- and owned by ubuntu" />
            <p className="small">Real output from the deck: every file shows its permissions first.</p>
          </Reveal>
        </div>
        <Step n={1}>
          <h3 className="sub">The very first character: what kind of thing is it?</h3>
          <div className="card-grid three">
            {types.map(([c, t, e, i]) => (
              <div key={c} className="card l6-type">
                <span className="l6-type-char">{c}</span>
                <h4>
                  <span aria-hidden="true">{i}</span> {t}
                </h4>
                <p>{e}</p>
              </div>
            ))}
          </div>
        </Step>
        <Step n={2}>
          <figure className="l6-strip">
            <img src={img['perm-string']} alt="The string - rw- r-- r-- labelled file type, user, group, other" />
          </figure>
        </Step>
      </Section>

      <Section
        id="rwx"
        eyebrow="Only three permissions"
        title="r, w and x: same letters, two meanings"
        intro="For a file they’re about its contents. For a folder they’re about the list of names inside it."
        tone="alt"
        steps={1}
      >
        <Reveal>
          <FileVsFolder />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">Surprise: who decides if you can delete a file?</h3>
          <DeleteLab />
        </Step>
      </Section>

      <Section
        id="classes"
        eyebrow="Part 3 · Ownership"
        title="Every file has an owner and a group"
        intro="Permissions are written for three classes of people: the user who owns the file, its group, and everyone else."
        steps={1}
      >
        <div className="card-grid three">
          {[
            ['u', '🧑‍💻', 'User (owner)', 'Usually whoever created the file. Only the owner (or root) can change its permissions.'],
            ['g', '👥', 'Group', 'A set of users who share access, like everyone on a project team.'],
            ['o', '🌍', 'Others', 'Everyone else on the system: not the owner, not in the group.'],
          ].map(([c, i, t, d], k) => (
            <Reveal key={c} delay={k * 0.08} className={`card l6-class l6c-${c}`}>
              <span className="card-icon" aria-hidden="true">
                {i}
              </span>
              <h4>
                {t} <code>{c}</code>
              </h4>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <h3 className="sub">Who am I to this file? Linux asks three questions, in order</h3>
          <WhoAmI />
        </Step>
        <Callout label="Remember">
          Linux stops at the first class that matches you. If you’re the owner, the group and others letters don’t apply to you at all.
        </Callout>
      </Section>
    </>
  )
}
