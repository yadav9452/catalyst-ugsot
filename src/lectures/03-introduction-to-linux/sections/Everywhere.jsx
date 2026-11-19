import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Callout, Section, Step } from '../../../design-system'
import { img } from '../images'

/* ---------- Visit a website: the request goes to a Linux server ---------- */

const hops = ['Your browser', 'The internet', 'Linux web server']
const captions = [
  'You type youtube.com and press Enter.',
  'Your request travels across the internet…',
  '…to a web server. Very likely, it runs Linux.',
  'The server sends the page back…',
  'Your browser shows the page. Linux did the work you never saw.',
]

function Request() {
  const [i, setI] = useState(-1)
  useEffect(() => {
    if (i < 0 || i >= captions.length - 1) return
    const id = setTimeout(() => setI(i + 1), 1300)
    return () => clearTimeout(id)
  }, [i])
  const pos = [0, 1, 2, 1, 0][Math.max(i, 0)]
  return (
    <div className="req">
      <div className="req-track">
        {hops.map((h, k) => (
          <div key={h} className={`req-hop ${i >= 0 && pos === k ? 'is-on' : ''}`}>
            {k === 0 && <img src={img.chrome} alt="" />}
            {k === 1 && (
              <span className="req-cloud" aria-hidden="true">
                🌐
              </span>
            )}
            {k === 2 && (
              <span className="req-server">
                <img src={img.server} alt="" />
                <img className="req-tux" src={img.tux} alt="" />
              </span>
            )}
            <strong>{h}</strong>
          </div>
        ))}
        <motion.span
          className={`req-packet ${i >= 3 ? 'back' : ''}`}
          animate={{ left: `${16.7 + pos * 33.3}%`, opacity: i < 0 ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          aria-hidden="true"
        >
          {i >= 3 ? '📄' : '✉'}
        </motion.span>
      </div>
      <p className="req-caption" aria-live="polite">
        {i < 0 ? 'Press the button and follow one visit to a website.' : captions[i]}
      </p>
      <button type="button" className="btn btn-primary" onClick={() => setI(0)} disabled={i >= 0 && i < captions.length - 1}>
        {i === captions.length - 1 ? '↺ Visit again' : '▶ Visit youtube.com'}
      </button>
    </div>
  )
}

/* ---------- Where Linux is used ---------- */

const places = [
  {
    t: 'Web servers',
    d: 'Hosts web applications on the internet, plus database, file and email servers.',
    logos: [img.server, img.tux],
    chips: ['Web', 'Database', 'File', 'Email'],
    big: true,
  },
  {
    t: 'Cloud computing',
    d: 'Most virtual machines on the big clouds run Linux.',
    logos: [img.aws, img.gcloud, img.azure],
  },
  {
    t: 'Databases',
    d: 'Manages large data systems, including the databases inside SaaS apps.',
    logos: [img.mysql, img.postgres, img.mongodb],
  },
  {
    t: 'DevOps',
    d: 'High uptime, strong security, flexible setup. Jenkins, Ansible and Docker all run on Linux; containers are built on Linux features.',
    pipeline: true,
  },
]

function Pipeline() {
  return (
    <div className="pipe" aria-label="Code, build, test, deploy">
      {['Code', 'Build', 'Test', 'Deploy'].map((s, i) => (
        <span key={s} className="pipe-stage" style={{ '--d': `${i * 0.5}s` }}>
          {s}
        </span>
      ))}
    </div>
  )
}

const reasons = [
  ['🆓', 'Free and open source', 'No licence to buy, for one server or ten thousand.'],
  ['🔧', 'Easy to customise', 'Tune it for security, performance and special features.'],
  ['📈', 'Scales', 'The same Linux runs on a tiny board and on huge server farms.'],
  ['📜', 'No complex licensing', 'No restrictions on how many copies you run.'],
]

export default function Everywhere() {
  return (
    <>
      <Section id="everywhere" eyebrow="Part 4 · Did you know?" title="Most of the world’s web servers run Linux" tone="red" steps={1}>
        <Step n={1}>
          <Request />
        </Step>
      </Section>

      <Section id="where-used" eyebrow="Where is Linux used?" title="Four places you’ll meet Linux as a developer" steps={4}>
        <div className="card-grid two">
          {places.map((p, i) => (
            <Step key={p.t} n={i + 1} className="card place-card" delay={i * 0.08}>
              <div className={`place-logos ${p.big ? 'big' : ''}`}>
                {p.pipeline ? <Pipeline /> : p.logos.map((l) => <img key={l} src={l} alt="" />)}
                {p.chips && (
                  <span className="place-chips">
                    {p.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </span>
                )}
              </div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </Step>
          ))}
        </div>
      </Section>

      <Section
        id="why-servers"
        eyebrow="Why Linux for servers?"
        title="A web server doesn’t have to run Linux. So why does it, almost always?"
        tone="alt"
        steps={5}
      >
        <div className="card-grid four">
          {reasons.map(([ico, t, d], i) => (
            <Step key={t} n={i + 1} className="card reason-card" delay={i * 0.08}>
              <span className="card-icon">{ico}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Step>
          ))}
        </div>
        <Step n={5}>
          <p className="punchline">
            Widely adopted <span className="text-red">→</span> it became the industry standard.
          </p>
        </Step>
        <Callout>When you deploy your first website in this course, it will very likely land on a Linux machine.</Callout>
      </Section>
    </>
  )
}
