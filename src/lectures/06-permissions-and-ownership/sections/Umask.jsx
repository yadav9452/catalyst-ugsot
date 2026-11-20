import { motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, OsKeys, Reveal, Section, Step } from '../../../design-system'
import { modeToString, octal } from './permSim'

const masks = [
  ['022', 'servers, root, WSL and Mac often'],
  ['002', 'normal users on Ubuntu'],
  ['077', 'very private: nobody else gets anything'],
  ['027', 'group may read, others nothing'],
]

function Bits({ label, mode, kind, mask }) {
  const s = modeToString(mode)
  return (
    <div className={`l6-bits l6-bits-${kind}`}>
      <span className="l6-bits-label">{label}</span>
      <span className="l6-bits-row">
        {s.split('').map((ch, i) => {
          const masked = mask !== undefined && ((mask >> (8 - i)) & 1) === 1
          return (
            <motion.span
              key={i + ch + kind}
              className={`l6-bitcell ${ch !== '-' ? 'is-on' : ''} ${masked ? 'is-masked' : ''} ${i % 3 === 2 ? 'is-gap' : ''}`}
              initial={kind === 'result' ? { y: -12, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              {ch}
            </motion.span>
          )
        })}
      </span>
      <code>{octal(mode)}</code>
    </div>
  )
}

function UmaskCalc() {
  const [mask, setMask] = useState('022')
  const [kind, setKind] = useState('file')
  const base = kind === 'file' ? 0o666 : 0o777
  const m = parseInt(mask, 8)
  const result = base & ~m
  return (
    <div className="l6-umask">
      <div className="l6-umask-pick">
        <div className="l6-seg" role="group" aria-label="New file or folder">
          <button type="button" className={kind === 'file' ? 'is-on' : ''} onClick={() => setKind('file')} aria-pressed={kind === 'file'}>
            📄 touch new.txt
          </button>
          <button type="button" className={kind === 'dir' ? 'is-on' : ''} onClick={() => setKind('dir')} aria-pressed={kind === 'dir'}>
            📁 mkdir newdir
          </button>
        </div>
        <div>
          {masks.map(([v, t]) => (
            <button key={v} type="button" className={`l6-chip ${mask === v ? 'is-on' : ''}`} onClick={() => setMask(v)} aria-pressed={mask === v}>
              umask {v}
              <small>{t}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="l6-umask-calc">
        <Bits label={`Start (${kind === 'file' ? 'files' : 'folders'})`} mode={base} kind="base" />
        <Bits label="umask switches off" mode={m} kind="mask" />
        <Bits label="New permissions" mode={result} kind="result" mask={m & base} />
        <p className="l6-umask-out">
          <span className="l6-prompt">$ ls -l</span> {kind === 'dir' ? 'd' : '-'}
          {modeToString(result)} … {kind === 'file' ? 'new.txt' : 'newdir'}
        </p>
      </div>
    </div>
  )
}

const umaskRows = [
  ['See your umask', 'umask (Ubuntu usually prints 0002, WSL often 0022)', 'umask (usually 0022)'],
  ['New file you create', '664 rw-rw-r-- (with 002) or 644 (with 022)', '644 rw-r--r--'],
  ['Change it for this terminal only', 'umask 077', 'umask 077'],
]

export default function Umask() {
  return (
    <Section
      id="umask"
      eyebrow="Part 8 · Default permissions"
      title="Where do a new file’s permissions come from?"
      intro="They aren’t random. Linux starts from a base value, then your umask switches some permissions off."
      steps={2}
    >
      <div className="card-grid two">
        <Reveal className="card">
          <h4>Step 1 · The starting point</h4>
          <p>
            Files start at <code>666</code> rw-rw-rw- (never x, for safety). Folders start at <code>777</code> rwxrwxrwx (they need x to be entered).
          </p>
        </Reveal>
        <Reveal className="card" delay={0.08}>
          <h4>Step 2 · umask, the filter</h4>
          <p>umask only removes permissions. It never adds any. Type umask to see yours.</p>
        </Reveal>
      </div>
      <Step n={1}>
        <h3 className="sub">Try different umasks</h3>
        <UmaskCalc />
        <Callout label="Shortcut">
          People often say “666 minus 022 = 644”. Strictly, umask switches bits off rather than subtracting, but for the common values 022 and 002 the
          subtraction gives the right answer.
        </Callout>
      </Step>
      <Step n={2}>
        <OsKeys rows={umaskRows} title="umask on your computer" />
      </Step>
    </Section>
  )
}
