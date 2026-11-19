import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'
import { img } from '../images'

// If Linux were a city… each folder is a well-known place.
const places = [
  {
    k: '/home',
    icon: '🏠',
    place: 'Houses',
    what: 'One personal folder per user. Your files, projects and settings live here.',
    eg: ['/home/jason', '/home/jason/Documents', '/home/pat'],
    dev: 'Your code projects usually live in your home folder, e.g. ~/projects/portfolio. On a Mac the home folders are in /Users instead (/Users/jason); in WSL it is /home/yourname.',
  },
  {
    k: '/etc',
    icon: '🏛',
    place: 'Town hall',
    what: 'System-wide settings (configuration files). Memory aid: “Editable Text Configurations”; the name really comes from “et cetera”.',
    eg: ['/etc/passwd (the list of users)', '/etc/hosts', '/etc/nginx/nginx.conf'],
    dev: 'When you set up a web server, you edit its config file in /etc.',
  },
  {
    k: '/var',
    icon: '📰',
    place: 'Newspaper office',
    what: 'Variable data that changes all the time: logs, queues, caches, app data.',
    eg: ['/var/log/syslog', '/var/log/nginx/access.log', '/var/lib (app data)', '/var/tmp'],
    dev: 'Website down? The first place to look is /var/log.',
  },
  {
    k: '/bin',
    icon: '🧰',
    place: 'Toolshed',
    what: 'Essential commands every user needs: ls, cp, mv, cat. On modern systems /bin is a shortcut (symlink) to /usr/bin.',
    eg: ['/bin/ls', '/bin/cp', '/bin/mv'],
    dev: 'When you type ls, the shell finds the program in one of these folders (remember $PATH from Lecture 4).',
  },
  {
    k: '/usr',
    icon: '🏬',
    place: 'Shopping mall',
    what: 'Installed programs and their libraries. /usr/bin has everyday apps; /usr/local/bin holds software you installed yourself.',
    eg: ['/usr/bin/git', '/usr/bin/node', '/usr/local/bin'],
    dev: 'Installing Node.js puts node and npm in /usr/bin or /usr/local/bin.',
  },
  {
    k: '/tmp',
    icon: '🗒',
    place: 'Scratch pad',
    what: 'Temporary files. Usually wiped when the computer restarts, so never keep anything important here.',
    eg: ['/tmp/upload-4821.jpg', '/tmp/npm-cache-…'],
    dev: 'Programs drop half-finished downloads and uploads here.',
  },
  {
    k: '/dev',
    icon: '🔌',
    place: 'Power station',
    what: 'Devices shown as files: disks, USB sticks, the keyboard.',
    eg: ['/dev/sda (first disk)', '/dev/null (a black hole: anything written to it disappears)'],
    dev: 'command > /dev/null is a common trick to throw output away.',
  },
  {
    k: '/proc',
    icon: '📡',
    place: 'Live news screen',
    what: 'Live information straight from the kernel. These “files” don’t exist on disk; the kernel makes them up when you read them.',
    eg: ['/proc/cpuinfo', '/proc/meminfo', '/proc/uptime'],
    dev: 'cat /proc/cpuinfo shows the CPU of the server you are logged in to. Works in Ubuntu on WSL; a Mac has no /proc.',
  },
  {
    k: '/root',
    icon: '👑',
    place: 'The mayor’s house',
    what: 'Home folder of the root (admin) user. Normal users can’t even look inside.',
    eg: ['/root'],
    dev: 'Not the same as / ! You’ll see why ownership matters in Lecture 6.',
  },
]

function City() {
  const [on, setOn] = useState(0)
  const p = places[on]
  return (
    <div className="l5-city">
      <div className="l5-city-map" role="tablist" aria-label="Linux folders as places in a city">
        <span className="l5-city-root" aria-hidden="true">
          /
        </span>
        {places.map((x, i) => (
          <button
            key={x.k}
            type="button"
            role="tab"
            aria-selected={on === i}
            className={`l5-bld ${on === i ? 'is-on' : ''}`}
            onClick={() => setOn(i)}
            style={{ '--d': `${i * 0.05}s` }}
          >
            <span className="l5-bld-icon" aria-hidden="true">
              {x.icon}
            </span>
            <code>{x.k}</code>
            <small>{x.place}</small>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={p.k}
          className="l5-city-info"
          role="tabpanel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <p className="eyebrow">
            {p.icon} {p.place}
          </p>
          <h3>
            <code>{p.k}</code>
          </h3>
          <p>{p.what}</p>
          <ul className="l5-city-eg">
            {p.eg.map((e) => (
              <li key={e}>
                <code>{e}</code>
              </li>
            ))}
          </ul>
          <p className="l5-city-dev">
            <strong>As a developer: </strong>
            {p.dev}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const progs = [
  ['/bin', 'Essential commands for everyone', 'ls, cp, mv'],
  ['/sbin', 'System admin tools, mainly for root', 'reboot, fdisk'],
  ['/usr/bin', 'Everyday user programs and utilities', 'git, node, python3'],
  ['/usr/sbin', 'Admin programs not needed to start the system', 'nginx, sshd'],
  ['/usr/local/bin', 'Software you installed yourself', 'tools you compiled or downloaded'],
]

export default function Fhs() {
  return (
    <>
      <Section
        id="fhs"
        eyebrow="Part 3 · The key folders"
        title="If Linux is a city, these are its landmarks"
        intro="Almost every Linux machine has the same folders, because they follow the Filesystem Hierarchy Standard (FHS). Learn them once, use them everywhere. Click a building."
        steps={2}
      >
        <Reveal>
          <City />
        </Reveal>
        <Step n={1}>
          <h3 className="sub">Where do programs live?</h3>
          <div className="l5-table-wrap">
            <table className="l5-table">
              <thead>
                <tr>
                  <th>Folder</th>
                  <th>What’s inside</th>
                  <th>Examples</th>
                </tr>
              </thead>
              <tbody>
                {progs.map(([a, b, c]) => (
                  <tr key={a}>
                    <td>
                      <code>{a}</code>
                    </td>
                    <td>{b}</td>
                    <td className="l5-muted">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
        <Step n={2}>
          <div className="l5-fhs-sum">
            <figure className="l5-fhs-fig">
              <img src={img['fhs-map']} alt="Map of the Linux file system: / with /etc, /var, /home, /usr and /tmp underneath" />
            </figure>
            <div>
              <h3>Everything is a file</h3>
              <p>
                A big Linux idea: disks (<code>/dev/sda</code>), kernel information (<code>/proc/cpuinfo</code>) and settings (<code>/etc/hosts</code>) all show
                up as files. So the same few commands (<code>ls</code>, <code>cat</code>) work on all of them.
              </p>
            </div>
          </div>
        </Step>
        <Callout>Deploying a website means knowing these folders: code in /home or /var/www, config in /etc, logs in /var/log.</Callout>
      </Section>
    </>
  )
}
