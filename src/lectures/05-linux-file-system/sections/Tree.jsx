import { motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

function FlipTree() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="l5-flip">
      <motion.figure className="l5-flip-fig" animate={{ rotate: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 60, damping: 14 }}>
        <img src={img['tree-sketch']} alt="A sketch of a tree: the root, the branches (sub-directories) and the leaves (files)" />
      </motion.figure>
      <div className="l5-flip-side">
        <button type="button" className="btn btn-primary" onClick={() => setFlipped((f) => !f)}>
          {flipped ? '↺ Turn it back' : '↻ Turn the tree upside down'}
        </button>
        <ul className="l5-flip-key">
          <li>
            <i className="l5-dot red" /> <strong>Root</strong> = <code>/</code>, the one place everything starts
          </li>
          <li>
            <i className="l5-dot blue" /> <strong>Branches</strong> = directories inside directories
          </li>
          <li>
            <i className="l5-dot yellow" /> <strong>Leaves</strong> = files
          </li>
        </ul>
        <p className="l5-muted">
          {flipped
            ? 'Now the root is at the top, exactly how Linux draws it.'
            : 'A real tree grows up from its root. Linux draws its tree the other way round.'}
        </p>
      </div>
    </div>
  )
}

function Drives() {
  return (
    <div className="l5-drives">
      <div className="l5-drive-col">
        <p className="eyebrow">Windows: one tree per drive</p>
        <div className="l5-drive-row">
          {['C:\\', 'D:\\', 'E:\\ (USB)'].map((d) => (
            <span key={d} className="l5-drive">
              {d}
            </span>
          ))}
        </div>
      </div>
      <div className="l5-drive-col is-linux">
        <p className="eyebrow">Linux: one single tree</p>
        <div className="l5-one">
          <span className="l5-drive is-root">/</span>
          <span className="l5-one-kids">
            <span className="l5-drive">home</span>
            <span className="l5-drive">etc</span>
            <span className="l5-drive">media/usb ← your USB stick appears here</span>
          </span>
        </div>
      </div>
    </div>
  )
}

const trio = [
  ['/', 'The root directory', 'The very top of the tree. Every path starts here.'],
  ['root', 'The admin user', 'The all-powerful user account (like “Administrator”). Not a folder at all!'],
  ['/root', 'root’s home folder', 'A folder inside / where the root user keeps their files. Your own home is /home/you.'],
]

function Trio() {
  const [open, setOpen] = useState([])
  return (
    <div className="l5-trio">
      {trio.map(([k, t, d]) => {
        const on = open.includes(k)
        return (
          <button
            key={k}
            type="button"
            className={`l5-card3 ${on ? 'is-on' : ''}`}
            onClick={() => setOpen((o) => (on ? o.filter((x) => x !== k) : [...o, k]))}
            aria-pressed={on}
          >
            <span className="l5-card3-in">
              <span className="l5-card3-face">
                <code>{k}</code>
                <small>Tap: what is it?</small>
              </span>
              <span className="l5-card3-back">
                <strong>{t}</strong>
                <span>{d}</span>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Tree() {
  return (
    <>
      <Section
        id="tree"
        eyebrow="Part 2 · One tree"
        title="Linux is a tree, upside down"
        intro="Everything (every file, every folder, even other disks) hangs off one single starting point."
        steps={2}
      >
        <Reveal>
          <FlipTree />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">No C: or D: drives</h3>
          <Drives />
        </Step>
        <Step n={2}>
          <h3 className="sub">Three words that sound the same. Tap each card.</h3>
          <Trio />
          <Callout label="Interview favourite">“What’s the difference between /, root and /root?” comes up a lot. Now you know.</Callout>
        </Step>
      </Section>
    </>
  )
}
