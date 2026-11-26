import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Callout, Reveal, Section, Step } from "../../../design-system";
import { img } from "../images";

/* ---------- Digital filing cabinet: click a drawer to open it ---------- */

const drawers = [
  { k: "Documents", files: ["reports.txt", "essays/", "presentation.ppt"] },
  { k: "Projects", files: ["portfolio/", "todo-app/", "README.md"] },
  { k: "Research", files: ["data.csv", "sources.txt", "charts/"] },
];

function Cabinet() {
  const [open, setOpen] = useState("Documents");
  return (
    <div className="l5-cabinet">
      {drawers.map((d) => {
        const on = open === d.k;
        return (
          <div key={d.k} className={`l5-drawer ${on ? "is-open" : ""}`}>
            <button
              type="button"
              className="l5-drawer-front"
              onClick={() => setOpen(on ? null : d.k)}
              aria-expanded={on}
            >
              <span className="l5-drawer-handle" aria-hidden="true" />
              {d.k}/
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.ul
                  className="l5-drawer-files"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {d.files.map((f) => (
                    <li key={f} className={f.endsWith("/") ? "is-dir" : ""}>
                      <span aria-hidden="true">
                        {f.endsWith("/") ? "📁" : "📄"}
                      </span>{" "}
                      {f}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- What a file system does: five jobs ---------- */

const jobs = [
  [
    "Storage",
    "Decides where each file’s bytes sit on the disk, and finds them again quickly.",
  ],
  [
    "Naming",
    "Gives every file a name and a path, so you can ask for “notes.txt” instead of “block 48213”.",
  ],
  ["Organisation", "Folders inside folders: one tidy tree instead of a pile."],
  [
    "Metadata",
    "Keeps facts about each file: size, when it was changed, who owns it.",
  ],
  [
    "Security",
    "Decides who may read, change or run each file. That’s Lecture 6!",
  ],
];

function Jobs() {
  const [on, setOn] = useState(0);
  return (
    <div className="l5-jobs">
      <figure className="l5-jobs-fig">
        <img
          src={img["fs-jobs"]}
          alt="The parts of a file system: disk management, naming, organisation, metadata and security"
        />
      </figure>
      <div>
        <div
          className="l5-jobs-tabs"
          role="tablist"
          aria-label="Jobs of a file system"
        >
          {jobs.map(([t], i) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={on === i}
              className={`l5-chip ${on === i ? "is-on" : ""}`}
              onClick={() => setOn(i)}
            >
              {i + 1}. {t}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={on}
            className="l5-jobs-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {jobs[on][1]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Extensions: rename photo.png to photo.txt ---------- */

function Extensions() {
  const [name, setName] = useState("photo.png");
  const renamed = name !== "photo.png";
  return (
    <div className="l5-ext">
      <div className="l5-ext-file">
        <motion.div
          className="l5-ext-icon"
          animate={{ rotate: renamed ? [0, -6, 6, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>{renamed ? "TXT" : "PNG"}</span>
          {renamed ? "📝" : "🖼"}
        </motion.div>
        <code>{name}</code>
        <div className="l5-ext-btns">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setName("photo.txt")}
            disabled={renamed}
          >
            mv photo.png photo.txt
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setName("photo.png")}
            disabled={!renamed}
          >
            ↺ Undo
          </button>
        </div>
      </div>
      <div className="l5-ext-views">
        <div className="l5-ext-view">
          <p className="eyebrow">Windows Explorer</p>
          <p>
            {renamed
              ? "Opens it in Notepad and shows gibberish. Windows trusts the extension."
              : "Opens it in Photos."}
          </p>
        </div>
        <div className="l5-ext-view is-linux">
          <p className="eyebrow">Linux terminal</p>
          <pre>
            <span className="l5-p">$</span> file {name}
            {"\n"}
            {name}: PNG image data, 1280 x 720
          </pre>
          <p>
            Linux looks inside the file. To Linux, the extension is just part of
            the name.
          </p>
        </div>
      </div>
      <Callout label="As a developer">
        <ul className="l5-bullets">
          <li>
            <strong>What an extension is:</strong> the part after the dot in a
            file name, e.g. <code>.js</code>, <code>.html</code>,{" "}
            <code>.png</code>.
          </li>
          <li>
            <strong>Linux doesn’t care:</strong> it checks the actual contents
            of the file, not the name. Rename <code>photo.png</code> to{" "}
            <code>photo.txt</code> and Linux still knows it’s an image.
          </li>
          <li>
            <strong>Windows/Mac do care:</strong> they use the extension to pick
            which app opens the file. That’s why a renamed picture “opens as
            text”.
          </li>
          <li>
            <strong>Extensions still matter:</strong> editors colour{" "}
            <code>.js</code> files, web servers serve <code>.html</code> as
            pages, and tools like <code>npm</code> rely on them. Keep using
            them.
          </li>
          <li>
            <strong>Show hidden extensions:</strong> File Explorer → View → Show
            → File name extensions; Mac: Finder → Settings → Advanced → Show all
            filename extensions.
          </li>
        </ul>
      </Callout>
    </div>
  );
}

export default function Basics() {
  return (
    <>
      <Section
        id="basics"
        eyebrow="Part 1 · Files and folders"
        title="What is a file system?"
        intro="Every photo, song and line of code on your computer is a file. The file system is how the computer keeps them all in order."
        steps={3}
      >
        <div className="l5-ff">
          <Reveal className="l5-ff-card">
            <img src={img.file} alt="" />
            <h3>File</h3>
            <p>Stores data: text, a picture, a program.</p>
          </Reveal>
          <Reveal className="l5-ff-vs" delay={0.1}>
            vs
          </Reveal>
          <Reveal className="l5-ff-card" delay={0.15}>
            <img src={img.folder} alt="" />
            <h3>Folder (directory)</h3>
            <p>Organises files, and other folders.</p>
          </Reveal>
        </div>
        <Step n={1}>
          <h3 className="sub">
            Think of it as a digital filing cabinet. Open a drawer:
          </h3>
          <Cabinet />
        </Step>
        <Step n={2}>
          <h3 className="sub">What does a file system actually do?</h3>
          <Jobs />
        </Step>
        <Step n={3}>
          <Callout label="Words to know">
            In Linux we usually say directory instead of folder. They mean
            exactly the same thing.
          </Callout>
        </Step>
      </Section>
      <Section
        id="extensions"
        eyebrow="File extensions"
        title="The .png in photo.png: does Linux care?"
        intro="What an extension really is, and why Linux doesn’t care about it."
        tone="alt"
      >
        <Reveal>
          <Extensions />
        </Reveal>
      </Section>
    </>
  );
}
