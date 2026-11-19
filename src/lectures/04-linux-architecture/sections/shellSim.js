/*
 * A tiny pretend Linux shell for the hands-on section.
 * It knows a small fake file system and a handful of beginner commands.
 */
export const HOME = '/home/student'

export function makeFs() {
  return {
    '/': ['bin', 'etc', 'home', 'proc', 'tmp', 'usr'],
    '/bin': ['bash', 'ls', 'pwd'],
    '/etc': ['hostname', 'passwd'],
    '/home': ['student'],
    '/home/student': ['notes.txt', 'projects'],
    '/home/student/projects': [],
    '/proc': ['cpuinfo', 'uptime'],
    '/tmp': [],
    '/usr': ['bin', 'lib'],
    '/usr/bin': ['git', 'ls', 'node', 'npm'],
    '/usr/lib': [],
  }
}

export const ENV = { HOME, USER: 'student', SHELL: '/bin/bash', PATH: '/usr/local/bin:/usr/bin:/bin', PWD: HOME }

export const COMMANDS = ['cat', 'cd', 'clear', 'date', 'echo', 'help', 'history', 'ls', 'man', 'mkdir', 'pwd', 'uname', 'whoami']

const MAN = {
  ls: 'ls - list directory contents. Options: -l long format, -a show hidden files.',
  pwd: 'pwd - print the name of the current working directory.',
  cd: 'cd - change the current directory. cd .. goes up, cd ~ goes home.',
  whoami: 'whoami - print your user name.',
  echo: 'echo - print text. Variables like $HOME are replaced by their values.',
  uname: 'uname - print system information. -a prints everything, -s the kernel name.',
  date: 'date - print the date and time.',
  mkdir: 'mkdir - make a new directory.',
  cat: 'cat - print the contents of a file.',
  history: 'history - list the commands you have typed.',
  clear: 'clear - clear the terminal screen.',
  man: 'man - show the manual for a command. Press q to quit (here it just prints one line).',
}

export function shortPath(p) {
  return p === HOME ? '~' : p.startsWith(HOME + '/') ? '~' + p.slice(HOME.length) : p
}

function resolve(cwd, arg) {
  if (!arg || arg === '~') return HOME
  let base = arg.startsWith('/') ? [] : cwd.split('/').filter(Boolean)
  if (arg.startsWith('~/')) {
    base = HOME.split('/').filter(Boolean)
    arg = arg.slice(2)
  }
  for (const part of arg.split('/').filter(Boolean)) {
    if (part === '..') base.pop()
    else if (part !== '.') base.push(part)
  }
  return '/' + base.join('/')
}

function longList(fs, dir, all) {
  const items = (all ? ['.', '..'] : []).concat(fs[dir])
  return items.map((n) => {
    const full = dir === '/' ? '/' + n : dir + '/' + n
    const isDir = n === '.' || n === '..' || fs[full] !== undefined
    return `${isDir ? 'drwxr-xr-x' : '-rw-r--r--'} 1 student student ${isDir ? '4096' : '   9'} Nov 19 09:30 ${n}`
  })
}

/** Run one command line. Returns { out: string[], cwd, fs, clear }. */
export function run(line, state) {
  const { cwd, fs, history } = state
  const words = line.trim().split(/\s+/).filter(Boolean)
  const [cmd, ...args] = words
  const opts = args.filter((a) => a.startsWith('-'))
  const rest = args.filter((a) => !a.startsWith('-'))
  const flags = opts.join('').replace(/-/g, '')
  const r = (out, extra = {}) => ({ out, cwd, fs, ...extra })
  if (!cmd) return r([])
  if (opts.includes('--help') && MAN[cmd]) return r([MAN[cmd]])
  switch (cmd) {
    case 'pwd':
      return r([cwd])
    case 'whoami':
      return r(['student'])
    case 'date':
      return r([new Date().toString().slice(0, 24)])
    case 'uname':
      return r([flags.includes('a') ? 'Linux laptop 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux' : 'Linux'])
    case 'echo':
      return r([
        args
          .join(' ')
          .replace(/\$(\w+)/g, (_, v) => ENV[v] ?? '')
          .replace(/^["']|["']$/g, ''),
      ])
    case 'history':
      return r(history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`))
    case 'clear':
      return r([], { clear: true })
    case 'help':
      return r(['Try: ' + COMMANDS.join(', ')])
    case 'man':
      return r([rest[0] ? (MAN[rest[0]] ?? `No manual entry for ${rest[0]}`) : 'What manual page do you want? Try: man ls'])
    case 'cd': {
      const to = resolve(cwd, rest[0])
      return fs[to] ? r([], { cwd: to }) : r([`cd: ${rest[0]}: No such file or directory`])
    }
    case 'ls': {
      const dir = resolve(cwd, rest[0] ?? '.')
      if (!fs[dir]) return r([`ls: cannot access '${rest[0]}': No such file or directory`])
      if (flags.includes('l')) return r(longList(fs, dir, flags.includes('a')))
      const items = (flags.includes('a') ? ['.', '..'] : []).concat(fs[dir])
      return r([items.length ? items.join('   ') : ''])
    }
    case 'mkdir': {
      if (!rest[0]) return r(['mkdir: missing operand. Try: mkdir projects'])
      const p = resolve(cwd, rest[0])
      if (fs[p]) return r([`mkdir: cannot create directory '${rest[0]}': File exists`])
      const parent = p.slice(0, p.lastIndexOf('/')) || '/'
      if (!fs[parent]) return r([`mkdir: cannot create directory '${rest[0]}': No such file or directory`])
      const next = { ...fs, [p]: [], [parent]: [...fs[parent], p.split('/').pop()] }
      return r([], { fs: next })
    }
    case 'cat': {
      if (!rest[0]) return r(['cat: missing file name. Try: cat notes.txt'])
      const p = resolve(cwd, rest[0])
      if (p === HOME + '/notes.txt') return r(['Buy milk'])
      if (p === '/proc/cpuinfo') return r(['processor : 0', 'model name : Virtual CPU', 'cpu cores : 4'])
      if (p === '/proc/uptime') return r(['5321.17 10233.46'])
      if (p === '/etc/hostname') return r(['laptop'])
      return r([fs[p] ? `cat: ${rest[0]}: Is a directory` : `cat: ${rest[0]}: No such file or directory`])
    }
    case 'sudo':
    case 'rm':
      return r([`${cmd} is switched off in this practice terminal. You’ll meet it carefully in a later lecture.`])
    default:
      return r([`${cmd}: command not found. Type help to see what works here.`])
  }
}

/** Complete the word being typed: a command name first, then a file or folder name. */
export function complete(line, state) {
  const words = line.split(' ')
  const last = words[words.length - 1]
  const pool = words.length === 1 ? COMMANDS : (state.fs[state.cwd] ?? [])
  const hits = pool.filter((c) => c.startsWith(last))
  if (hits.length !== 1) return line
  words[words.length - 1] = hits[0] + (words.length === 1 ? ' ' : '')
  return words.join(' ')
}
