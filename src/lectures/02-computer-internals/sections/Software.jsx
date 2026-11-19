import { motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Illo, Reveal, Section, Step, useStep } from '../../../design-system'
import { CodeEditor } from '../../../design-system/illustrations'
import { logo, photos } from '../images'

/* ---------- What's missing? ---------- */

const parts = [
  ['CPU', photos.cpu],
  ['RAM', photos.ram],
  ['Keyboard', photos.keyboard],
  ['Monitor', photos.monitor],
]

function Missing() {
  const { shown } = useStep()
  const lit = shown(2)
  return (
    <div className="missing">
      <div className="missing-sw">
        <motion.div className="missing-code" animate={{ opacity: lit ? 1 : 0.15, scale: lit ? 1 : 0.9 }}>
          <CodeEditor size={96} />
          <strong>Software</strong>
        </motion.div>
        <motion.div className="missing-arrow" animate={{ opacity: lit ? 1 : 0 }} aria-hidden="true">
          <span>instructions</span>
          <span className="flow-line" />
        </motion.div>
      </div>
      <div className="missing-hw">
        {parts.map(([t, img], i) => (
          <motion.div
            key={t}
            className="missing-part"
            animate={{ filter: lit ? 'grayscale(0)' : 'grayscale(1)', opacity: lit ? 1 : 0.55 }}
            transition={{ delay: lit ? i * 0.12 : 0 }}
          >
            <img src={img} alt={t} />
            <span>{lit ? t : '?'}</span>
          </motion.div>
        ))}
      </div>
      <p className="missing-caption">
        {lit ? 'Software gives the instructions. Hardware carries them out.' : 'All this hardware… but who tells it what to do, and when?'}
      </p>
    </div>
  )
}

/* ---------- Save a file: the OS picks the disk blocks ---------- */

const BLOCKS = 48
const used0 = new Set([0, 1, 2, 5, 6, 9, 14, 15, 16, 22, 30, 31, 40])

function SaveDemo() {
  const [saved, setSaved] = useState([])
  const [used] = useState(used0)
  function save() {
    const free = Array.from({ length: BLOCKS }, (_, i) => i).filter((i) => !used.has(i) && !saved.includes(i))
    const pick = free.filter((_, i) => i % 5 === saved.length % 5).slice(0, 3)
    setSaved((s) => [...s, ...pick])
  }
  const files = saved.length / 3
  return (
    <div className="save-demo">
      <div className="save-left">
        <div className="fake-editor">
          <div className="fake-bar">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            notes-{files + 1}.txt
          </div>
          <p>My notes for Lecture 2…</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={save} disabled={files >= 4}>
          💾 Save
        </button>
        <p className="save-caption" aria-live="polite">
          {files === 0
            ? 'You just click Save. You never choose where on the disk it goes.'
            : `Saved! The operating system chose blocks ${saved.slice(-3).join(', ')} on the disk for you.`}
        </p>
      </div>
      <div className="disk" role="img" aria-label="The disk, shown as small blocks; saved files fill free blocks">
        <p>The disk (storage), as blocks</p>
        <div className="disk-grid">
          {Array.from({ length: BLOCKS }).map((_, i) => (
            <motion.span
              key={i}
              className={`blk ${used.has(i) ? 'used' : ''} ${saved.includes(i) ? 'new' : ''}`}
              animate={saved.includes(i) ? { scale: [0.6, 1.15, 1] } : {}}
              transition={{ duration: 0.4, delay: (saved.slice(-3).indexOf(i) + 1) * 0.12 }}
            >
              {i}
            </motion.span>
          ))}
        </div>
        <p className="disk-key">
          <span className="blk used" /> other files <span className="blk new" /> your file
        </p>
      </div>
    </div>
  )
}

/* ---------- System vs application ---------- */

const functions = [
  ['Memory management', 'Decides which program gets which part of RAM', 'Ram'],
  ['Processor scheduling', 'Decides which program uses the CPU, and when', 'Clock'],
  ['File handling', 'Keeps files and folders organised on storage', 'Folder'],
  ['Security', 'Controls who can open what, and blocks threats', 'Shield'],
]

function Rings() {
  const { shown } = useStep()
  const ring = (n) => ({ opacity: shown(n) ? 1 : 0.1, scale: shown(n) ? 1 : 0.85 })
  return (
    <div className="rings" role="img" aria-label="Layers: hardware in the centre, system software around it, application software on the outside">
      <motion.div className="ring r3" animate={ring(7)}>
        <span className="ring-label">
          Application software
          <span className="ring-logos">{['chrome', 'vscode'].map((l) => (logo(l) ? <img key={l} src={logo(l)} alt="" /> : null))}</span>
        </span>
        <motion.div className="ring r2" animate={ring(6)}>
          <span className="ring-label">
            System software
            <span className="ring-logos">{logo('windows') && <img src={logo('windows')} alt="" />}</span>
          </span>
          <motion.div className="ring r1" animate={ring(5)}>
            <Illo name="Cpu" size={56} />
            <span className="ring-label">Hardware</span>
          </motion.div>
        </motion.div>
      </motion.div>
      <p className="rings-note">Apps never talk to the hardware directly: they go through the operating system.</p>
    </div>
  )
}

const compare = [
  ['Works with', 'Hardware', 'The user'],
  ['Purpose', 'Controls the system', 'Performs specific tasks'],
  ['Interaction', 'Less: it runs in the background', 'More: you use it all the time'],
]

function CompareFill() {
  const { guided, shown } = useStep()
  const [open, setOpen] = useState(false)
  const show = guided ? shown(8) : open
  return (
    <div>
      <div className="table-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">System software</th>
              <th scope="col">Application software</th>
            </tr>
          </thead>
          <tbody>
            {compare.map(([f, s, a]) => (
              <tr key={f}>
                <th scope="row">{f}</th>
                <td>
                  {show ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {s}
                    </motion.span>
                  ) : (
                    '?'
                  )}
                </td>
                <td>
                  {show ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {a}
                    </motion.span>
                  ) : (
                    '?'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!guided && (
        <button type="button" className="btn btn-ghost btn-sm compare-btn" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide answers' : 'Pause, fill it in, then show answers'}
        </button>
      )}
    </div>
  )
}

export default function Software() {
  return (
    <>
      <Section
        id="software"
        eyebrow="Part 2 · Software and instructions"
        title="What’s missing?"
        intro="We have all these parts. But who tells them what to do, and when?"
        steps={5}
      >
        <Step n={1}>
          <Missing />
        </Step>
        <h3 className="sub">Software is a set of instructions that tells a computer…</h3>
        <div className="card-grid three">
          {[
            ['What to do', 'Add these numbers, show this page'],
            ['When to do it', 'When the user clicks Save'],
            ['How to do it', 'Step by step, in the right order'],
          ].map(([t, d], i) => (
            <Step key={t} n={i + 3} className="card wwh-card" delay={i * 0.08}>
              <span className="wwh-q">?</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <Callout>When you write code, you are writing software.</Callout>
      </Section>

      <Section
        id="complexity"
        eyebrow="Software handles complexity"
        title="When you save a file, do you choose where it goes on the disk?"
        intro="No. The operating system decides for you. Software hides this complexity so you can just click Save."
        tone="alt"
      >
        <Reveal>
          <SaveDemo />
        </Reveal>
      </Section>

      <Section id="software-types" eyebrow="Two types of software" title="System software vs application software" steps={8}>
        <div className="sw-types">
          <Step n={1} className="sw-type system">
            <p className="sw-type-tag">System software</p>
            <h3>The system manager</h3>
            <ul>
              <li>Works closest to the hardware</li>
              <li>Controls the whole system</li>
              <li>Gives apps a way to use the hardware</li>
            </ul>
            <p className="sw-examples">
              {logo('windows') && <img src={logo('windows')} alt="" />}
              Windows, macOS, Linux, Android, device drivers
            </p>
          </Step>
          <Step n={2} className="sw-type app">
            <p className="sw-type-tag">Application software</p>
            <h3>The task doer</h3>
            <ul>
              <li>Works closest to the user</li>
              <li>Does one specific job</li>
              <li>Most of what you’ll build is application software</li>
            </ul>
            <p className="sw-examples">
              {['chrome', 'vscode'].map((l) => (logo(l) ? <img key={l} src={logo(l)} alt="" /> : null))}
              Chrome, VS Code, Word, Gmail, Netflix
            </p>
          </Step>
        </div>
        <Step n={3}>
          <h3 className="sub">What does the operating system do?</h3>
        </Step>
        <div className="card-grid four">
          {functions.map(([t, d, illo], i) => (
            <Step key={t} n={i < 2 ? 3 : 4} className="card fn-card" delay={i * 0.08}>
              <Illo name={illo} size={56} />
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <h3 className="sub">Layers of a computer system</h3>
        <Rings />
        <h3 className="sub">Compare them</h3>
        <CompareFill />
        <Callout label="Coming up">In the next lecture we start learning Linux: the operating system that runs most web servers.</Callout>
      </Section>
    </>
  )
}
