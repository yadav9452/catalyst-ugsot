/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroStack from './sections/HeroStack'

export const hero = {
  title: 'Linux',
  accent: 'Architecture',
  subtitle: 'Open Linux up layer by layer: the kernel, user space, system calls, the shell and the terminal. Then type your first real commands.',
  visual: HeroStack,
}

export const goals = [
  ['The layers', 'How Linux is built, and where the shell really fits'],
  ['Two spaces', 'Why apps live in user space and the kernel in kernel space'],
  ['System calls', 'How an app asks the kernel for anything'],
  ['Kernel, shell, terminal', 'Three words people mix up, untangled'],
  ['Your first commands', 'Read the prompt, build a command, and use the terminal like a developer'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'layers', label: 'Layers' },
  { id: 'spaces', label: 'Two spaces' },
  { id: 'syscalls', label: 'System calls' },
  { id: 'kernel', label: 'Kernel' },
  { id: 'shell', label: 'Shell' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'hands-on', label: 'Hands-on' },
  { id: 'dev', label: 'For developers' },
]

export const why = [
  ['>_', 'Every tool you’ll use (Git, npm, servers) is driven from the terminal'],
  ['⚙', 'When your app reads a file or opens a network connection, it’s making system calls'],
  ['🛡', 'User space protects you: a crashed app never takes the whole server down with it'],
  ['$', 'Reading the prompt and the parts of a command makes any new tool easier to learn'],
]

export const recap = [
  'Linux is layered: hardware, kernel, then user space (shell, desktop, apps).',
  'User space has limited access; only the kernel has full control.',
  'Apps reach the kernel through system calls such as open() and read().',
  'Linux uses a monolithic kernel with loadable modules.',
  'Terminal = the window, shell = the program that reads your command, kernel = does the work.',
  'A command = command + options + arguments, e.g. ls -l /home.',
]

export const quiz = [
  {
    q: 'Is the shell part of the kernel?',
    options: [
      'Yes, it is the core of the kernel',
      'No, it is a normal program in user space',
      'It is a piece of hardware',
      'It is the same thing as the terminal',
    ],
    a: 1,
    why: 'The shell is just a program in user space, like Chrome. It passes your commands on to the kernel.',
  },
  {
    q: 'Why can’t Chrome talk to the hard disk directly?',
    options: [
      'Chrome is too slow',
      'Apps run in user space with limited access; only the kernel may touch the hardware',
      'Hard disks only work with the CLI',
      'Chrome has no permission to read files at all',
    ],
    a: 1,
    why: 'User space is protected. Chrome asks the kernel with a system call, and the kernel talks to the disk.',
  },
  {
    q: 'Which of these is a system call?',
    options: ['ls -l', 'read()', '$PATH', 'Ctrl + C'],
    a: 1,
    why: 'read() is a request to the kernel. ls is a program, $PATH is a variable and Ctrl + C is a key combination.',
  },
  {
    q: 'In ls -l /home, which part is the option?',
    options: ['ls', '-l', '/home', 'The space'],
    a: 1,
    why: 'ls is the command, -l is the option (how to do it), /home is the argument (what to do it on).',
  },
  {
    q: 'What does pwd print?',
    options: ['Your password', 'The full path of the folder you are in', 'A list of files', 'The kernel version'],
    a: 1,
    why: 'pwd = print working directory, for example /home/student.',
  },
]

export const nextTeaser = 'Linux File System Structure: start at / and learn the folders every Linux machine has.'
