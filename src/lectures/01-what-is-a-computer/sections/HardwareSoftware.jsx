import { motion } from 'framer-motion'
import { useState } from 'react'
import { Figure, Illo, Reveal, Section, Step, useStep } from '../../../design-system'
import { logo, photos } from '../images'

/* ---------- Hardware vs software ---------- */

// [label, drawing, optional photo]
const hardware = [
  ['Monitor', 'Monitor', photos.monitor],
  ['Keyboard', 'Keyboard', photos.keyboard],
  ['CPU', 'Cpu', photos.cpu],
  ['RAM', 'Ram', photos.ram],
  ['SSD', 'Ssd', photos.ssd],
]
// [label, fallback drawing, logo file name in assets/lecture1/logos/]
const software = [
  ['Windows', 'OsWindows', 'windows'],
  ['Chrome', 'BrowserWindow', 'chrome'],
  ['VS Code', 'CodeEditor', 'vscode'],
]


const rows = [
  ['What it is', 'The physical parts', 'Instructions (programs)'],
  ['Can you touch it?', 'Yes', 'No'],
  ['Examples', 'Keyboard, monitor, CPU, RAM', 'Windows, Chrome, VS Code'],
  ['If it breaks…', 'Repair or replace the part', 'Update, reinstall or fix the code'],
  ['Who makes it', 'Engineers and manufacturers', 'Developers, like you'],
]

const items = [
  ['Keyboard', 'hw'], ['Chrome', 'sw'], ['CPU', 'hw'], ['VS Code', 'sw'], ['Windows', 'sw'],
  ['Monitor', 'hw'], ['RAM', 'hw'], ['WhatsApp', 'sw'], ['Mouse', 'hw'], ['Your JavaScript code', 'sw'],
]

// Picture for each item: a photo or logo from assets, otherwise a drawing.
const sortPics = {
  Keyboard: { src: photos.keyboard },
  CPU: { src: photos.cpu },
  Monitor: { src: photos.monitor },
  RAM: { src: photos.ram },
  Chrome: { logo: 'chrome' },
  'VS Code': { logo: 'vscode' },
  Windows: { logo: 'windows' },
  Mouse: { illo: 'Mouse' },
  WhatsApp: { illo: 'Phone' },
  'Your JavaScript code': { illo: 'CodeEditor' },
}

function SortPic({ name }) {
  const p = sortPics[name] ?? {}
  const src = p.src ?? (p.logo && logo(p.logo))
  return <span className="sort-pic">{src ? <img src={src} alt="" /> : <Illo name={p.illo ?? 'Gear'} size={66} />}</span>
}

function SortGame() {
  const [answers, setAnswers] = useState({})
  const score = items.filter(([n, k]) => answers[n] === k).length
  const done = Object.keys(answers).length === items.length

  return (
    <div className="sort">
      <p className="sort-help">
        Is it <strong>hardware</strong> (you can touch it) or <strong>software</strong> (instructions)? Choose for each one.
      </p>
      <ul className="sort-list">
        {items.map(([name, kind], i) => {
          const a = answers[name]
          const state = a ? (a === kind ? 'is-right' : 'is-wrong') : ''
          return (
            <motion.li
              key={name}
              className={`sort-item ${state}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              animate={state === 'is-wrong' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            >
              <span className="sort-name">
                <SortPic name={name} />
                {name}
              </span>
              <span className="sort-btns">
                <button type="button" aria-pressed={a === 'hw'} onClick={() => setAnswers((s) => ({ ...s, [name]: 'hw' }))}>
                  Hardware
                </button>
                <button type="button" aria-pressed={a === 'sw'} onClick={() => setAnswers((s) => ({ ...s, [name]: 'sw' }))}>
                  Software
                </button>
              </span>
              {a && <span className="sort-verdict">{a === kind ? '✓ Correct' : `✗ It’s ${kind === 'hw' ? 'hardware' : 'software'}`}</span>}
            </motion.li>
          )
        })}
      </ul>
      <div className="sort-footer" aria-live="polite">
        <p>
          Score: <strong>{score}</strong> / {items.length}
          {done && (score === items.length ? ' · Perfect!' : ' · Check the red ones and try again.')}
        </p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnswers({})}>
          Reset
        </button>
      </div>
    </div>
  )
}

function HwSwPanels() {
  return (
    <div className="hwsw">
      <Step n={1} className="hwsw-panel hw">
        <p className="hwsw-tag">Hardware</p>
        <h3>The physical parts you can touch</h3>
        <div className="hwsw-art">
          {hardware.map(([label, illo, photo], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Figure caption={label} className={photo ? 'has-photo' : ''}>
                {photo ? <img className="hw-photo" src={photo} alt={label} /> : <Illo name={illo} size={142} />}
              </Figure>
            </motion.div>
          ))}
        </div>
      </Step>
      <Step n={2} className="hwsw-panel sw">
        <p className="hwsw-tag">Software</p>
        <h3>Instructions that tell the hardware what to do</h3>
        <div className="hwsw-art">
          {software.map(([label, illo, logoName], i) => {
            const src = logo(logoName)
            return (
              <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Figure caption={label}>{src ? <img className="sw-logo" src={src} alt={`${label} logo`} /> : <Illo name={illo} size={142} />}</Figure>
              </motion.div>
            )
          })}
        </div>
      </Step>
    </div>
  )
}

function CompareTable() {
  const { shown } = useStep()
  return (
    <div className="table-wrap">
      <table className="compare">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Question</span>
            </th>
            <th scope="col">Hardware</th>
            <th scope="col">Software</th>
          </tr>
        </thead>
        <tbody>
          <motion.tr className="pic-row" animate={{ opacity: shown(3) ? 1 : 0 }} transition={{ duration: 0.4 }}>
            <th scope="row">Looks like</th>
            <td>
              <span className="thumbs">
                {hardware.map(([label, , photo]) => (
                  <img key={label} src={photo} alt={label} title={label} />
                ))}
              </span>
            </td>
            <td>
              <span className="thumbs logos">
                {software.map(([label, , logoName]) =>
                  logo(logoName) ? <img key={label} src={logo(logoName)} alt={`${label} logo`} title={label} /> : null,
                )}
              </span>
            </td>
          </motion.tr>
          {rows.map(([q, h, s], i) => (
            <motion.tr key={q} animate={{ opacity: shown(i + 3) ? 1 : 0 }} transition={{ duration: 0.4 }} aria-hidden={shown(i + 3) ? undefined : true}>
              <th scope="row">{q}</th>
              <td>{h}</td>
              <td>{s}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HardwareSoftware() {
  return (
    <>
      <Section id="hwsw" eyebrow="What a computer is made of" title="Hardware vs software" intro="Every computer is made of two things, and neither is useful without the other." steps={7}>
        <HwSwPanels />
        <Step n={3}>
          <CompareTable />
        </Step>
        <Reveal>
          <h3 className="sub">Quick game: sort them</h3>
          <SortGame />
        </Reveal>
      </Section>
    </>
  )
}
