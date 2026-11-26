import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Callout, Section, Step } from "../../../design-system";

const table = [
  ["Speed", "Fast", "Slower"],
  ["Learning", "Steeper at first", "Easy"],
  ["Usage", "Developers", "General users"],
  ["Automation", "Script it once, rerun anytime", "Click every time"],
  ["Remote servers", "Works over SSH", "Needs a screen"],
];

/* ---------- A developer's day in the terminal ---------- */

const day = [
  ["9:00", "cd ~/projects/portfolio", "Go to your project folder", []],
  [
    "9:01",
    "git pull",
    "Get your team’s latest code",
    ["Updating 3f2a1c4..9b7e2d0", " 2 files changed, 14 insertions(+)"],
  ],
  [
    "9:02",
    "npm install",
    "Install the packages the project needs",
    ["added 214 packages in 6s"],
  ],
  [
    "9:03",
    "npm run dev",
    "Start your app on your laptop",
    ["VITE ready in 312 ms", "➜  Local:   http://localhost:5173/"],
  ],
  [
    "16:30",
    'git commit -m "Add contact form"',
    "Save a snapshot of your work",
    ["[main 4c1d8e2] Add contact form", " 1 file changed, 42 insertions(+)"],
  ],
  [
    "17:00",
    "ssh student@my-server",
    "Log in to a Linux server, with no screen at all",
    ["Welcome to Ubuntu 24.04 LTS", "student@my-server:~$"],
  ],
];

function Day() {
  const [i, setI] = useState(0);
  const [time, cmd, what, out] = day[i];
  return (
    <div className="l4-day">
      <ol className="l4-day-list">
        {day.map(([t, c], n) => (
          <li key={c}>
            <button
              type="button"
              className={`${n === i ? "is-on" : ""} ${n < i ? "is-done" : ""}`}
              aria-pressed={n === i}
              onClick={() => setI(n)}
            >
              <span className="l4-day-time">{t}</span>
              <code>{c}</code>
            </button>
          </li>
        ))}
      </ol>
      <div className="tty l4-day-tty">
        <div className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          VS Code · Terminal
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={cmd}
            className="tty-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="tty-dim">
              # {time}: {what}
            </p>
            <p>
              <span className="tty-prompt">$</span> {cmd}
            </p>
            {out.map((o, n) => (
              <motion.p
                key={o}
                className="tty-out"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + n * 0.25 }}
              >
                {o}
              </motion.p>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="l4-day-nav">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setI((x) => Math.max(0, x - 1))}
            disabled={i === 0}
          >
            ← Earlier
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setI((x) => (x + 1) % day.length)}
          >
            {i === day.length - 1 ? "↺ Start the day again" : "Later →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DevTerminal() {
  return (
    <>
      <Section
        id="dev"
        eyebrow="Part 7 · The terminal in development"
        title="Would you rather click 10 times, or type 1 command?"
        intro="Lecture 3 compared the GUI and the CLI. Here’s the short version, with the two reasons that matter most to developers."
        steps={2}
      >
        <div className="table-wrap">
          <table className="compare l4-cli-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">CLI</th>
                <th scope="col">GUI</th>
              </tr>
            </thead>
            <tbody>
              {table.map(([f, c, g], i) => (
                <tr key={f} className={i >= 3 ? "l4-new-row" : ""}>
                  <th scope="row">{f}</th>
                  <td>{c}</td>
                  <td>{g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Step n={1}>
          <h3 className="sub">A developer’s day, in the terminal</h3>
          <Day />
        </Step>
        <Step n={2}>
          <Callout>
            VS Code has a terminal built in: View → Terminal. You’ll keep it
            open every day from now on.
          </Callout>
        </Step>
      </Section>

      {/* <Section id="fhs" eyebrow="A teaser for Lecture 5" title="Where does Linux store everything? It all starts at /" tone="alt">
        <div className="l4-fhs">
          <Reveal className="l4-fhs-pic">
            <img src={img['fhs-tree']} alt="The Linux folder tree: / at the top, with root, boot, bin, var, etc, media, home, sbin, usr, dev and opt below" />
          </Reveal>
          <div className="l4-fhs-text">
            <p className="lead">Every Linux distro follows the Filesystem Hierarchy Standard (FHS): the same folders in the same places.</p>
            <div className="l4-fhs-dirs">
              {[
                ['/home', 'your files'],
                ['/etc', 'settings'],
                ['/bin', 'programs'],
                ['/tmp', 'temporary files'],
                ['/proc', 'live kernel info, as files'],
              ].map(([d, t]) => (
                <span key={d} className="l4-dir" tabIndex={0}>
                  <code>{d}</code>
                  <small>{t}</small>
                </span>
              ))}
            </div>
            <p>
              Try <code>cat /proc/cpuinfo</code> in the practice terminal above (or in Ubuntu on WSL; a Mac has no /proc). Lecture 5 explores the whole tree.
            </p>
          </div>
        </div>
      </Section> */}
    </>
  );
}
