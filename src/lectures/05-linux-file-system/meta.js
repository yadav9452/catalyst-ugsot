/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroTree from "./sections/HeroTree";

export const hero = {
  title: "Linux File System",
  accent: "Structure",
  subtitle:
    "One tree, starting at /. Learn where everything lives, how to give directions with paths, and how to create, copy, move and delete files without fear.",
  visual: HeroTree,
};

export const goals = [
  ["One tree", "How Linux organises everything under a single root, /"],
  [
    "The key folders",
    "/home, /etc, /var, /bin, /usr, /tmp and what lives in each",
  ],
  ["Paths", "Absolute vs relative paths, and the shortcuts . .. ~"],
  ["Hands on files", "Create, edit, copy, move, rename and delete, safely"],
  ["Names and wildcards", "Name files well and work with many files at once"],
];

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: "basics", label: "Files & folders" },
  { id: "tree", label: "One tree" },
  { id: "fhs", label: "Key folders" },
  { id: "paths", label: "Paths" },
  { id: "navigate", label: "Navigate" },
  { id: "create", label: "Create files" },
  { id: "editors", label: "nano & vim" },
  { id: "folders", label: "Folders" },
  { id: "file-ops", label: "Copy · move · delete" },
  { id: "names", label: "Names & wildcards" },
  { id: "lab", label: "Practice lab" },
];

export const why = [
  [
    "📁",
    "Every project you build is a folder tree: src/, public/, node_modules/, package.json",
  ],
  [
    "🧭",
    "Paths are everywhere in code: imports, image links, config files and terminal commands",
  ],
  [
    "🖥",
    "On a server you have no Finder or Explorer: cd, ls, cp and mv are how you get around",
  ],
  ["🪵", "When a website breaks, the first place you look is /var/log"],
];

export const recap = [
  "Linux has one tree that starts at / (the root directory). Extra disks appear inside it.",
  "/ is the root directory, root is the admin user, /root is root’s home folder.",
  "Key folders: /home (users), /etc (settings), /var (logs and changing data), /bin and /usr/bin (programs), /tmp (temporary).",
  "Absolute paths start at /. Relative paths start from where you are. Shortcuts: .  ..  ~",
  "pwd shows where you are, cd moves you, ls lists (-l details, -a hidden, -R everything inside).",
  "touch creates, echo/cat with > overwrites and >> appends; nano and vim edit; mkdir -p builds nested folders.",
  "cp copies (-r for folders), mv moves and renames, rm deletes for good: -i asks, -n never overwrites.",
  "Avoid spaces and special characters in names. Wildcards * ? [ ] match many files at once.",
];

export const quiz = [
  {
    q: "What is the difference between / and /root?",
    options: [
      "They are the same folder",
      "/ is the top of the whole tree; /root is the admin user’s home folder",
      "/root is the top of the tree; / is a shortcut for home",
      "/ holds programs; /root holds logs",
    ],
    a: 1,
    why: "Every path starts at /. /root is just one folder inside it: the home folder of the root (admin) user.",
  },
  {
    q: "You are in /home/jason. Which is the relative path to /home/jason/scripts/run.sh?",
    options: [
      "/scripts/run.sh",
      "scripts/run.sh",
      "../scripts/run.sh",
      "~/home/jason/scripts/run.sh",
    ],
    a: 1,
    why: "A relative path starts from where you are and never begins with /. scripts/run.sh (or ./scripts/run.sh) is right.",
  },
  {
    q: 'You run echo "hi" > notes.txt twice. How many lines does notes.txt have?',
    options: ["Zero", "One", "Two", "It depends on the file size"],
    a: 1,
    why: '> empties the file first every time, so only the last "hi" is left. Use >> to append.',
  },
  {
    q: "Which command creates AI_Project/src even if AI_Project doesn’t exist yet?",
    options: [
      "mkdir AI_Project/src",
      "mkdir -r AI_Project/src",
      "mkdir -p AI_Project/src",
      "touch AI_Project/src",
    ],
    a: 2,
    why: "-p (parents) creates any missing folders on the way.",
  },
  {
    q: "How do you rename draft.txt to final.txt?",
    options: [
      "rename draft.txt final.txt",
      "cp draft.txt final.txt",
      "mv draft.txt final.txt",
      "rm draft.txt final.txt",
    ],
    a: 2,
    why: "Renaming is moving a file to a new name, so mv does it. cp would leave two files.",
  },
  {
    q: "Which files does ls file?.txt match?",
    options: [
      "file1.txt and file10.txt",
      "file1.txt and fileA.txt",
      "Only file10.txt",
      "Every .txt file",
    ],
    a: 1,
    why: "? matches exactly one character, so file10.txt (two characters) is not matched.",
  },
  {
    q: "You want to move report.txt into archive/ but never overwrite a file that is already there. Which option?",
    options: ["mv -f", "mv -i", "mv -n", "mv -r"],
    a: 2,
    why: "-n means no-clobber: if archive/report.txt exists, mv does nothing. -i would ask you; -f would overwrite.",
  },
];

export const nextTeaser =
  "Permissions and Ownership: who is allowed to read, write and run each file, and why it matters on a server.";
