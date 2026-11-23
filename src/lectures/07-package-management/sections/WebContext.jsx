import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step, useStep } from '../../../design-system'

/* ---------- Linux as a web server OS: follow a request ---------- */

const hops = [
  ['🧑‍💻', 'Browser', 'A visitor opens https://my-site.com.', null],
  ['🌍', 'Internet', 'The request travels across the internet to your server’s address.', null],
  ['🐧', 'Ubuntu server', 'A cloud computer running Linux, with no screen or desktop. You control it over SSH from your terminal.', null],
  ['🚦', 'nginx', 'The web server receives the request. It sends back HTML, CSS and images from /var/www, or passes the request to your app.', 'sudo apt install nginx'],
  ['🟩', 'Node.js app', 'Your code runs here: it builds the page or the data the visitor asked for.', 'sudo apt install nodejs'],
  ['🗃', 'Database', 'Your app reads and saves data, such as users and orders.', 'sudo apt install postgresql'],
]

function Request() {
  const { guided, step } = useStep()
  const [local, setLocal] = useState(0)
  const i = guided ? Math.min(step, hops.length - 1) : local
  return (
    <div className="l7-req">
      <ol className="l7-req-path">
        {hops.map(([icon, name], k) => (
          <li key={name}>
            <button type="button" className={`l7-req-hop ${k === i ? 'is-on' : ''} ${k < i ? 'is-past' : ''} ${k >= 2 ? 'is-server' : ''}`} aria-pressed={k === i} onClick={() => setLocal(k)} disabled={guided}>
              <span aria-hidden="true">{icon}</span>
              <strong>{name}</strong>
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={i} className="l7-req-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
          <p>
            <strong>{hops[i][1]}.</strong> {hops[i][2]}
          </p>
          {hops[i][3] && (
            <p className="l7-req-apt">
              How it got onto the server: <code>{hops[i][3]}</code>
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      {!guided && (
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setLocal((i + 1) % hops.length)}>
          {i === hops.length - 1 ? '↺ Start again' : 'Follow the request →'}
        </button>
      )}
    </div>
  )
}

const links = [
  ['4', 'The terminal', 'Servers have no desktop. You manage them through the shell, often over SSH.'],
  ['5', 'The file system', 'Websites live in /var/www, settings in /etc/nginx, logs in /var/log/nginx.'],
  ['6', 'Permissions', 'nginx runs as the small user www-data, so a hacked site can’t touch the rest.'],
  ['7', 'Packages', 'Every piece of the server arrives with sudo apt install.'],
]

/* ---------- Local vs production ---------- */

const envRows = [
  ['Where', 'Your laptop (Ubuntu in WSL, or macOS)', 'A server in a data centre or the cloud'],
  ['Who uses it', 'Only you (and maybe your team)', 'Real users, maybe thousands'],
  ['Data', 'Fake test data', 'Real data: real accounts and orders'],
  ['Errors', 'Shown in detail, to help you fix them', 'Hidden from users and written to log files'],
  ['If it breaks', 'No problem: fix it and try again', 'Users can’t use the site, the business loses money'],
  ['How it changes', 'Any time you save a file', 'Only through a careful, tested deploy'],
  ['Running', 'When you start it', '24 hours a day, 7 days a week'],
]

const sortItems = [
  ['Testing a new feature before anyone sees it', 'local'],
  ['Real customers placing orders', 'prod'],
  ['Detailed error messages on the page', 'local'],
  ['Running 24/7 on a cloud server', 'prod'],
  ['Fake test data', 'local'],
  ['Changes arrive only through a deploy', 'prod'],
  ['Restarting it whenever you like', 'local'],
  ['Security updates applied quickly', 'prod'],
]

function Environments() {
  const [env, setEnv] = useState('local')
  return (
    <div className="l7-env">
      <div className="l7-seg" role="group" aria-label="Pick an environment">
        <button type="button" className={env === 'local' ? 'is-on' : ''} aria-pressed={env === 'local'} onClick={() => setEnv('local')}>
          💻 Local (development)
        </button>
        <button type="button" className={env === 'prod' ? 'is-on' : ''} aria-pressed={env === 'prod'} onClick={() => setEnv('prod')}>
          🌐 Production
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.dl key={env} className={`l7-env-card is-${env}`} initial={{ opacity: 0, rotateY: -12 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0 }} aria-live="polite">
          {envRows.map((r) => (
            <div key={r[0]}>
              <dt>{r[0]}</dt>
              <dd>{env === 'local' ? r[1] : r[2]}</dd>
            </div>
          ))}
        </motion.dl>
      </AnimatePresence>
    </div>
  )
}

function EnvSort() {
  const [ans, setAns] = useState({})
  const score = sortItems.filter((t, k) => ans[k] === t[1]).length
  const answered = Object.keys(ans).length
  return (
    <div className="l7-sort">
      <p className="l7-pick-label">Local or production?</p>
      <ul className="l7-sort-list">
        {sortItems.map(([t, right], k) => (
          <li key={t} className={ans[k] ? (ans[k] === right ? 'is-right' : 'is-wrong') : ''}>
            <span>{t}</span>
            <span className="l7-seg sm" role="group" aria-label={`Local or production: ${t}`}>
              {[
                ['local', '💻 Local'],
                ['prod', '🌐 Production'],
              ].map(([w, label]) => (
                <button key={w} type="button" className={ans[k] === w ? 'is-on' : ''} aria-pressed={ans[k] === w} onClick={() => setAns((a) => ({ ...a, [k]: w }))}>
                  {label}
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
        {answered === sortItems.length ? `${score} / ${sortItems.length} correct${score === sortItems.length ? ' 🎉' : ''}` : `${answered} of ${sortItems.length} answered`}
      </p>
    </div>
  )
}

/* ---------- Why the cloud uses Linux ---------- */

const reasons = [
  ['💸', 'Free and open source', 'No licence to pay for each server. With hundreds of servers, that saves a lot of money, and anyone can read and improve the code.'],
  ['🪶', 'Lightweight', 'A server doesn’t need a desktop. Without one, more memory and processor power is left for your website.'],
  ['🛡', 'Secure', 'Users and permissions (Lecture 6) limit damage, and security fixes arrive quickly through apt.'],
  ['⏱', 'Stable', 'Linux servers can run for months without a restart. Websites need to be up all the time.'],
  ['🤖', 'Easy to automate', 'Everything is a command, so one script can set up one server or a thousand identical ones: sudo apt install -y nginx nodejs.'],
  ['🔧', 'Flexible', 'Cloud companies can tune Linux for their own hardware, and a huge community shares fixes and answers.'],
]

function Scale() {
  const [n, setN] = useState(10)
  return (
    <div className="l7-scale">
      <label className="l7-scale-label" htmlFor="l7-servers">
        Your company runs <strong>{n}</strong> server{n > 1 ? 's' : ''}
      </label>
      <input id="l7-servers" type="range" min="1" max="1000" value={n} onChange={(e) => setN(Number(e.target.value))} />
      <div className="l7-scale-cols">
        <div>
          <p>Operating system licences to buy</p>
          <strong className="l7-scale-num">0</strong>
          <small>Linux (Ubuntu, Debian…)</small>
        </div>
        <div>
          <p>Operating system licences to buy</p>
          <strong className="l7-scale-num is-bad">{n.toLocaleString('en-GB')}</strong>
          <small>a paid server OS: one per server</small>
        </div>
        <div>
          <p>Commands to install nginx on all of them</p>
          <strong className="l7-scale-num">1</strong>
          <small>a script that runs sudo apt install -y nginx everywhere</small>
        </div>
      </div>
    </div>
  )
}

function Reasons() {
  const [open, setOpen] = useState(null)
  return (
    <div className="l7-reasons">
      {reasons.map(([icon, t, d], k) => (
        <button key={t} type="button" className={`l7-reason ${open === k ? 'is-open' : ''}`} aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)}>
          <span className="l7-reason-icon" aria-hidden="true">
            {icon}
          </span>
          <strong>{t}</strong>
          <AnimatePresence initial={false}>
            {open === k && (
              <motion.span className="l7-reason-text" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                {d}
              </motion.span>
            )}
          </AnimatePresence>
          {open !== k && <small>Tap to see why</small>}
        </button>
      ))}
    </div>
  )
}

export default function WebContext() {
  return (
    <>
      <Section
        id="server"
        eyebrow="Part 7 · Linux in web development"
        title="Linux is the web server’s operating system"
        intro="Most of the servers behind the websites you use run Linux. Follow one visit to a website and see where Linux, and apt, come in."
        tone="alt"
        steps={5}
      >
        <Reveal>
          <Request />
        </Reveal>
        <h3 className="sub">Everything you’ve learned meets on a server</h3>
        <div className="card-grid four">
          {links.map(([n, t, d]) => (
            <Reveal key={t} className="card">
              <span className="l7-lec">Lecture {n}</span>
              <h4>{t}</h4>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="environments"
        eyebrow="Two places your code lives"
        title="Local vs production environments"
        intro="An environment is a place where your code runs. You build on your own laptop (local). Real users visit the live site (production)."
        steps={1}
      >
        <Reveal>
          <Environments />
        </Reveal>
        <Step n={1}>
          <EnvSort />
        </Step>
        <Callout label="“But it works on my machine!”">
          A classic bug: the site works locally but breaks in production, because the two have different versions of Node.js, a library or the OS. Keep them alike: use Ubuntu
          in WSL like your server does, and install the same package versions with apt. Later you’ll meet tools like Docker that make the two match exactly.
        </Callout>
      </Section>

      <Section id="cloud" eyebrow="The cloud" title="Why the cloud runs on Linux" intro="AWS, Google Cloud and Azure all let you rent Linux servers, and most of their customers do. Here’s why." tone="rose" steps={1}>
        <Reveal>
          <Reasons />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">Now multiply by a thousand</h3>
          <Scale />
        </Step>
      </Section>
    </>
  )
}
