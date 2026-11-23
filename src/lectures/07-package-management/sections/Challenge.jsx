import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { PauseBadge, Reveal, Section } from '../../../design-system'

const CMDS = ['sudo apt update', 'sudo apt install', 'sudo apt upgrade', 'sudo apt full-upgrade', 'sudo apt remove', 'sudo apt purge', 'sudo apt autoremove', 'apt search', 'apt show']

const cases = [
  ['You just installed Ubuntu. Before anything else, you need the latest list of packages.', 'sudo apt update', 'update refreshes the package index. Always first.'],
  ['Your new project needs git on the server.', 'sudo apt install', 'install fetches git and its dependencies.'],
  ['You want an image editor but don’t know the package’s name.', 'apt search', 'Search by a word, like apt search image.'],
  ['Before installing nodejs, you want to check which version you’d get.', 'apt show', 'apt show nodejs prints the version, size and dependencies.'],
  ['apt update says “12 packages can be upgraded”. Install those new versions.', 'sudo apt upgrade', 'upgrade installs newer versions of what you already have.'],
  ['You uninstalled git. apt says git-man is “no longer required”.', 'sudo apt autoremove', 'autoremove clears dependencies nothing needs any more.'],
  ['nginx is broken because of bad settings. Remove it and its config files, then start fresh.', 'sudo apt purge', 'purge deletes the configuration files too.'],
  ['upgrade says “The following packages have been kept back: linux-generic”.', 'sudo apt full-upgrade', 'full-upgrade may install new packages, so it can finish the job.'],
]

export default function Challenge() {
  const [i, setI] = useState(0)
  const [pick, setPick] = useState(null)
  const [score, setScore] = useState(0)
  const done = i >= cases.length
  const c = cases[i]

  function choose(cmd) {
    if (pick) return
    setPick(cmd)
    if (cmd === c[1]) setScore((s) => s + 1)
  }

  return (
    <Section id="challenge" eyebrow="Try it" title="Which command would you run?" intro="Eight real situations. Pick the command for each one." tone="red">
      <PauseBadge>Pause the video and try all eight</PauseBadge>
      <Reveal className="l7-chal">
        {done ? (
          <div className="l7-chal-end" aria-live="polite">
            <p className="l7-chal-score">
              {score} / {cases.length}
            </p>
            <p>{score === cases.length ? '🎉 Perfect. You know your apt.' : score >= 6 ? 'Great work. Look back at the ones you missed.' : 'Have another look at the commands section, then try again.'}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setI(0)
                setPick(null)
                setScore(0)
              }}
            >
              ↺ Try again
            </button>
          </div>
        ) : (
          <>
            <p className="l7-chal-head">
              <span className="l7-chal-tag">
                {i + 1} / {cases.length}
              </span>
              <span>Score: {score}</span>
            </p>
            <AnimatePresence mode="wait">
              <motion.p key={i} className="l7-chal-q" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {c[0]}
              </motion.p>
            </AnimatePresence>
            <div className="l7-chal-opts" role="group" aria-label="Pick a command">
              {CMDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  className={`l7-opt ${pick && cmd === c[1] ? 'is-right' : ''} ${pick === cmd && cmd !== c[1] ? 'is-wrong' : ''}`}
                  aria-pressed={pick === cmd}
                  onClick={() => choose(cmd)}
                >
                  {cmd}
                </button>
              ))}
            </div>
            <div aria-live="polite">
              {pick && (
                <motion.div className="l7-chal-why" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <p>
                    {pick === c[1] ? '✓ Right. ' : `✗ Not quite: it’s ${c[1]}. `}
                    {c[2]}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setI(i + 1)
                      setPick(null)
                    }}
                  >
                    {i === cases.length - 1 ? 'See my score' : 'Next →'}
                  </button>
                </motion.div>
              )}
            </div>
          </>
        )}
      </Reveal>
    </Section>
  )
}
