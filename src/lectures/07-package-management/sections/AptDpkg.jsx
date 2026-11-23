import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'
import { img } from '../images'

/* ---------- APT vs dpkg ---------- */

const table = [
  ['Role', '🧠 The brain', '✋ The hands'],
  ['Job', 'Makes decisions and resolves dependencies', 'Carries out the installation'],
  ['Handles dependencies?', '✅ Yes', '❌ No'],
  ['Works with repositories?', '✅ Yes', '❌ No'],
  ['Installs .deb files?', 'Indirectly (asks dpkg)', 'Directly'],
]

const tasks = [
  ['Downloads the package lists from the repositories', 'apt'],
  ['Works out that git also needs git-man', 'apt'],
  ['Unpacks the files from a .deb onto the disk', 'dpkg'],
  ['Decides the order to install things in', 'apt'],
  ['Runs a package’s setup scripts', 'dpkg'],
  ['Installs a .deb file you downloaded yourself: dpkg -i file.deb', 'dpkg'],
  ['Searches for packages by keyword', 'apt'],
]

function WhoDoesIt() {
  const [ans, setAns] = useState({})
  const score = tasks.filter((t, k) => ans[k] === t[1]).length
  const answered = Object.keys(ans).length
  return (
    <div className="l7-sort">
      <p className="l7-pick-label">Who does it: APT or dpkg?</p>
      <ul className="l7-sort-list">
        {tasks.map(([t, right], k) => (
          <li key={t} className={ans[k] ? (ans[k] === right ? 'is-right' : 'is-wrong') : ''}>
            <span>{t}</span>
            <span className="l7-seg sm" role="group" aria-label={`Who does it: ${t}`}>
              {['apt', 'dpkg'].map((w) => (
                <button key={w} type="button" className={ans[k] === w ? 'is-on' : ''} aria-pressed={ans[k] === w} onClick={() => setAns((a) => ({ ...a, [k]: w }))}>
                  {w === 'apt' ? 'APT' : 'dpkg'}
                </button>
              ))}
            </span>
            {ans[k] && (
              <span className="l7-sort-mark" aria-hidden="true">
                {ans[k] === right ? '✓' : '✗'}
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="l7-score" aria-live="polite">
        {answered === tasks.length
          ? score === tasks.length
            ? `🎉 ${score} / ${tasks.length}: APT thinks, dpkg does.`
            : `${score} / ${tasks.length}. Remember: anything about repositories or dependencies is APT; touching files on disk is dpkg.`
          : `${answered} of ${tasks.length} answered`}
      </p>
    </div>
  )
}

/* ---------- Inside apt install ---------- */

const stageNames = [
  ['🔍', 'Check database', 'Does the package exist?'],
  ['🧮', 'Calculate dependencies', 'What else is needed?'],
  ['⚔️', 'Check conflicts', 'Will it clash with anything?'],
  ['☁️', 'Download files', 'Fetch the .deb files'],
  ['✋', 'dpkg installs', 'Unpack and set up'],
]

const results = {
  tree: ['Found tree 2.1.1-2ubuntu3 in the universe section.', 'Needs only libc6, which every Ubuntu already has.', 'No conflicts.', '1 file · 47 kB', 'Unpacked /usr/bin/tree and set it up. Ready!'],
  git: ['Found git 1:2.43.0 in the main section.', 'Needs git-man and liberror-perl: 2 extra packages.', 'No conflicts.', '3 files · 4.8 MB', 'Unpacked and set up liberror-perl, git-man, then git.'],
  nginx: ['Found nginx 1.24.0 in the main section.', 'Needs nginx-common: 1 extra package.', 'No other installed package clashes with nginx.', '2 files · 564 kB', 'Set up nginx-common, then nginx. The web server starts.'],
  photoshop: ['E: Unable to locate package photoshop. It isn’t in the Ubuntu repositories, so apt stops here.'],
}

function Inside() {
  const { guided, step } = useStep()
  const [pkg, setPkg] = useState('git')
  const [phase, setPhase] = useState(0)
  const [running, setRunning] = useState(false)
  const res = results[pkg]
  const shown = guided ? Math.min(step, res.length) : Math.min(phase, res.length)

  const busy = running && phase < res.length

  useEffect(() => {
    if (!busy) return
    const t = setTimeout(() => setPhase((p) => p + 1), 800)
    return () => clearTimeout(t)
  }, [busy, phase])

  function start(p = pkg) {
    setPkg(p)
    setPhase(0)
    setRunning(true)
  }

  const failed = pkg === 'photoshop' && shown >= 1
  return (
    <div className="l7-inside">
      <div className="l7-inside-head">
        <div className="l7-cmd">
          <span className="l7-p">~$</span> sudo apt install <b>{pkg}</b>
        </div>
        <div className="l7-seg" role="group" aria-label="Package to install">
          {Object.keys(results).map((p) => (
            <button key={p} type="button" className={pkg === p ? 'is-on' : ''} aria-pressed={pkg === p} onClick={() => start(p)}>
              {p}
            </button>
          ))}
        </div>
        {!guided && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => start()} disabled={busy}>
            ▶ Run
          </button>
        )}
      </div>
      <ol className="l7-stages">
        {stageNames.map(([icon, name, q], k) => {
          const state = k < shown ? (failed ? 'is-fail' : 'is-done') : k === shown && busy && !failed ? 'is-now' : ''
          return (
            <li key={name} className={`l7-stage ${state} ${failed && k > 0 ? 'is-skip' : ''}`}>
              <span className="l7-stage-icon" aria-hidden="true">
                {icon}
              </span>
              <strong>{name}</strong>
              <small>{q}</small>
              <AnimatePresence>
                {k < shown && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    {res[k]}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        {shown > 0 ? res[Math.min(shown, res.length) - 1] : ''}
      </p>
    </div>
  )
}

export default function AptDpkg() {
  return (
    <>
      <Section
        id="apt"
        eyebrow="Part 4 · APT and dpkg"
        title="Two tools, one team"
        intro="APT stands for Advanced Package Tool. It’s the main way to manage packages on Debian and Ubuntu. It talks to the repositories, works out dependencies, then hands the actual installing to dpkg."
        steps={2}
      >
        <Step n={1}>
          <div className="table-wrap l7-table">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col"> </th>
                  <th scope="col">APT</th>
                  <th scope="col">dpkg</th>
                </tr>
              </thead>
              <tbody>
                {table.map((r) => (
                  <tr key={r[0]}>
                    <th scope="row">{r[0]}</th>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
        <Step n={2}>
          <WhoDoesIt />
        </Step>
        <Callout label="apt or apt-get?">
          You’ll see both in tutorials. apt is the newer, friendlier command with a progress bar and colours: use it when you type. apt-get is older and its output never
          changes, so scripts often use it. They install the same packages.
        </Callout>
      </Section>

      <Section id="inside" eyebrow="How APT works inside" title="Four checks before anything is installed" intro="Pick a package and press Run. Watch APT work through its checks, then hand over to dpkg." tone="alt" steps={5}>
        <Reveal>
          <Inside />
        </Reveal>
        <Reveal className="l7-strip">
          <figure className="l7-shot">
            <img src={img['apt-internals']} alt="APT’s four stages: check the database, calculate dependencies, check conflicts, download files" />
            <figcaption className="small">The same four stages, from the lecture slides.</figcaption>
          </figure>
        </Reveal>
      </Section>
    </>
  )
}
