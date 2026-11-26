import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Section, Step } from "../../../design-system";

const jobs = [
  ["⏱", "Process scheduling", "Which program runs on the CPU, and when"],
  ["🧠", "Memory allocation", "Which program gets which part of RAM"],
  [
    "🔌",
    "Device communication",
    "Talks to disks, keyboards and network cards through drivers",
  ],
  ["🗂", "File system management", "Keeps files and folders on storage"],
  ["🔐", "Security & permissions", "Who may open, change or run what"],
];

/* ---------- Monolithic kernel ---------- */

function Monolithic() {
  return (
    <div className="l4-design">
      <div className="l4-design-stage">
        <div className="l4-design-user">
          <span className="l4-design-tag">User space</span>
          <span className="l4-svc app">Apps</span>
        </div>
        <div className="l4-design-line">system calls</div>
        <div className="l4-design-kernel">
          <span className="l4-design-tag">Kernel space</span>
          <div className="l4-svc">
            <Step n={2} delay={0.06}>
              Scheduler
            </Step>
            <Step n={3} delay={0.12}>
              Memory
            </Step>
            <Step n={4} delay={0.18}>
              File systems
            </Step>
            <Step n={5} delay={0.24}>
              Drivers
            </Step>
          </div>
        </div>
      </div>
      <div className="l4-design-pros">
        <p>✓ Fast: everything talks directly inside the kernel</p>
        <p>✓ Efficient resource handling</p>
        <p className="con">
          ✗ Trade-off: one buggy driver can crash the whole system
        </p>
      </div>
    </div>
  );
}

/* ---------- Loadable modules ---------- */

const baseMods = ["ext4", "snd_hda_intel", "i915", "usbhid"];

/* ---------- Without vs with modules ---------- */

function ModuleCompare() {
  const [mode, setMode] = useState("without");
  const isWith = mode === "with";
  return (
    <div className="l4-modcmp">
      <div className="segmented" role="group" aria-label="Without or with modules">
        <button
          type="button"
          className={mode === "without" ? "is-on" : ""}
          aria-pressed={mode === "without"}
          onClick={() => setMode("without")}
        >
          Without modules
        </button>
        <button
          type="button"
          className={mode === "with" ? "is-on" : ""}
          aria-pressed={mode === "with"}
          onClick={() => setMode("with")}
        >
          With modules
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="l4-modcmp-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <p className="l4-modcmp-head">
            {isWith ? "✅ Kernel ships lean, loads on demand" : "❌ Every driver baked in at compile time"}
          </p>
          <ul className="l4-ticks">
            <li>
              {isWith
                ? "Plug in a USB device → the right module appears automatically."
                : "Want a new Wi-Fi card? Rebuild the kernel and reboot the machine."}
            </li>
            <li>
              {isWith
                ? "Your cloud server supports dozens of hardware types without a custom kernel per machine."
                : "One kernel image must contain every driver you might ever need."}
            </li>
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Modules() {
  const [wifi, setWifi] = useState(false);
  const mods = wifi ? [...baseMods, "rtl8xxxu"] : baseMods;
  return (
    <div className="l4-mods">
      <div className="l4-mods-kernel">
        <span className="l4-design-tag">Running kernel</span>
        <div className="l4-mods-slots">
          <AnimatePresence>
            {mods.map((m) => (
              <motion.span
                key={m}
                className={`l4-mod ${m === "rtl8xxxu" ? "new" : ""}`}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {m}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <button
          type="button"
          className="btn btn-sm l4-plug"
          onClick={() => setWifi((w) => !w)}
        >
          {wifi
            ? "⏏ Unplug the USB Wi-Fi adapter"
            : "🔌 Plug in a USB Wi-Fi adapter"}
        </button>
      </div>
      <div className="tty">
        <div className="tty-bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          Terminal
        </div>
        <div className="tty-body">
          <p>
            <span className="tty-prompt">$</span> lsmod
          </p>
          <p className="tty-out">Module Used by</p>
          {mods.map((m) => (
            <p
              key={m}
              className={`tty-out ${m === "rtl8xxxu" ? "tty-hl" : ""}`}
            >
              {m.padEnd(18, " ")}
              {m === "rtl8xxxu" ? "0   ← just loaded" : "1"}
            </p>
          ))}
        </div>
      </div>
      <p className="l4-mods-cap" aria-live="polite">
        {wifi
          ? "Linux loaded the Wi-Fi driver as a module, without restarting."
          : "Loadable modules let Linux add or remove drivers while it runs."}
      </p>
    </div>
  );
}

export default function Kernel() {
  return (
    <Section
      id="kernel"
      eyebrow="Part 4 · The kernel"
      title="Kernel = the core of Linux. What does it do?"
      steps={5}
    >
      <div className="l4-jobs">
        {jobs.map(([ico, t, d], i) => (
          <Step key={t} n={i + 1} className="l4-job" delay={i * 0.06}>
            <span className="l4-job-ico" aria-hidden="true">
              {ico}
            </span>
            <strong>{t}</strong>
            <span>{d}</span>
          </Step>
        ))}
      </div>
      <Step n={4}>
        <h3 className="sub">
          Kernel design: Linux uses a monolithic kernel with loadable modules
        </h3>
        <Monolithic />
      </Step>
      <h3 className="sub">Loadable modules: add a driver while Linux runs</h3>
      <p className="lead">
        A module is a small piece of kernel code that plugs in or unloads
        while Linux keeps running. No rebuild, no reboot.
      </p>
      <Modules />
      <ModuleCompare />
    </Section>
  );
}
