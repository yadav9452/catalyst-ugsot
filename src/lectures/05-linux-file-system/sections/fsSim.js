/*
 * A small pretend Linux file system and shell for Lecture 5.
 * The file system is a plain object: path → { dir: true } or { text: '...' }.
 * Every command returns a new object, so React state updates stay simple.
 */
export const HOME = '/home/student'

const dir = { dir: true }
const file = (text = '') => ({ text })

export function makeFs() {
  return {
    '/': dir,
    '/bin': dir,
    '/bin/ls': file('(program)'),
    '/bin/cp': file('(program)'),
    '/bin/mv': file('(program)'),
    '/dev': dir,
    '/dev/null': file(''),
    '/dev/sda': file('(disk)'),
    '/etc': dir,
    '/etc/hostname': file('laptop'),
    '/etc/hosts': file('127.0.0.1   localhost'),
    '/etc/passwd': file('root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/student:/bin/bash'),
    '/home': dir,
    '/home/student': dir,
    '/home/student/.bashrc': file('# shell settings\nalias ll="ls -la"'),
    '/home/student/notes.txt': file('Buy milk'),
    '/home/student/projects': dir,
    '/proc': dir,
    '/proc/cpuinfo': file('processor : 0\nmodel name : Virtual CPU\ncpu cores : 4'),
    '/proc/uptime': file('5321.17 10233.46'),
    '/root': dir,
    '/tmp': dir,
    '/usr': dir,
    '/usr/bin': dir,
    '/usr/bin/git': file('(program)'),
    '/usr/bin/node': file('(program)'),
    '/usr/local': dir,
    '/usr/local/bin': dir,
    '/var': dir,
    '/var/log': dir,
    '/var/log/auth.log': file('Nov 19 09:12 laptop sshd: Accepted password for student'),
    '/var/log/syslog': file('Nov 19 09:10 laptop systemd: Started Daily apt download.\nNov 19 09:12 laptop kernel: usb 1-1: new device'),
    '/var/log/nginx': dir,
    '/var/log/nginx/access.log': file('GET /index.html 200'),
    '/var/tmp': dir,
  }
}

export const COMMANDS = ['cat', 'cd', 'clear', 'cp', 'echo', 'help', 'history', 'ls', 'mkdir', 'mv', 'pwd', 'rm', 'rmdir', 'touch', 'tree']

export const isDir = (fs, p) => !!fs[p]?.dir
export const exists = (fs, p) => p in fs
export const baseName = (p) => (p === '/' ? '/' : p.slice(p.lastIndexOf('/') + 1))
export const parentOf = (p) => (p === '/' ? '/' : p.slice(0, p.lastIndexOf('/')) || '/')
const join = (d, n) => (d === '/' ? '/' + n : d + '/' + n)

export function children(fs, d) {
  const pre = d === '/' ? '/' : d + '/'
  return Object.keys(fs)
    .filter((p) => p !== '/' && p.startsWith(pre) && !p.slice(pre.length).includes('/'))
    .map(baseName)
    .sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, '')))
}

export function shortPath(p) {
  return p === HOME ? '~' : p.startsWith(HOME + '/') ? '~' + p.slice(HOME.length) : p
}

/** Turn any path the user types into a full path from /. */
export function resolve(cwd, arg) {
  if (arg === undefined || arg === '' || arg === '~') return HOME
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

/** Convert a wildcard pattern (*, ?, [abc], [a-z], [!x]) to a regular expression. */
export function globToRegex(pattern) {
  let re = ''
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i]
    if (c === '*') re += '[^/]*'
    else if (c === '?') re += '[^/]'
    else if (c === '[') {
      const end = pattern.indexOf(']', i + 1)
      if (end === -1) {
        re += '\\['
        continue
      }
      let set = pattern.slice(i + 1, end).replace(/\\/g, '\\\\')
      if (set.startsWith('!')) set = '^' + set.slice(1)
      re += `[${set}]`
      i = end
    } else re += c.replace(/[.+^${}()|\\]/g, '\\$&')
  }
  return new RegExp(`^${re}$`)
}

export const hasWildcard = (s) => /[*?[]/.test(s)

/** Expand {a,b,c} the way bash does: x/{a,b} → x/a x/b. */
export function expandBraces(word) {
  const m = word.match(/^(.*?)\{([^{}]*,[^{}]*)\}(.*)$/)
  if (!m) return [word]
  return m[2].split(',').flatMap((part) => expandBraces(m[1] + part + m[3]))
}

function expandGlob(fs, cwd, word) {
  if (!hasWildcard(word)) return [word]
  const slash = word.lastIndexOf('/')
  const dirPart = slash >= 0 ? word.slice(0, slash + 1) : ''
  const pat = word.slice(slash + 1)
  const d = resolve(cwd, dirPart || '.')
  if (!isDir(fs, d)) return [word]
  const re = globToRegex(pat)
  const hits = children(fs, d).filter((n) => re.test(n) && (pat.startsWith('.') || !n.startsWith('.')))
  return hits.length ? hits.map((n) => dirPart + n) : [word]
}

/** Split a command line into words, keeping "quoted text" together. Handles > and >>. */
function tokenize(line) {
  const out = []
  const re = /"([^"]*)"|'([^']*)'|(>>|>)|(\S+)/g
  let m
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3] ?? m[4])
  return out
}

function stamp() {
  const d = new Date()
  return `Nov 19 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function longLine(fs, p, name) {
  const node = fs[p]
  const size = node?.dir ? 4096 : (node?.text ?? '').length
  return `${node?.dir ? 'drwxr-xr-x' : '-rw-r--r--'} 1 student student ${String(size).padStart(5)} ${node?.time ?? 'Nov 19 09:30'} ${name}`
}

function copyTree(fs, from, to) {
  const next = { ...fs }
  for (const p of Object.keys(fs)) {
    if (p === from || p.startsWith(from + '/')) next[to + p.slice(from.length)] = { ...fs[p], time: stamp() }
  }
  return next
}

function removeTree(fs, target) {
  const next = {}
  for (const [p, v] of Object.entries(fs)) if (p !== target && !p.startsWith(target + '/')) next[p] = v
  return next
}

const HELP = [
  'Commands that work here:',
  '  pwd  cd  ls [-l -a -R]  tree  cat  touch  echo "text" > file  echo "text" >> file',
  '  mkdir [-p]  rmdir  cp [-r]  mv  rm [-r]  history  clear',
  'Wildcards (*, ?, [0-9]) and braces {a,b} work too.',
]

/**
 * Run one command line. state = { cwd, fs, prev, history }.
 * Returns { out: [{t, k}], cwd, fs, prev, clear }. k = 'out' | 'err' | 'dim'.
 */
export function run(line, state) {
  const { fs, cwd } = state
  const o = (t) => ({ t, k: 'out' })
  const e = (t) => ({ t, k: 'err' })
  const res = (out, extra = {}) => ({ out, cwd, fs, prev: state.prev, ...extra })

  let words = tokenize(line.trim())
  if (!words.length) return res([])
  // Output redirection: echo hi > file
  let redirect = null
  const ri = words.findIndex((w) => w === '>' || w === '>>')
  if (ri >= 0) {
    redirect = { op: words[ri], target: words[ri + 1] }
    words = words.slice(0, ri)
  }
  const [cmd, ...raw] = words
  const expanded = raw.flatMap(expandBraces).flatMap((w) => (w.startsWith('-') ? [w] : expandGlob(fs, cwd, w)))
  const flags = expanded
    .filter((a) => /^-[a-zA-Z]+$/.test(a))
    .join('')
    .replace(/-/g, '')
  const args = expanded.filter((a) => !/^-[a-zA-Z]+$/.test(a))

  // Commands whose output can be redirected into a file.
  if (redirect) {
    if (!redirect.target) return res([e('bash: syntax error: put a file name after ' + redirect.op)])
    let text
    if (cmd === 'echo') text = args.join(' ')
    else if (cmd === 'cat' && args.length === 0)
      return res([e('Typing into cat > file needs Ctrl + D, which this practice terminal skips. Use: echo "text" > file')])
    else return res([e(`Redirecting ${cmd} is not supported here. Try: echo "text" > file`)])
    const p = resolve(cwd, redirect.target)
    if (isDir(fs, p)) return res([e(`bash: ${redirect.target}: Is a directory`)])
    if (!isDir(fs, parentOf(p))) return res([e(`bash: ${redirect.target}: No such file or directory`)])
    const old = fs[p]?.text
    const body = redirect.op === '>>' && old ? old + '\n' + text : text
    return res([], { fs: { ...fs, [p]: { text: body, time: stamp() } } })
  }

  switch (cmd) {
    case 'pwd':
      return res([o(cwd)])
    case 'clear':
      return res([], { clear: true })
    case 'help':
      return res(HELP.map((t) => ({ t, k: 'dim' })))
    case 'history':
      return res((state.history ?? []).map((h, i) => o(`${String(i + 1).padStart(4)}  ${h}`)))
    case 'whoami':
      return res([o('student')])
    case 'echo':
      return res([o(args.join(' '))])
    case 'cd': {
      if (args[0] === '-') return res([o(state.prev ?? cwd)], { cwd: state.prev ?? cwd, prev: cwd })
      const to = resolve(cwd, args[0])
      if (to === '/root') return res([e('bash: cd: /root: Permission denied (only the root user may enter)')])
      if (!exists(fs, to)) return res([e(`bash: cd: ${args[0]}: No such file or directory`)])
      if (!isDir(fs, to)) return res([e(`bash: cd: ${args[0]}: Not a directory`)])
      return res([], { cwd: to, prev: cwd })
    }
    case 'ls': {
      const targets = args.length ? args : ['.']
      const out = []
      const listOne = (d, label) => {
        const names = children(fs, d).filter((n) => flags.includes('a') || !n.startsWith('.'))
        const all = flags.includes('a') ? ['.', '..', ...names] : names
        if (label) out.push(o(label + ':'))
        if (flags.includes('l')) {
          out.push({ t: `total ${all.length * 4}`, k: 'dim' })
          all.forEach((n) => out.push(o(longLine(fs, n === '.' ? d : n === '..' ? parentOf(d) : join(d, n), n))))
        } else if (all.length) out.push(o(all.map((n) => (isDir(fs, join(d, n)) && !/^\.\.?$/.test(n) ? n + '/' : n)).join('   ')))
        if (flags.includes('R'))
          names
            .filter((n) => isDir(fs, join(d, n)))
            .forEach((n) => {
              out.push(o(''))
              listOne(join(d, n), `${label || '.'}/${n}`)
            })
      }
      const plain = targets.filter((a) => exists(fs, resolve(cwd, a)) && !isDir(fs, resolve(cwd, a)))
      if (plain.length && !flags.includes('l')) out.push(o(plain.join('   ')))
      for (const a of targets) {
        const p = resolve(cwd, a)
        if (plain.includes(a) && !flags.includes('l')) continue
        if (p === '/root') {
          out.push(e(`ls: cannot open directory '${a}': Permission denied`))
          continue
        }
        if (!exists(fs, p)) out.push(e(`ls: cannot access '${a}': No such file or directory`))
        else if (!isDir(fs, p)) out.push(o(flags.includes('l') ? longLine(fs, p, a) : a))
        else listOne(p, flags.includes('R') ? (a === '.' ? '.' : a.replace(/\/$/, '')) : targets.length > 1 ? a : '')
      }
      return res(out)
    }
    case 'tree': {
      const start = resolve(cwd, args[0] ?? '.')
      if (!isDir(fs, start)) return res([e(`tree: ${args[0]}: not a folder`)])
      const out = [o(args[0] ?? '.')]
      const walk = (d, pad) => {
        const names = children(fs, d).filter((n) => !n.startsWith('.'))
        names.forEach((n, i) => {
          const last = i === names.length - 1
          const p = join(d, n)
          out.push(o(`${pad}${last ? '└── ' : '├── '}${n}${isDir(fs, p) ? '/' : ''}`))
          if (isDir(fs, p)) walk(p, pad + (last ? '    ' : '│   '))
        })
      }
      walk(start, '')
      return res(out)
    }
    case 'cat': {
      if (!args.length) return res([e('cat: give it a file name, e.g. cat notes.txt')])
      const out = []
      for (const a of args) {
        const p = resolve(cwd, a)
        if (!exists(fs, p)) out.push(e(`cat: ${a}: No such file or directory`))
        else if (isDir(fs, p)) out.push(e(`cat: ${a}: Is a directory`))
        else if (fs[p].text) fs[p].text.split('\n').forEach((t) => out.push(o(t)))
      }
      return res(out)
    }
    case 'touch': {
      if (!args.length) return res([e('touch: missing file operand. Try: touch app.log')])
      let next = fs
      const out = []
      for (const a of args) {
        const p = resolve(cwd, a)
        if (!isDir(next, parentOf(p))) out.push(e(`touch: cannot touch '${a}': No such file or directory`))
        else next = { ...next, [p]: { ...(next[p] ?? { text: '' }), time: stamp() } }
      }
      return res(out, { fs: next })
    }
    case 'mkdir': {
      if (!args.length) return res([e('mkdir: missing operand. Try: mkdir projects')])
      let next = fs
      const out = []
      for (const a of args) {
        const p = resolve(cwd, a)
        if (exists(next, p)) {
          if (!flags.includes('p')) out.push(e(`mkdir: cannot create directory '${a}': File exists`))
          continue
        }
        if (flags.includes('p')) {
          const parts = p.split('/').filter(Boolean)
          parts.forEach((_, i) => {
            const sub = '/' + parts.slice(0, i + 1).join('/')
            if (!exists(next, sub)) next = { ...next, [sub]: { dir: true, time: stamp() } }
          })
        } else if (!isDir(next, parentOf(p)))
          out.push(e(`mkdir: cannot create directory '${a}': No such file or directory (add -p to create parent folders too)`))
        else next = { ...next, [p]: { dir: true, time: stamp() } }
      }
      return res(out, { fs: next })
    }
    case 'rmdir': {
      if (!args.length) return res([e('rmdir: missing operand')])
      let next = fs
      const out = []
      for (const a of args) {
        let p = resolve(cwd, a)
        const stop = flags.includes('p') ? resolve(cwd, '.') : null
        do {
          if (!exists(next, p)) {
            out.push(e(`rmdir: failed to remove '${a}': No such file or directory`))
            break
          }
          if (!isDir(next, p)) {
            out.push(e(`rmdir: failed to remove '${a}': Not a directory`))
            break
          }
          if (children(next, p).length) {
            out.push(e(`rmdir: failed to remove '${shortPath(p)}': Directory not empty`))
            break
          }
          next = removeTree(next, p)
          if (flags.includes('v')) out.push(o(`rmdir: removing directory, '${shortPath(p)}'`))
          p = parentOf(p)
        } while (stop && p !== stop && p !== '/' && p.startsWith(stop))
      }
      return res(out, { fs: next })
    }
    case 'cp':
    case 'mv': {
      if (args.length < 2) return res([e(`${cmd}: missing destination. Try: ${cmd} notes.txt projects/`)])
      const dest = args[args.length - 1]
      const sources = args.slice(0, -1)
      const dp = resolve(cwd, dest)
      if (sources.length > 1 && !isDir(fs, dp)) return res([e(`${cmd}: target '${dest}' is not a directory`)])
      let next = fs
      const out = []
      for (const s of sources) {
        const sp = resolve(cwd, s)
        if (!exists(next, sp)) {
          out.push(e(`${cmd}: cannot stat '${s}': No such file or directory`))
          continue
        }
        if (cmd === 'cp' && isDir(next, sp) && !/[rR]/.test(flags)) {
          out.push(e(`cp: -r not specified; omitting directory '${s}'`))
          continue
        }
        const target = isDir(next, dp) ? join(dp, baseName(sp)) : dp
        if (target === sp || target.startsWith(sp + '/')) {
          out.push(e(`${cmd}: cannot ${cmd === 'cp' ? 'copy' : 'move'} '${s}' into itself`))
          continue
        }
        if (!isDir(next, parentOf(target))) {
          out.push(e(`${cmd}: cannot create '${dest}': No such file or directory`))
          continue
        }
        if (exists(next, target)) {
          if (flags.includes('n')) continue
          if (flags.includes('i')) {
            out.push({ t: `${cmd}: overwrite '${shortPath(target)}'? n   (this practice terminal always answers n)`, k: 'dim' })
            continue
          }
          next = removeTree(next, target)
        }
        next = copyTree(next, sp, target)
        if (cmd === 'mv') next = removeTree(next, sp)
      }
      return res(out, { fs: next })
    }
    case 'rm': {
      if (!args.length) return res([e('rm: missing operand')])
      let next = fs
      const out = []
      for (const a of args) {
        const p = resolve(cwd, a)
        if (p === '/' || p === HOME || p === '/home') {
          out.push(e(`rm: refusing to remove '${a}' in this practice terminal. On a real machine this would be a disaster!`))
          continue
        }
        if (!exists(next, p)) {
          if (!flags.includes('f')) out.push(e(`rm: cannot remove '${a}': No such file or directory`))
          continue
        }
        if (isDir(next, p) && !/[rR]/.test(flags)) {
          out.push(e(`rm: cannot remove '${a}': Is a directory (use rm -r, or rmdir if it is empty)`))
          continue
        }
        if (flags.includes('i')) {
          out.push({ t: `rm: remove '${a}'? n   (this practice terminal always answers n)`, k: 'dim' })
          continue
        }
        next = removeTree(next, p)
      }
      return res(out, { fs: next })
    }
    case 'nano':
    case 'vim':
    case 'vi':
      return res([e(`${cmd} opens a full-screen editor. Try it in your real terminal, or in the editor trainer above.`)])
    case 'sudo':
      return res([e('sudo is switched off here. You’ll meet it in the permissions lecture.')])
    default:
      return res([e(`${cmd}: command not found. Type help to see what works here.`)])
  }
}

/** Tab completion: command names first, then file and folder names. */
export function complete(line, state) {
  const words = line.split(' ')
  const last = words[words.length - 1]
  if (words.length === 1) {
    const hits = COMMANDS.filter((c) => c.startsWith(last))
    return hits.length === 1 ? hits[0] + ' ' : line
  }
  const slash = last.lastIndexOf('/')
  const dirPart = slash >= 0 ? last.slice(0, slash + 1) : ''
  const d = resolve(state.cwd, dirPart || '.')
  if (!isDir(state.fs, d)) return line
  const hits = children(state.fs, d).filter((n) => n.startsWith(last.slice(slash + 1)))
  if (hits.length !== 1) return line
  const full = dirPart + hits[0]
  words[words.length - 1] = full + (isDir(state.fs, join(d, hits[0])) ? '/' : ' ')
  return words.join(' ')
}
