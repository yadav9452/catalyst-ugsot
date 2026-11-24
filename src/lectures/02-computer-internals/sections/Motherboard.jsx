import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, useStep } from '../../../design-system'
import { photos, pic } from '../images'

/*
 * A real motherboard photo (assets/lecture2/motherboard.webp) with numbered hotspots.
 * Click a spot to see what it is and which devices plug in there.
 * x/y are percentages of the photo. In guided mode, step n opens spot n.
 */
const spots = [
  {
    k: 'cpu',
    x: 33.5,
    y: 43.8,
    name: 'CPU socket',
    what: 'The CPU sits here, locked down by the metal lever. A fan or cooler goes on top of it.',
    devs: [['CPU', photos.cpu]],
  },
  {
    k: 'ram',
    x: 33.5,
    y: 16.6,
    name: 'RAM slots',
    what: 'Four long slots for RAM sticks. They sit right next to the CPU, so data travels only a short way.',
    devs: [['RAM sticks', photos.ram]],
  },
  {
    k: 'm2',
    x: 53.2,
    y: 35.5,
    name: 'M.2 slot',
    what: 'A fast SSD, about the size of a stick of chewing gum, screws flat onto the board here.',
    devs: [['M.2 SSD', photos.ssd]],
  },
  {
    k: 'sata',
    x: 67.1,
    y: 5.5,
    name: 'SATA ports',
    what: 'Cables from hard disk drives (HDDs) and older SSDs plug in here.',
    devs: [['Hard disk drive', pic('hdd')]],
  },
  {
    k: 'pcie',
    x: 62.4,
    y: 60.4,
    name: 'PCIe slots',
    what: 'Long slots for expansion cards. The graphics card (GPU) for games and video editing plugs in here.',
    devs: [],
  },
  {
    k: 'power',
    x: 38.2,
    y: 4.7,
    name: 'Power connector',
    what: 'The big 24-pin plug from the power supply. It feeds electricity to every part on the board.',
    devs: [],
  },
  {
    k: 'battery',
    x: 69.4,
    y: 60.4,
    name: 'CMOS battery',
    what: 'A coin battery that keeps the clock running and remembers the BIOS settings while the computer is unplugged.',
    devs: [],
  },
  {
    k: 'io',
    x: 26.6,
    y: 92.3,
    name: 'Back-panel ports',
    what: 'Under this cover are the ports you see at the back of the computer: USB, HDMI, network and audio. Your devices plug in here.',
    devs: [
      ['Keyboard', pic('keyboard')],
      ['Mouse', pic('mouse')],
      ['Monitor', photos.monitor],
      ['Speakers', pic('speaker')],
    ],
  },
]

function Board() {
  const { guided, step } = useStep()
  const [pick, setPick] = useState(0)
  const i = guided ? Math.max(0, Math.min(step, spots.length) - 1) : pick
  const s = spots[i]

  return (
    <div className="l2-mb">
      <div className="l2-mb-photo">
        <img src={pic('motherboard')} alt="A real motherboard seen from above, with numbered spots on its main parts" />
        {spots.map((p, k) => (
          <button
            key={p.k}
            type="button"
            className={`l2-mb-spot ${k === i ? 'is-on' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            aria-pressed={k === i}
            aria-label={p.name}
            onClick={() => setPick(k)}
            disabled={guided}
          >
            {k + 1}
          </button>
        ))}
      </div>

      <div className="l2-mb-side">
        <ol className="l2-mb-list" aria-label="Parts of the motherboard">
          {spots.map((p, k) => (
            <li key={p.k}>
              <button type="button" className={k === i ? 'is-on' : ''} aria-pressed={k === i} onClick={() => setPick(k)} disabled={guided}>
                <span>{k + 1}</span> {p.name}
              </button>
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.div key={s.k} className="l2-mb-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            <h3>
              <span>{i + 1}</span> {s.name}
            </h3>
            <p>{s.what}</p>
            {s.devs.length > 0 && (
              <>
                <p className="l2-mb-plugs">Plugs in here:</p>
                <div className="l2-mb-devs">
                  {s.devs.map(([name, src], k) => (
                    <motion.figure
                      key={name}
                      className="l2-mb-dev"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + k * 0.1 }}
                    >
                      {src && <img src={src} alt={name} />}
                      <figcaption>{name}</figcaption>
                    </motion.figure>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Motherboard() {
  return (
    <Section
      id="motherboard"
      eyebrow="Inside the box"
      title="The motherboard: where everything connects"
      intro="The motherboard is the big circuit board inside every computer. Every part plugs into it, and tiny copper tracks carry data between them. Click a number to see what goes where."
      tone="alt"
      steps={spots.length}
    >
      <Reveal>
        <Board />
      </Reveal>
      <Callout label="Remember">
        In a laptop or a phone, the same parts are squeezed onto a much smaller board, and many are soldered on, so you can’t swap them.
      </Callout>
    </Section>
  )
}
