import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- chown / chgrp builder ---------- */

const users = ['ubuntu', 'demo']
const groups = ['ubuntu', 'demo', 'devs']

function Badge({ label, value }) {
  return (
    <span className="l6-own-badge">
      <small>{label}</small>
      <AnimatePresence mode="popLayout">
        <motion.b
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {value}
        </motion.b>
      </AnimatePresence>
    </span>
  )
}

function ChownBuilder() {
  const [file, setFile] = useState({ owner: 'ubuntu', group: 'ubuntu' })
  const [tool, setTool] = useState('both')
  const [u, setU] = useState('demo')
  const [g, setG] = useState('demo')
  const cmd = { user: `sudo chown ${u}`, group: `sudo chown :${g}`, both: `sudo chown ${u}:${g}`, chgrp: `sudo chgrp ${g}` }[tool] + ' reports.txt'
  const run = () =>
    setFile((f) => ({
      owner: tool === 'user' || tool === 'both' ? u : f.owner,
      group: tool === 'user' ? f.group : g,
    }))
  return (
    <div className="l6-own">
      <div className="l6-own-file">
        <span aria-hidden="true">📄</span>
        <code>-rw-r--r-- 1</code>
        <Badge label="owner" value={file.owner} />
        <Badge label="group" value={file.group} />
        <code>reports.txt</code>
      </div>
      <div className="l6-seg l6-own-tools" role="group" aria-label="What do you want to change?">
        {[
          ['user', 'Owner only'],
          ['group', 'Group only'],
          ['both', 'Both'],
          ['chgrp', 'chgrp'],
        ].map(([k, t]) => (
          <button key={k} type="button" className={tool === k ? 'is-on' : ''} onClick={() => setTool(k)} aria-pressed={tool === k}>
            {t}
          </button>
        ))}
      </div>
      <div className="l6-own-pick">
        {tool !== 'group' && tool !== 'chgrp' && (
          <label>
            New owner
            <select value={u} onChange={(e) => setU(e.target.value)}>
              {users.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        )}
        {tool !== 'user' && (
          <label>
            New group
            <select value={g} onChange={(e) => setG(e.target.value)}>
              {groups.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="l6-cmd">
        <span className="l6-prompt">$</span> {cmd}
      </div>
      <div className="l6-sym-btns">
        <button type="button" className="btn btn-primary btn-sm" onClick={run}>
          Run it
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFile({ owner: 'ubuntu', group: 'ubuntu' })}>
          ↺ Reset
        </button>
      </div>
      <p className="small">
        {
          {
            user: 'user only: the group stays the same.',
            group: 'A colon in front means “group only”.',
            both: 'user:group changes both in one go.',
            chgrp: 'chgrp does the same as chown :group.',
          }[tool]
        }
      </p>
    </div>
  )
}

/* ---------- -R: the whole folder or just the folder? ---------- */

const tree = ['newdir/', 'newdir/index.html', 'newdir/css/', 'newdir/css/style.css']

function Recursive() {
  const [rec, setRec] = useState(true)
  const [owners, setOwners] = useState(() => tree.map(() => 'ubuntu'))
  const run = () => setOwners(tree.map((_, i) => (rec || i === 0 ? 'demo' : 'ubuntu')))
  return (
    <div className="l6-rec">
      <div className="l6-rec-left">
        <label className="l6-check">
          <input
            type="checkbox"
            checked={rec}
            onChange={(e) => {
              setRec(e.target.checked)
              setOwners(tree.map(() => 'ubuntu'))
            }}
          />{' '}
          -R (recursive: everything inside too)
        </label>
        <div className="l6-cmd">
          <span className="l6-prompt">$</span> sudo chown {rec ? '-R ' : ''}demo newdir
        </div>
        <div className="l6-sym-btns">
          <button type="button" className="btn btn-primary btn-sm" onClick={run}>
            Run it
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOwners(tree.map(() => 'ubuntu'))}>
            ↺ Reset
          </button>
        </div>
      </div>
      <ul className="l6-rec-tree">
        {tree.map((p, i) => (
          <motion.li
            key={p}
            style={{ paddingLeft: `${(p.split('/').length - (p.endsWith('/') ? 2 : 1)) * 22}px` }}
            animate={{ backgroundColor: owners[i] === 'demo' ? '#e7f7ee' : '#ffffff' }}
            transition={{ delay: i * 0.12 }}
          >
            <span aria-hidden="true">{p.endsWith('/') ? '📁' : '📄'}</span> {p.split('/').filter(Boolean).pop()}
            {p.endsWith('/') ? '/' : ''}
            <code className={owners[i] === 'demo' ? 'is-new' : ''}>{owners[i]}</code>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default function Ownership() {
  return (
    <Section
      id="chown"
      eyebrow="Part 7 · Changing ownership"
      title="chown and chgrp: who owns it, which group"
      intro="chmod changes what each class may do. chown changes who the owner and group are. Giving a file away needs sudo."
      tone="alt"
      steps={3}
    >
      <Reveal>
        <ChownBuilder />
      </Reveal>
      <Step n={1} className="l6-two">
        <figure className="l6-shot">
          <img src={img['chown-group-out']} alt="Terminal: ls -l file1 shows group ubuntu, then sudo chown :demo file1, then the group is demo" />
          <figcaption className="small">sudo chown :demo file1 changed only the group</figcaption>
        </figure>
        <figure className="l6-shot">
          <img src={img['chgrp-out']} alt="Terminal: sudo chgrp new_group error.log changes the group from ubuntu to new_group" />
          <figcaption className="small">sudo chgrp new_group error.log</figcaption>
        </figure>
      </Step>
      <Step n={2}>
        <h3 className="sub">Folders: add -R to change everything inside</h3>
        <Recursive />
        <figure className="l6-shot l6-shot-wide">
          <img src={img['chown-r']} alt="Terminal: sudo chown -R demo newdir, then ls -l shows newdir owned by demo" />
          <figcaption className="small">From the deck: sudo chown -R demo newdir</figcaption>
        </figure>
      </Step>
      <Step n={3}>
        <Callout label="Careful">
          Double-check the path before any -R command: sudo chown -R on the wrong folder can change thousands of files. chmod -R and chgrp -R work the same way.
        </Callout>
      </Step>
    </Section>
  )
}
