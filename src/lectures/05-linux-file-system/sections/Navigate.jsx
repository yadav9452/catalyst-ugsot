import { useState } from 'react'
import { Callout, OsKeys, PauseBadge, Reveal, Section, Step } from '../../../design-system'
import { terminalKeys } from '../../../course/shortcuts'
import { img } from '../images'
import { HOME, makeFs, run } from './fsSim'
import Terminal from './Terminal'

const three = [
  ['pwd', 'Where am I?', 'Print working directory: shows the full path of the folder you are in.', '/home/student'],
  ['cd path', 'Go somewhere', 'Change directory. Give it an absolute or relative path.', 'cd /var/log'],
  ['ls', 'What’s here?', 'List the files and folders in the current folder (or the one you name).', 'notes.txt  projects/'],
]

const cdTricks = [
  ['cd ..', 'Up one folder'],
  ['cd ~  or just  cd', 'Home'],
  ['cd -', 'Back to where you just were'],
  ['cd /', 'Top of the tree'],
  ['Tab', 'Complete a name: type cd pro, press Tab'],
]

function LsLab() {
  const [flags, setFlags] = useState(['l'])
  const toggle = (f) => setFlags((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]))
  const cmd = `ls${flags.length ? ' -' + flags.join('') : ''}`
  const out = run(cmd, { cwd: HOME, fs: makeFs() }).out
  const tips = { l: 'long: permissions, owner, size, date', a: 'all: show hidden files (names starting with .)', R: 'recursive: every folder inside, too' }
  return (
    <div className="l5-ls">
      <div className="l5-ls-ctl">
        {['l', 'a', 'R'].map((f) => (
          <button key={f} type="button" className={`l5-chip ${flags.includes(f) ? 'is-on' : ''}`} onClick={() => toggle(f)} aria-pressed={flags.includes(f)}>
            -{f}
            <small>{tips[f]}</small>
          </button>
        ))}
      </div>
      <div className="l5-tty">
        <div className="l5-tty-bar">
          <span className="l5-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>student@laptop: ~</span>
        </div>
        <div className="l5-tty-body is-static">
          <p className="l5k-cmd">~$ {cmd}</p>
          {out.map((l, i) => (
            <p key={i} className={`l5k-${l.k}`}>
              {l.t || ' '}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

const mission = [
  { label: 'Print where you are now', hint: 'pwd', done: (s) => s.events.some((e) => e.cmd === 'pwd') },
  { label: 'Go to the top of the tree', hint: 'cd /', done: (s) => s.events.some((e) => e.cwdAfter === '/') },
  { label: 'List what’s at the top', hint: 'ls', done: (s) => s.events.some((e) => e.cmd === 'ls' && e.cwdBefore === '/' && e.ok) },
  { label: 'Go into /var (changing data)', hint: 'cd var', done: (s) => s.events.some((e) => e.cwdAfter === '/var') },
  { label: 'Go into log', hint: 'cd log', done: (s) => s.events.some((e) => e.cwdAfter === '/var/log') },
  {
    label: 'List the log files in detail',
    hint: 'ls -l',
    done: (s) => s.events.some((e) => e.cmd === 'ls' && e.flags.includes('l') && (e.cwdBefore === '/var/log' || e.args.some((a) => a.includes('/var/log')))),
  },
  {
    label: 'Bonus: read the system log',
    hint: 'cat syslog',
    done: (s) => s.events.some((e) => e.cmd === 'cat' && e.ok && e.args.some((a) => a.endsWith('syslog'))),
  },
]

export default function Navigate() {
  return (
    <>
      <Section
        id="navigate"
        eyebrow="Part 5 · Moving around"
        title="pwd, cd, ls: your three compass commands"
        intro="Lost? pwd. Want to go somewhere? cd. Want to look around? ls."
        steps={3}
      >
        <div className="l5-three">
          {three.map(([c, q, d, eg], i) => (
            <Reveal key={c} className="l5-three-card" delay={i * 0.1}>
              <p className="eyebrow">{q}</p>
              <code className="l5-big">{c}</code>
              <p>{d}</p>
              <pre>{eg}</pre>
            </Reveal>
          ))}
        </div>
        <Step n={1}>
          <h3 className="sub">cd shortcuts you’ll use every day</h3>
          <div className="l5-tricks">
            {cdTricks.map(([k, d]) => (
              <div key={k} className="l5-trick">
                <kbd>{k}</kbd>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </Step>
        <Step n={2}>
          <h3 className="sub">ls options: switch them on and off</h3>
          <LsLab />
        </Step>
        <Step n={3}>
          <OsKeys
            title="Terminal keys: Windows vs Mac"
            rows={terminalKeys}
            note="On a Mac, terminal shortcuts use the Control key (not Cmd), except copy and paste."
          />
        </Step>
      </Section>
      <Section
        id="mission"
        eyebrow="Mission"
        title="Find the system logs"
        intro="Developers do this whenever a server misbehaves. Type the commands in the practice terminal below (or in your real terminal). The checklist ticks itself."
        tone="alt"
      >
        <Reveal>
          <Terminal
            tasks={mission}
            welcome={['Mission: find where Linux keeps its log files.', 'Type help for the commands. Tab completes names.']}
            label="Mission terminal"
          />
        </Reveal>
        <div className="l5-real">
          <figure>
            <img src={img['root-ls']} alt="A real ls -l of / on an Ubuntu server, with var highlighted" />
            <figcaption>The same ls -l of / on a real Ubuntu server. Spot var at the bottom.</figcaption>
          </figure>
          <Callout label="Try /root">
            Type cd /root in the practice terminal. Permission denied! Only the root user may go in. More on that in Lecture 6.
          </Callout>
        </div>
        <PauseBadge>Pause the video and complete the mission in your own terminal too.</PauseBadge>
      </Section>
    </>
  )
}
