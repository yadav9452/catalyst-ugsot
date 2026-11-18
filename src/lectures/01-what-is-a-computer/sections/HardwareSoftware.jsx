import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Figure, Illo, PauseBadge, Reveal, Section, Step, useStep } from '../../../design-system'
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
  return <span className="sort-pic">{src ? <img src={src} alt="" /> : <Illo name={p.illo ?? 'Gear'} size={40} />}</span>
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
                {photo ? <img className="hw-photo" src={photo} alt={label} /> : <Illo name={illo} size={84} />}
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
                <Figure caption={label}>{src ? <img className="sw-logo" src={src} alt={`${label} logo`} /> : <Illo name={illo} size={84} />}</Figure>
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

/* ---------- Layers ---------- */

// Listed top to bottom; revealed bottom-up (hardware first).
const layers = [
  ['Your code', 'The websites and apps you’ll build in this course', 'l1', 'CodeEditor', 4],
  ['Applications', 'Chrome, VS Code, Spotify, WhatsApp', 'l2', 'BrowserWindow', 3, ['chrome', 'vscode']],
  ['Operating system', 'Windows, macOS, Android, Linux: manages the hardware for every app', 'l3', 'OsWindows', 2, ['windows']],
  ['Hardware', 'CPU, RAM, storage, screen, keyboard', 'l4', 'Cpu', 1],
]

function Layers() {
  return (
    <div className="layers">
      {layers.map(([t, d, c, illo, n, logos = []]) => (
        <Step key={t} n={n} className={`layer ${c}`} y={40} delay={(n - 1) * 0.15}>
          <span className={`layer-illo ${logos.length > 1 ? 'is-pair' : ''}`}>
            {logos.length && logos.every((l) => logo(l)) ? (
              logos.map((l) => <img key={l} className="layer-logo" src={logo(l)} alt="" />)
            ) : (
              <Illo name={illo} size={52} />
            )}
          </span>
          <strong>{t}</strong>
          <span>{d}</span>
        </Step>
      ))}
      <Step n={5} as="p" className="note">
        Each layer relies on the one below it. Your code reaches the hardware through the browser and the operating system.
      </Step>
    </div>
  )
}

/* ---------- Press play ---------- */

const playSteps = [
  ['01 · Input', 'You tap Play', 'The touchscreen senses your finger', 'Touch'],
  ['02 · Software', 'The app’s code runs', 'It decides: load this song and start playback', 'CodeEditor'],
  ['03 · Hardware', 'CPU and RAM work', 'The song is read from storage and decoded', 'Cpu'],
  ['04 · Output', 'Music plays', 'Speakers turn the signal into sound', 'Speaker'],
]

function PlayFlow() {
  const guided = useStep()
  const [localStep, setLocalStep] = useState(-1)
  // Guided mode: the instructor advances with → (section steps 1–4). Otherwise the button plays it through.
  const step = guided.guided ? guided.step - 1 : localStep

  useEffect(() => {
    if (guided.guided || localStep < 0 || localStep >= playSteps.length) return
    const t = setTimeout(() => setLocalStep((s) => s + 1), 1300)
    return () => clearTimeout(t)
  }, [localStep, guided.guided])
  const playing = step >= playSteps.length

  return (
    <div className="playflow">
      <button type="button" className="play-btn" onClick={() => !guided.guided && setLocalStep(0)} aria-label="Press Play">
        ▶
      </button>
      <ol className="play-steps">
        {playSteps.map(([k, t, d, illo], i) => (
          <motion.li key={k} animate={{ opacity: step >= i ? 1 : 0.3, y: step === i ? -6 : 0 }} className={step >= i ? 'is-on' : ''}>
            <span className="play-illo">
              <Illo name={illo} size={56} />
            </span>
            <span className="play-k">{k}</span>
            <strong>{t}</strong>
            <span>{d}</span>
          </motion.li>
        ))}
      </ol>
      <div className="eq" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            animate={playing ? { height: ['20%', `${30 + ((i * 37) % 70)}%`, '25%'] } : { height: '12%' }}
            transition={playing ? { repeat: Infinity, duration: 0.6 + (i % 5) * 0.12, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}
      </div>
      <AnimatePresence>
        {playing && (
          <motion.p className="punchline dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <mark>Software</mark> gives the instructions. <mark>Hardware</mark> carries them out.
          </motion.p>
        )}
      </AnimatePresence>
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

      <Section id="layers" eyebrow="How software is organised" title="Software comes in layers" intro="Built from the bottom up: each layer sits on the one below." tone="alt" steps={5}>
        <Layers />
      </Section>

      <Section id="together" eyebrow="Hardware + software" title="Working together: you press Play" intro="Tap the play button and follow what happens inside the phone." steps={5}>
        <Reveal>
          <PlayFlow />
        </Reveal>
      </Section>

      <Section id="try-taskmgr" eyebrow="Try it · 2 minutes" title="See hardware and software at work" tone="red">
        <div className="tryit-photos">
          <figure>
            <img src={photos.cpu} alt="CPU chips" />
            <figcaption>CPU: watch the % in use</figcaption>
          </figure>
          <figure>
            <img src={photos.ram} alt="RAM sticks" />
            <figcaption>Memory (RAM): watch it fill up</figcaption>
          </figure>
          <figure>
            <img src={photos.ssd} alt="SSD drives" />
            <figcaption>Disk (SSD): where apps are loaded from</figcaption>
          </figure>
        </div>
        <div className="card-grid two">
          <Reveal className="card card-on-red">
            <h3 className="with-logo">
              {logo('windows') && <img className="logo-inline" src={logo('windows')} alt="" />}
              Windows
            </h3>
            <p>
              Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Esc</kbd> to open Task Manager, then the <strong>Performance</strong> tab.
            </p>
          </Reveal>
          <Reveal className="card card-on-red" delay={0.1}>
            <h3>macOS</h3>
            <p>
              Press <kbd>Cmd</kbd> + <kbd>Space</kbd>, type <strong>Activity Monitor</strong>, then check the CPU and Memory tabs.
            </p>
          </Reveal>
        </div>
        <Reveal className="notice-list">
          <h3>What to notice</h3>
          <ul>
            <li>Every open app uses some CPU and RAM</li>
            <li>Open 10 browser tabs and watch Memory rise</li>
            <li>Close them and watch it fall again</li>
          </ul>
        </Reveal>
        <PauseBadge />
      </Section>
    </>
  )
}
