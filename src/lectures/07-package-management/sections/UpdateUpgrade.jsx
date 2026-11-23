import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'

const PKGS = [
  ['curl', '8.5.0-10.1', '8.5.0-10.6'],
  ['openssl', '3.0.13-3.1', '3.0.13-3.5'],
  ['git', '2.43.0-7', '2.43.0-7.1'],
  ['python3', '3.12.3-2', '3.12.3-2'],
]

const start = () => ({ list: PKGS.map((p) => p[1]), inst: PKGS.map((p) => p[1]), msg: 'Your computer’s list was downloaded weeks ago. The repository has moved on. Try the two commands in any order.', bad: false })

function UpdateLab() {
  const [s, setS] = useState(start)
  const update = () =>
    setS((x) => {
      const list = PKGS.map((p) => p[2])
      const n = list.filter((v, k) => v !== x.inst[k]).length
      return { ...x, list, msg: `apt update downloaded the new list. Nothing was installed, but now apt knows: ${n} package${n === 1 ? '' : 's'} can be upgraded.`, bad: false }
    })
  const upgrade = () =>
    setS((x) => {
      const n = x.list.filter((v, k) => v !== x.inst[k]).length
      if (!n)
        return {
          ...x,
          msg:
            x.list[0] === PKGS[0][1]
              ? '0 upgraded. Your old list says everything is up to date, so apt upgrade does nothing. Run apt update first!'
              : '0 upgraded: you already have everything on your list.',
          bad: x.list[0] === PKGS[0][1],
        }
      return { ...x, inst: [...x.list], msg: `apt upgrade installed ${n} newer version${n === 1 ? '' : 's'}. Your computer now matches the repository.`, bad: false }
    })

  return (
    <div className="l7-uu">
      <div className="table-wrap l7-table">
        <table className="compare l7-uu-table">
          <thead>
            <tr>
              <th scope="col">Package</th>
              <th scope="col">☁️ Repository has</th>
              <th scope="col">📋 Your list says</th>
              <th scope="col">💻 Installed</th>
            </tr>
          </thead>
          <tbody>
            {PKGS.map((p, k) => (
              <tr key={p[0]}>
                <th scope="row">
                  <code>{p[0]}</code>
                </th>
                <td>{p[2]}</td>
                <td>
                  <motion.span key={s.list[k]} className={s.list[k] !== p[1] ? 'l7-new' : ''} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
                    {s.list[k]}
                  </motion.span>
                </td>
                <td>
                  <motion.span key={s.inst[k]} className={s.inst[k] === p[2] ? 'l7-uptodate' : 'l7-old'} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
                    {s.inst[k]} {s.inst[k] === p[2] ? '✓' : '⌛'}
                  </motion.span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="l7-uu-btns">
        <button type="button" className="l7-cmdbtn" onClick={update}>
          sudo apt update <small>refresh the list</small>
        </button>
        <button type="button" className="l7-cmdbtn" onClick={upgrade}>
          sudo apt upgrade <small>install newer versions</small>
        </button>
        <button type="button" className="l7-link-btn" onClick={() => setS(start())}>
          ↺ Reset
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={s.msg} className={`l7-msg ${s.bad ? 'is-bad' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
          {s.msg}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default function UpdateUpgrade() {
  return (
    <Section
      id="update"
      eyebrow="The most confused pair"
      title="update vs upgrade"
      intro="Think of a restaurant. apt update gets you today’s menu. apt upgrade actually orders the new dishes. A new menu alone doesn’t feed you."
      tone="alt"
      steps={1}
    >
      <Reveal>
        <UpdateLab />
      </Reveal>
      <Step n={1}>
        <h3 className="sub">The everyday habit</h3>
        <div className="l7-cmd l7-cmd-big">
          <span className="l7-p">~$</span> sudo apt update <b className="op">&amp;&amp;</b> sudo apt upgrade
        </div>
        <p className="l7-lead l7-mt">
          <code>&amp;&amp;</code> means “if the first command worked, run the second”. So the list is fresh before anything is upgraded. Run it before installing anything
          new, and regularly on every server you look after.
        </p>
      </Step>
      <Callout>
        Most security fixes arrive through these two commands. Servers that are never updated are one of the most common ways websites get hacked.
      </Callout>
    </Section>
  )
}
