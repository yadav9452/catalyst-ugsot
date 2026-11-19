/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroTerminal from './sections/HeroTerminal'

export const hero = {
  title: 'Introduction to',
  accent: 'Linux',
  subtitle: 'Meet the operating system: what it does for you, how Windows, macOS and Linux differ, and why Linux runs the internet.',
  visual: HeroTerminal,
}

export const goals = [
  ['What an OS is', 'The manager between you, your apps and the hardware, and its six jobs'],
  ['Kernel and shell', 'The two parts of every OS, and how a command travels through them'],
  ['Windows, macOS, Linux', 'Where each came from, open vs closed source, and the family tree'],
  ['Linux distros', 'Ubuntu, Debian, Mint, Fedora, and which one to pick'],
  ['Where Linux runs', 'Servers, cloud, databases and DevOps, and how to get it on your laptop'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'hook', label: 'Linux today' },
  { id: 'why-os', label: 'Why an OS' },
  { id: 'jobs', label: 'Six jobs' },
  { id: 'interfaces', label: 'GUI vs CLI' },
  { id: 'kernel-shell', label: 'Kernel & shell' },
  { id: 'three-os', label: 'Win · Mac · Linux' },
  { id: 'distros', label: 'Distros' },
  { id: 'everywhere', label: 'Where it runs' },
  { id: 'get-linux', label: 'Get Linux' },
]

export const why = [
  ['🐧', 'The servers, cloud machines and containers your code is deployed to almost always run Linux'],
  ['>_', 'Servers have no screen, so you will manage them through a shell, one command at a time'],
  ['⌘', 'macOS and Linux share UNIX roots, so the commands you learn work on both; Windows gets them through WSL'],
  ['{ }', 'Open source means you can read how things work, and every distro you meet is built on the same kernel'],
]

export const recap = [
  'An OS manages the hardware for users and apps.',
  'Its six jobs: interface, resources, multitasking, memory and files, security, program execution.',
  'The kernel works with the hardware; the shell carries your commands to the kernel.',
  'Windows and macOS are closed source; Linux is open source and free.',
  'A distro = Linux kernel + software + tools (Ubuntu, Debian, Mint, Fedora).',
  'Linux runs most web servers, cloud machines, databases and DevOps tools.',
]

export const quiz = [
  {
    q: 'You open Chrome, play music and download a file at the same time. Who shares the CPU and RAM between them?',
    options: ['Chrome', 'The operating system', 'The keyboard', 'The internet'],
    a: 1,
    why: 'Sharing the hardware between apps is the operating system’s job (resource management and multitasking).',
  },
  {
    q: 'Which part of the OS talks directly to the hardware?',
    options: ['The shell', 'The kernel', 'The browser', 'The desktop wallpaper'],
    a: 1,
    why: 'The kernel is the core of the OS. The shell takes your commands and passes them to the kernel.',
  },
  {
    q: 'Why can anyone build their own Linux distro?',
    options: ['Linux is sold by one company', 'Linux is open source', 'Linux only runs on servers', 'Linux has no kernel'],
    a: 1,
    why: 'Open source means anyone may read, change and share the code, so anyone can package their own version.',
  },
  {
    q: 'A friend is switching from Windows and wants an easy start. Which distro fits best?',
    options: ['Linux Mint or Ubuntu', 'MS-DOS', 'Windows NT', 'A distro with no desktop'],
    a: 0,
    why: 'Mint and Ubuntu are made for newcomers and look familiar to Windows users.',
  },
  {
    q: 'Why do Mac Terminal commands feel almost the same as Linux commands?',
    options: ['Apple bought Linux', 'Both come from the UNIX family of ideas', 'They use the same keyboard', 'They don’t; they are totally different'],
    a: 1,
    why: 'macOS is built on UNIX foundations and Linux was written to work like UNIX, so their commands match closely.',
  },
]

export const nextTeaser = 'Linux Architecture: the kernel, the shell and your first terminal commands.'
