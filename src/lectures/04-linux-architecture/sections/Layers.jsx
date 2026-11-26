import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Callout, Section, Step, useStep } from "../../../design-system";
import { img, img3 } from "../images";

/* ---------- Lecture 3 rings → the precise picture ---------- */

const Precise = ({ pick, onPick }) => {
  const box = (k, label, extra = "") => (
    <button
      type="button"
      className={`l4-p l4-p-${k} ${extra} ${pick === k ? "is-on" : ""}`}
      aria-pressed={pick === k}
      onClick={() => onPick(k)}
    >
      {label}
    </button>
  );

  return (
    <div className="l4-precise">
      <StaticArchitectureDiagram />
      {box("you", "You")}
      <div className="l4-p-us">
        <span className="l4-p-tag">USER SPACE · limited access</span>
        <div className="l4-p-row">
          {box("shell", "Shell (bash, zsh)", "l4-p-app")}
          {box("gui", "Desktop (GUI)", "l4-p-app")}
          {box("apps", "Apps: Chrome, VS Code", "l4-p-app")}
        </div>
        {box("libs", "System libraries (e.g. glibc)")}
      </div>
      {box("sys", "System calls: open() · read() · write() · fork()")}
      {box("kernel", "KERNEL SPACE · full control")}
      {box("hw", "HARDWARE: CPU · RAM · storage · network")}
    </div>
  );
};

const info = {
  you: [
    "You",
    "You are the person at the keyboard. When you click an icon or type a command, you are telling the computer what to do. Your actions become messages that travel through the layers below. For example, when you click Save in VS Code, that click becomes a request to write a file on disk.",
  ],
  shell: [
    "Shell (bash, zsh)",
    "The shell is a program that reads the commands you type and asks the kernel to run them. It lives in user space, just like your browser or editor, and it is not a special barrier. When you type npm install, the shell finds the npm program, asks the kernel to run it, and shows you the result. As a developer, you will spend most of your day typing into a shell.",
  ],
  gui: [
    "Desktop (GUI)",
    "The graphical desktop is a program that draws windows, icons, and menus on your screen. When you drag a file to the Trash, the desktop asks the kernel, through system calls, to move that file on disk. It is another user-space program, and the same kernel serves both the desktop and the command line.",
  ],
  apps: [
    "Apps (Chrome, VS Code)",
    "Applications are the programs you use every day: your browser, your code editor, the database server you will deploy. They cannot touch the hardware directly. Instead, they call system libraries, which make system calls to the kernel. When your Node.js server listens on port 3000, it is asking the kernel to reserve that network port.",
  ],
  libs: [
    "System libraries (glibc, etc.)",
    "Libraries are ready-made tools that applications call to do common jobs. They handle opening files, sending network data, and allocating memory. The C library (glibc) is the most important one, and almost every program uses it. Using a library means the app does not have to know the kernel’s exact rules for every task.",
  ],
  sys: [
    "System calls",
    "System calls are the only safe doorway from user space into the kernel. They are a fixed list of requests, such as open() to open a file, read() to read data, write() to save data, and fork() to start a new process. Every program, from ls to your future web server, must use these calls to get anything done.",
  ],
  kernel: [
    "Kernel",
    "The kernel is the core of Linux. It is the first program loaded when the computer boots, and it has full control of the hardware. It decides which process runs on which CPU core, hands out memory, and talks to every device: disk, network card, keyboard. Nothing reaches the hardware without the kernel’s permission.",
  ],
  hw: [
    "Hardware",
    "The physical parts of the computer: the processor (CPU) that runs instructions, memory (RAM) that holds running programs and data, storage (SSD or HDD) that keeps files when the power is off, the network card that connects to the internet, and the keyboard, mouse, and monitor you use to interact.",
  ],
};

function StaticArchitectureDiagram() {
  return (
    <img
      src={img["screenshot-precise"]}
      alt="Linux architecture: hardware at the bottom, kernel space in the middle with system calls as the interface, and user space at the top containing apps, shell, GUI, and you."
    />
  );
}

function ZoomIn() {
  const { guided, shown } = useStep();
  const [view, setView] = useState("rings");
  const [pick, setPick] = useState("shell");
  const v = guided ? (shown(2) ? "precise" : "rings") : view;
  return (
    <div className="l4-zoom">
      <div className="segmented" role="group" aria-label="Choose a view">
        <button
          type="button"
          className={v === "rings" ? "is-on" : ""}
          aria-pressed={v === "rings"}
          onClick={() => setView("rings")}
        >
          Rings
        </button>
        <button
          type="button"
          className={v === "precise" ? "is-on" : ""}
          aria-pressed={v === "precise"}
          onClick={() => setView("precise")}
        >
          Precise
        </button>
      </div>
      <AnimatePresence mode="wait">
        {v === "rings" ? (
          <motion.figure
            key="rings"
            className="l4-rings"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3, filter: "blur(6px)" }}
          >
            <img
              src={img.rings}
              alt="Rings: hardware in the centre, then kernel, shell, application, user"
            />
            <figcaption>
              A good start, but it suggests apps go through the shell. They
              don't.
            </figcaption>
          </motion.figure>
        ) : (
          <motion.div
            key="precise"
            className="l4-zoom-precise"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <Precise pick={pick} onPick={setPick} />
            <AnimatePresence mode="wait">
              <motion.div
                key={pick}
                className="l4-p-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                aria-live="polite"
              >
                <p className="eyebrow">Click any box</p>
                <h3>{info[pick][0]}</h3>
                <p>{info[pick][1]}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- The five layers, bottom up ---------- */

const layers = [
  {
    n: 1,
    t: "Hardware",
    tag: "The physical parts",
    pic: img.pc,
    pts: ["CPU, RAM, storage, network card", "Keyboard, mouse, monitor"],
  },
  {
    n: 2,
    t: "Kernel",
    tag: "Brain of the OS",
    pic: img3.tux,
    pts: [
      "Core of the OS, loaded first at boot",
      "The only part allowed to talk to the hardware",
      "Manages CPU, memory and devices",
    ],
  },
  {
    n: 3,
    t: "Shell",
    tag: "Command handler",
    pic: img.nut,
    pts: [
      "A normal program in user space",
      "Reads your commands, runs programs and scripts",
      "Keeps environment variables: $HOME, $PATH, $USER",
    ],
  },
  {
    n: 4,
    t: "Applications",
    tag: "Chrome, VS Code",
    pic: img3.chrome,
    pts: [
      "User-facing software, including what you write",
      "Never touch the hardware directly",
      "Use system libraries, which make system calls",
    ],
  },
  {
    n: 5,
    t: "User",
    tag: "You",
    pic: img3.user,
    pts: [
      "You give instructions through a GUI or a CLI",
      "Both are programs in user space",
    ],
  },
];

function LayerTower() {
  const { guided, step } = useStep();
  const [pick, setPick] = useState(1);
  // Guided steps 3..7 walk the layers bottom-up.
  const active = guided && step >= 3 ? Math.min(step - 2, 5) : pick;
  const L = layers[active - 1];
  return (
    <div className="l4-tower">
      <ol className="l4-tower-list" aria-label="Linux layers, top to bottom">
        {[...layers].reverse().map((l) => (
          <li key={l.n}>
            <button
              type="button"
              className={`l4-tower-btn l4-t${l.n} ${active === l.n ? "is-on" : ""}`}
              aria-pressed={active === l.n}
              onClick={() => setPick(l.n)}
            >
              <span className="l4-tower-n">Layer {l.n}</span>
              <strong>{l.t}</strong>
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div
          key={L.n}
          className="l4-tower-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <img src={L.pic} alt="" />
          <div>
            <p className="eyebrow">
              Layer {L.n} · {L.tag}
            </p>
            <h3>{L.t}</h3>
            <ul>
              {L.pts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Layers() {
  return (
    <Section
      id="layers"
      eyebrow="Part 1 · Layered design"
      title="Linux Architecture"
      intro="Linux is split into two worlds: kernel space (the core, with full control of the hardware) and user space (everything else: the shell, the desktop and your apps)."
      steps={7}
    >
      <Step n={1}>
        <ZoomIn />
      </Step>
      <h3 className="sub">The five layers, from the bottom up</h3>
      <LayerTower />
      <Callout label="Remember">
        The shell is not a wall between apps and the kernel. It's one more
        program in user space, and everything reaches the kernel through system
        calls.
      </Callout>
    </Section>
  );
}
