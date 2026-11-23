/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroApt from './sections/HeroApt'

export const hero = {
  title: 'Package Management and',
  accent: 'Software Installation',
  subtitle:
    'One command installs a program and everything it needs. Learn what packages and package managers are, use apt like a pro, and see why the servers behind the web run Linux.',
  visual: HeroApt,
}

export const goals = [
  ['Packages', 'What a package is, what’s inside it, and the problems package managers solve'],
  ['How apt works', 'Repositories, dependencies, and how APT and dpkg share the work'],
  ['apt commands', 'update, install, remove, purge, autoremove, upgrade, search and show'],
  ['Linux on the web', 'Why servers and the cloud run Linux, and local vs production environments'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'intro', label: 'Why' },
  { id: 'problem', label: 'The problem' },
  { id: 'package', label: 'Packages' },
  { id: 'manager', label: 'Package managers' },
  { id: 'flow', label: 'How it works' },
  { id: 'apt', label: 'APT & dpkg' },
  { id: 'inside', label: 'Inside install' },
  { id: 'repos', label: 'Repositories' },
  { id: 'commands', label: 'apt commands' },
  { id: 'update', label: 'update vs upgrade' },
  { id: 'cleanup', label: 'remove & purge' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'server', label: 'Web servers' },
  { id: 'environments', label: 'Local vs production' },
  { id: 'cloud', label: 'Why the cloud' },
  { id: 'practice', label: 'Practice lab' },
  { id: 'dev', label: 'Real errors' },
]

export const why = [
  ['🚀', 'Every server you deploy to starts with sudo apt update and sudo apt install: nginx, Node.js, git, a database'],
  ['🛡', 'Updates fix security holes. Keeping a server patched is mostly sudo apt update && sudo apt upgrade'],
  ['🧩', 'Your own projects use the same idea: npm installs JavaScript packages and their dependencies just like apt'],
  ['☁️', 'Most cloud servers run Linux, so the commands you practise on your laptop are the ones you’ll use in production'],
]

export const recap = [
  'A package is a compressed file with a program, its libraries, config files, docs and metadata (name, version, dependencies).',
  'A package manager installs, updates, configures and removes packages, and installs their dependencies for you.',
  'Packages come from repositories: trusted, signed servers. apt update refreshes the list of what they offer.',
  'APT is the brain (finds packages, works out dependencies); dpkg is the hands (unpacks and sets up .deb files).',
  'sudo apt install x installs; remove uninstalls but keeps settings; purge deletes settings too; autoremove clears unused dependencies.',
  'update refreshes the list; upgrade installs newer versions; full-upgrade may also add or remove packages to finish the job.',
  'apt search finds packages and apt show describes one. Neither needs sudo.',
  'Servers and the cloud run Linux because it’s free, stable, secure, light and easy to automate. Keep local and production as alike as you can.',
]

export const quiz = [
  {
    q: 'You just set up Ubuntu. sudo apt install tree says “Unable to locate package tree”. What should you run first?',
    options: ['sudo apt upgrade', 'sudo apt update', 'sudo apt autoremove', 'apt show tree'],
    a: 1,
    why: 'apt only knows what’s in the repositories after apt update downloads the latest package lists.',
  },
  {
    q: 'What is the difference between apt update and apt upgrade?',
    options: [
      'They do the same thing',
      'update refreshes the list of available versions; upgrade installs the newer versions',
      'update installs new software; upgrade removes old software',
      'update is for Ubuntu, upgrade is for Debian',
    ],
    a: 1,
    why: 'update is “check the menu”; upgrade is “order the new dishes”. Run update first, then upgrade.',
  },
  {
    q: 'Which part does the actual unpacking and installing of a .deb file?',
    options: ['APT', 'dpkg', 'The repository', 'sudo'],
    a: 1,
    why: 'APT is the brain: it finds packages and works out dependencies. dpkg is the hands: it installs the .deb files.',
  },
  {
    q: 'You want to uninstall nginx AND delete its configuration files in /etc/nginx. Which command?',
    options: ['sudo apt remove nginx', 'sudo apt purge nginx', 'sudo apt autoremove', 'sudo apt clean nginx'],
    a: 1,
    why: 'remove keeps the settings in case you reinstall. purge deletes them too.',
  },
  {
    q: 'What does a package manager do when a program needs three libraries you don’t have?',
    options: ['Shows an error and stops', 'Asks you to download them from a website', 'Installs them automatically as dependencies', 'Ignores them'],
    a: 2,
    why: 'Resolving and installing dependencies is one of a package manager’s main jobs.',
  },
  {
    q: 'Why is installing from a repository safer than downloading a program from a random website?',
    options: ['Repositories are faster', 'Packages are digitally signed and apt checks them before installing', 'Websites can’t host Linux software', 'Repositories only have free software'],
    a: 1,
    why: 'apt checks each package’s signature, so a file that was changed by someone else is refused.',
  },
  {
    q: 'Which commands do NOT need sudo?',
    options: ['apt install and apt remove', 'apt update and apt upgrade', 'apt search and apt show', 'apt purge and apt autoremove'],
    a: 2,
    why: 'Searching and reading package details change nothing on the system, so any user can run them.',
  },
  {
    q: 'Which is a good reason most cloud servers run Linux?',
    options: ['It has the nicest desktop', 'It’s free, stable and easy to control from the command line', 'It only runs websites', 'It never needs updates'],
    a: 1,
    why: 'No licence fees, long uptimes and full control over SSH and scripts make Linux ideal for thousands of servers.',
  },
]

export const nextTeaser = 'Why Version Control Exists: stop saving final-v2-REAL.zip and start tracking your code with Git.'
