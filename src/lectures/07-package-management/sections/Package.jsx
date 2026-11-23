import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Callout, Reveal, Section, Step } from '../../../design-system'

/* ---------- Unbox a .deb ---------- */

const contents = [
  {
    k: 'bin',
    icon: '⚙️',
    name: 'Executable program files',
    where: '/usr/sbin/nginx',
    text: 'The program itself: the file your computer actually runs when you type nginx.',
  },
  {
    k: 'lib',
    icon: '🧩',
    name: 'Required libraries (if bundled)',
    where: '/usr/lib/…',
    text: 'Shared code the program uses. Usually these come as separate packages (dependencies) so many programs can share one copy.',
  },
  {
    k: 'conf',
    icon: '🛠',
    name: 'Configuration files',
    where: '/etc/nginx/nginx.conf',
    text: 'Settings you can change, like which port the web server listens on. They live in /etc, which you met in Lecture 5.',
  },
  {
    k: 'doc',
    icon: '📖',
    name: 'Documentation',
    where: '/usr/share/doc/nginx/',
    text: 'Manuals and help pages, so man nginx works.',
  },
  {
    k: 'meta',
    icon: '🏷',
    name: 'Metadata',
    where: 'inside the package',
    text: 'Information about the package: its name, version, who made it, and which other packages it depends on.',
    sample: ['Package: nginx', 'Version: 1.24.0-2ubuntu7.1', 'Architecture: amd64', 'Depends: nginx-common, libc6, libssl3t64, zlib1g', 'Description: small, powerful, scalable web/proxy server'],
  },
]

function Unbox() {
  const [open, setOpen] = useState(false)
  const [pick, setPick] = useState('bin')
  const c = contents.find((x) => x.k === pick)
  return (
    <div className="l7-unbox">
      <button type="button" className={`l7-box ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-pressed={open} aria-label={open ? 'Close the package' : 'Open the package'}>
        <motion.span className="l7-box-icon" aria-hidden="true" animate={{ rotate: open ? [0, -10, 10, 0] : 0, scale: open ? 1.1 : 1 }} transition={{ duration: 0.5 }}>
          {open ? '🗃' : '📦'}
        </motion.span>
        <code>nginx_1.24.0-2ubuntu7.1_amd64.deb</code>
        <small>{open ? 'Opened. Pick a part →' : 'Click to open the package'}</small>
      </button>
      <div className="l7-unbox-side">
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="l7-parts" role="group" aria-label="What’s inside the package">
                {contents.map((x, k) => (
                  <motion.button
                    key={x.k}
                    type="button"
                    className={`l7-chip ${pick === x.k ? 'is-on' : ''}`}
                    aria-pressed={pick === x.k}
                    onClick={() => setPick(x.k)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: k * 0.08 }}
                  >
                    <span aria-hidden="true">{x.icon}</span> {x.name}
                  </motion.button>
                ))}
              </div>
              <div className="l7-part-detail" aria-live="polite">
                <p>
                  <strong>{c.name}</strong> <code>{c.where}</code>
                </p>
                <p>{c.text}</p>
                {c.sample && (
                  <pre className="l7-pre">
                    {c.sample.join('\n')}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!open && <p className="l7-unbox-wait">A package is like a parcel: everything a program needs, packed in one file, with a label on the outside.</p>}
      </div>
    </div>
  )
}

/* ---------- Read a package file name ---------- */

const nameParts = [
  ['nginx', 'name', 'The package name. This is what you type in apt install nginx.'],
  ['_', 'sep', 'Underscores separate the parts.'],
  ['1.24.0', 'version', 'The version made by the program’s authors.'],
  ['-2ubuntu7.1', 'revision', 'Ubuntu’s own revision: how many times Ubuntu has repackaged or patched this version.'],
  ['_', 'sep', 'Underscores separate the parts.'],
  ['amd64', 'arch', 'The processor type (architecture). amd64 = normal 64-bit Intel/AMD PCs. Apple Silicon and phones use arm64.'],
  ['.deb', 'ext', 'The file type: a Debian package, used by Debian, Ubuntu and Linux Mint.'],
]

function FileName() {
  const [pick, setPick] = useState(0)
  return (
    <div className="l7-anat">
      <p className="l7-pick-label">Click each part of the file name</p>
      <div className="l7-anat-line" role="group" aria-label="Parts of a package file name">
        {nameParts.map(([t, , ], k) => (
          <button key={k} type="button" className={`l7-anat-part ${pick === k ? 'is-on' : ''}`} aria-pressed={pick === k} onClick={() => setPick(k)}>
            {t}
          </button>
        ))}
      </div>
      <p className="l7-anat-explain" aria-live="polite">
        <strong>{nameParts[pick][1] === 'sep' ? 'separator' : nameParts[pick][1]}</strong> {nameParts[pick][2]}
      </p>
    </div>
  )
}

const families = [
  ['Debian, Ubuntu, Mint', '.deb', 'apt (with dpkg)', 'sudo apt install nginx'],
  ['Fedora, Red Hat, Rocky', '.rpm', 'dnf (with rpm)', 'sudo dnf install nginx'],
  ['Arch Linux', '.pkg.tar.zst', 'pacman', 'sudo pacman -S nginx'],
  ['macOS', 'bottles', 'Homebrew', 'brew install nginx'],
  ['Windows', '.msi / .exe', 'winget', 'winget install Git.Git'],
]

export default function Package() {
  return (
    <Section
      id="package"
      eyebrow="Part 2 · Packages"
      title="What is a package?"
      intro="A package is a compressed archive file used to install software on a Linux system. One file, with everything the program needs inside."
      steps={2}
    >
      <Reveal>
        <Unbox />
      </Reveal>
      <Step n={1}>
        <h3 className="sub">A package’s name tells you a lot</h3>
        <FileName />
      </Step>
      <Step n={2}>
        <h3 className="sub">Different families, same idea</h3>
        <p className="l7-lead">Each Linux family has its own package format and manager. In this course we use Ubuntu, so: .deb files and apt.</p>
        <div className="table-wrap l7-table">
          <table className="compare">
            <thead>
              <tr>
                <th scope="col">System</th>
                <th scope="col">Package files</th>
                <th scope="col">Package manager</th>
                <th scope="col">Install nginx</th>
              </tr>
            </thead>
            <tbody>
              {families.map((f) => (
                <tr key={f[0]}>
                  <th scope="row">{f[0]}</th>
                  <td>
                    <code>{f[1]}</code>
                  </td>
                  <td>{f[2]}</td>
                  <td>
                    <code>{f[3]}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Step>
      <Callout>
        A Node.js project works the same way. Its package.json is the metadata: name, version and dependencies. npm install reads it and fetches every dependency, just like apt.
      </Callout>
    </Section>
  )
}
