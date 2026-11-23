import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section, Step } from '../../../design-system'

const blocks = [
  ['bin', '⚙️', 'nginx program', '/usr/sbin/nginx'],
  ['conf', '🛠', 'Your settings', '/etc/nginx/nginx.conf'],
  ['dep', '🧩', 'Dependency', 'nginx-common'],
]

const full = { bin: true, conf: true, dep: true }

function CleanLab() {
  const [has, setHas] = useState(full)
  const [msg, setMsg] = useState('nginx is installed. Try each command and watch what disappears.')

  function act(cmd) {
    if (cmd === 'remove') {
      if (!has.bin) return setMsg('Package ‘nginx’ is not installed, so not removed.')
      setHas({ ...has, bin: false })
      setMsg('remove took the program away but kept your settings. apt also says nginx-common is no longer required: use autoremove.')
    } else if (cmd === 'purge') {
      if (!has.bin && !has.conf) return setMsg('Nothing left to purge.')
      setHas({ ...has, bin: false, conf: false })
      setMsg('purge removed the program AND deleted its settings. A clean slate.')
    } else {
      if (!has.dep) return setMsg('0 to remove: there are no unused dependencies.')
      if (has.bin) return setMsg('0 to remove: nginx still needs nginx-common, so it stays.')
      setHas({ ...has, dep: false })
      setMsg('autoremove deleted nginx-common: nothing needed it any more.')
    }
  }

  return (
    <div className="l7-clean">
      <div className="l7-clean-disk" aria-label="What is on the disk">
        <AnimatePresence>
          {blocks.map(
            ([k, icon, name, path]) =>
              has[k] && (
                <motion.div
                  key={k}
                  className={`l7-clean-block ${k === 'dep' && !has.bin ? 'is-orphan' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <span aria-hidden="true">{icon}</span>
                  <strong>{name}</strong>
                  <code>{path}</code>
                  {k === 'dep' && !has.bin && <small>orphan: nobody needs me</small>}
                </motion.div>
              ),
          )}
        </AnimatePresence>
        {!has.bin && !has.conf && !has.dep && <p className="l7-clean-empty">🧼 Spotless. Not a trace of nginx left.</p>}
      </div>
      <div className="l7-clean-side">
        {[
          ['remove', 'sudo apt remove nginx'],
          ['purge', 'sudo apt purge nginx'],
          ['autoremove', 'sudo apt autoremove'],
        ].map(([k, c]) => (
          <button key={k} type="button" className="l7-cmdbtn" onClick={() => act(k)}>
            {c}
          </button>
        ))}
        <button
          type="button"
          className="l7-link-btn"
          onClick={() => {
            setHas(full)
            setMsg('nginx is installed again.')
          }}
        >
          ↺ Reinstall nginx
        </button>
        <p className="l7-msg" aria-live="polite">
          {msg}
        </p>
      </div>
    </div>
  )
}

const rows = [
  ['Program files', '🗑 removed', '🗑 removed', '-'],
  ['Configuration files', '✅ kept', '🗑 removed', '-'],
  ['Unused dependencies', '✅ kept', '✅ kept', '🗑 removed'],
  ['Use it when…', 'you may reinstall later', 'you want a fresh start', 'apt suggests it, or to free space'],
]

export default function Cleanup() {
  return (
    <Section id="cleanup" eyebrow="Removing software" title="remove, purge or autoremove?" intro="Three ways to clean up, each taking away a bit more. Try them on nginx." steps={1}>
      <Reveal>
        <CleanLab />
      </Reveal>
      <Step n={1}>
        <div className="table-wrap l7-table l7-mt">
          <table className="compare">
            <thead>
              <tr>
                <th scope="col"> </th>
                <th scope="col">remove</th>
                <th scope="col">purge</th>
                <th scope="col">autoremove</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]}>
                  <th scope="row">{r[0]}</th>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Step>
    </Section>
  )
}
