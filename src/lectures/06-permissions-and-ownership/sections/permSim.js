/*
 * A small pretend Linux shell for Lecture 6 that really checks permissions.
 * Files: path → { dir, mode (number, e.g. 0o644), owner, group, text }.
 * Every command returns a new state object, so React state updates stay simple.
 */
export const HOME = '/home/student'

export const USERS = {
  root: { uid: 0, groups: ['root'] },
  student: { uid: 1000, groups: ['student', 'sudo', 'devs'] },
  demo: { uid: 1001, groups: ['demo', 'devs'] },
}
export const GROUP_IDS = { root: 0, sudo: 27, student: 1000, demo: 1001, devs: 1002 }

const f = (mode, owner, group, text = '') => ({ mode, owner, group, text })
const d = (mode, owner, group) => ({ dir: true, mode, owner, group })

export function makeFs() {
  return {
    '/': d(0o755, 'root', 'root'),
    '/etc': d(0o755, 'root', 'root'),
    '/etc/passwd': f(
      0o644,
      'root',
      'root',
      'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/student:/bin/bash\ndemo:x:1001:1001::/home/demo:/bin/sh',
    ),
    '/etc/shadow': f(0o640, 'root', 'root', 'root:$y$j9T$…:19700:0:99999:7:::'),
    '/etc/group': f(0o644, 'root', 'root', 'root:x:0:\nsudo:x:27:student\nstudent:x:1000:\ndemo:x:1001:\ndevs:x:1002:student,demo'),
    '/home': d(0o755, 'root', 'root'),
    '/home/demo': d(0o750, 'demo', 'demo'),
    '/home/demo/diary.txt': f(0o600, 'demo', 'demo', 'Dear diary…'),
    '/home/student': d(0o750, 'student', 'student'),
    '/home/student/.env': f(0o664, 'student', 'student', 'API_KEY=sk_live_42'),
    '/home/student/deploy.sh': f(0o664, 'student', 'student', 'echo "🚀 Deploying the website…"\necho "✅ Done!"'),
    '/home/student/notes.txt': f(0o664, 'student', 'student', 'Remember: never chmod 777'),
    '/home/student/report.txt': f(0o664, 'student', 'student', 'Q3 report'),
    '/home/student/site': d(0o775, 'student', 'student'),
    '/home/student/site/index.html': f(0o664, 'student', 'student', '<h1>Hello</h1>'),
    '/home/student/site/style.css': f(0o664, 'student', 'student', 'h1 { color: red }'),
    '/root': d(0o700, 'root', 'root'),
    '/root/secret.txt': f(0o600, 'root', 'root', 'only root can read me'),
    '/var': d(0o755, 'root', 'root'),
    '/var/www': d(0o755, 'root', 'root'),
  }
}

export const COMMANDS = [
  'cat',
  'cd',
  'chgrp',
  'chmod',
  'chown',
  'clear',
  'echo',
  'groups',
  'help',
  'id',
  'ls',
  'mkdir',
  'pwd',
  'rm',
  'sudo',
  'touch',
  'umask',
  'whoami',
]

/* ---------- Paths ---------- */

export const baseName = (p) => (p === '/' ? '/' : p.slice(p.lastIndexOf('/') + 1))
export const parentOf = (p) => (p === '/' ? '/' : p.slice(0, p.lastIndexOf('/')) || '/')
const join = (dir, n) => (dir === '/' ? '/' + n : dir + '/' + n)
export const shortPath = (p) => (p === HOME ? '~' : p.startsWith(HOME + '/') ? '~' + p.slice(HOME.length) : p)

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

export function children(fs, dir) {
  const pre = dir === '/' ? '/' : dir + '/'
  return Object.keys(fs)
    .filter((p) => p !== '/' && p.startsWith(pre) && !p.slice(pre.length).includes('/'))
    .map(baseName)
    .sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, '')))
}

/* ---------- Permission maths (also used by the widgets) ---------- */

const LETTERS = ['r', 'w', 'x']

/** 0o754 → "rwxr-xr--" */
export function modeToString(mode) {
  let s = ''
  for (let shift = 6; shift >= 0; shift -= 3) {
    const v = (mode >> shift) & 7
    s += (v & 4 ? 'r' : '-') + (v & 2 ? 'w' : '-') + (v & 1 ? 'x' : '-')
  }
  return s
}

/** "rwxr-xr--" → 0o754 (returns null if it isn't a valid 9-character string) */
export function stringToMode(s) {
  if (!/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(s)) return null
  let m = 0
  for (let i = 0; i < 9; i++) if (s[i] !== '-') m |= 1 << (8 - i)
  return m
}

export const octal = (mode) => (mode & 0o777).toString(8).padStart(3, '0')

/** Apply "u+x", "g-w,o=r", "a+r", "+x" or "755" to a mode. Returns null if invalid. */
export function applyChmod(mode, spec) {
  if (/^[0-7]{3,4}$/.test(spec)) return parseInt(spec.slice(-3), 8)
  let m = mode
  for (const part of spec.split(',')) {
    const mm = part.match(/^([ugoa]*)([+\-=])([rwx]*)$/)
    if (!mm) return null
    const who = mm[1] === '' || mm[1].includes('a') ? 'ugo' : mm[1]
    let bits = 0
    for (const c of mm[3]) bits |= { r: 4, w: 2, x: 1 }[c]
    for (const w of who) {
      const shift = { u: 6, g: 3, o: 0 }[w]
      if (mm[2] === '+') m |= bits << shift
      else if (mm[2] === '-') m &= ~(bits << shift)
      else m = (m & ~(7 << shift)) | (bits << shift)
    }
  }
  return m & 0o777
}

/** Which class applies to this user for this file: 'u', 'g' or 'o' (Linux checks in that order). */
export function classFor(node, user) {
  if (node.owner === user) return 'u'
  if (USERS[user]?.groups.includes(node.group)) return 'g'
  return 'o'
}

/** Can `user` do `what` ('r' | 'w' | 'x') to this node? root can do almost anything. */
export function can(node, user, what) {
  if (user === 'root') return what !== 'x' || node.dir || (node.mode & 0o111) !== 0
  const shift = { u: 6, g: 3, o: 0 }[classFor(node, user)]
  const bit = { r: 4, w: 2, x: 1 }[what]
  return ((node.mode >> shift) & bit) !== 0
}

export { LETTERS }

/* ---------- The shell ---------- */

function tokenize(line) {
  const out = []
  const re = /"([^"]*)"|'([^']*)'|(>>|>)|(\S+)/g
  let m
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3] ?? m[4])
  return out
}

const pad = (s, n) => String(s).padEnd(n)
const padL = (s, n) => String(s).padStart(n)

function lsLine(fs, p, name) {
  const n = fs[p]
  const size = n.dir ? 4096 : new TextEncoder().encode(n.text ?? '').length
  return `${n.dir ? 'd' : '-'}${modeToString(n.mode)} ${n.dir ? 2 : 1} ${pad(n.owner, 7)} ${pad(n.group, 7)} ${padL(size, 4)} Nov 19 10:00 ${name}`
}

const HELP = [
  'Commands you can try here:',
  '  ls -l [file]        show permissions, owner and group',
  '  chmod u+x file      change permissions (letters or numbers: chmod 755 file)',
  '  ./deploy.sh         run a script (needs x)',
  '  cat / echo "hi" >> file / touch / mkdir / rm',
  '  whoami · id · groups · umask [value] · pwd · cd',
  '  sudo chown demo file · sudo chgrp devs file   (-R for folders)',
  '  sudo <command>      run one command as root',
  '  clear (or Ctrl + L)',
]

/**
 * Run one command line. state = { cwd, fs, user, umask }.
 * Returns { out: [{ t, k }], cwd, fs, umask, clear }.
 * k = 'out' | 'err' | 'dim'
 */
export function run(line, state) {
  let { cwd, fs, umask } = state
  let user = state.user ?? 'student'
  const out = []
  const say = (t, k = 'out') => out.push({ t, k })
  const err = (t) => say(t, 'err')
  let words = tokenize(line.trim())
  if (!words.length) return { out, cwd, fs, umask }

  if (words[0] === 'sudo') {
    words = words.slice(1)
    if (!words.length) {
      err('usage: sudo <command>')
      return { out, cwd, fs, umask }
    }
    say('[sudo] password for student: ••••••', 'dim')
    user = 'root'
  }

  const [cmd, ...rest] = words
  const flags = rest.filter((w) => /^-[a-zA-Z]+$/.test(w)).join('')
  const args = rest.filter((w) => !/^-[a-zA-Z]+$/.test(w))
  const P = (a) => resolve(cwd, a)
  const denied = (what) => err(`${cmd}: ${what}: Permission denied`)

  // Can the user reach a path? Needs x on every folder on the way.
  const reach = (p) => {
    let cur = '/'
    for (const part of p.split('/').filter(Boolean).slice(0, -1)) {
      cur = join(cur, part)
      if (fs[cur]?.dir && !can(fs[cur], user, 'x')) return false
    }
    return true
  }
  const writeFile = (p, text, append) => {
    const parent = parentOf(p)
    if (!fs[parent]?.dir) return err(`bash: ${args[0] ?? p}: No such file or directory`)
    if (!reach(p)) return err(`bash: ${shortPath(p)}: Permission denied`)
    if (fs[p]) {
      if (fs[p].dir) return err(`bash: ${shortPath(p)}: Is a directory`)
      if (!can(fs[p], user, 'w')) return err(`bash: ${shortPath(p)}: Permission denied`)
      fs = { ...fs, [p]: { ...fs[p], text: append && fs[p].text ? fs[p].text + '\n' + text : text } }
    } else {
      if (!can(fs[parent], user, 'w')) return err(`bash: ${shortPath(p)}: Permission denied`)
      fs = { ...fs, [p]: f(0o666 & ~parseInt(umask, 8), user, USERS[user].groups[0], text) }
    }
  }

  // ./script.sh or bash script.sh
  if (cmd.startsWith('./') || cmd === 'bash') {
    const target = cmd === 'bash' ? args[0] : cmd
    const p = P(target)
    const n = fs[p]
    if (!n) err(`bash: ${target}: No such file or directory`)
    else if (n.dir) err(`bash: ${target}: Is a directory`)
    else if (!reach(p) || !can(n, user, 'r')) err(`bash: ${target}: Permission denied`)
    else if (cmd !== 'bash' && !can(n, user, 'x')) err(`bash: ${target}: Permission denied`)
    else for (const l of (n.text ?? '').split('\n')) say(l.replace(/^echo\s+"?|"$/g, ''))
    return { out, cwd, fs, umask }
  }

  switch (cmd) {
    case 'help':
      HELP.forEach((h) => say(h, 'dim'))
      break
    case 'clear':
      return { out: [], cwd, fs, umask, clear: true }
    case 'pwd':
      say(cwd)
      break
    case 'whoami':
      say(user)
      break
    case 'id': {
      const u = args[0] ?? user
      if (!USERS[u]) {
        err(`id: '${u}': no such user`)
        break
      }
      const gs = USERS[u].groups
      say(`uid=${USERS[u].uid}(${u}) gid=${GROUP_IDS[gs[0]]}(${gs[0]}) groups=${gs.map((g) => `${GROUP_IDS[g]}(${g})`).join(',')}`)
      break
    }
    case 'groups': {
      const u = args[0] ?? user
      if (!USERS[u]) err(`groups: '${u}': no such user`)
      else say((args[0] ? `${u} : ` : '') + USERS[u].groups.join(' '))
      break
    }
    case 'umask':
      if (!args[0]) say(umask)
      else if (/^0?[0-7]{3}$/.test(args[0])) umask = args[0].padStart(4, '0')
      else err(`umask: ${args[0]}: octal number out of range`)
      break
    case 'cd': {
      const p = P(args[0])
      if (!fs[p]) err(`cd: ${args[0]}: No such file or directory`)
      else if (!fs[p].dir) err(`cd: ${args[0]}: Not a directory`)
      else if (!reach(p) || !can(fs[p], user, 'x')) err(`bash: cd: ${args[0]}: Permission denied`)
      else cwd = p
      break
    }
    case 'ls': {
      const long = flags.includes('l')
      const all = flags.includes('a')
      const targets = args.length ? args : ['.']
      for (const a of targets) {
        const p = P(a)
        const n = fs[p]
        if (!n) {
          err(`ls: cannot access '${a}': No such file or directory`)
          continue
        }
        if (!n.dir || flags.includes('d')) {
          say(long ? lsLine(fs, p, a) : a)
          continue
        }
        if (!reach(p) || !can(n, user, 'r')) {
          err(`ls: cannot open directory '${a}': Permission denied`)
          continue
        }
        const names = children(fs, p).filter((c) => all || !c.startsWith('.'))
        if (long) {
          say(`total ${names.length * 4}`, 'dim')
          names.forEach((c) => say(lsLine(fs, join(p, c), c)))
        } else if (names.length) say(names.join('  '))
      }
      break
    }
    case 'cat':
      if (!args.length) err('cat: missing file name (try cat notes.txt)')
      for (const a of args) {
        const p = P(a)
        const n = fs[p]
        if (!n) err(`cat: ${a}: No such file or directory`)
        else if (n.dir) err(`cat: ${a}: Is a directory`)
        else if (!reach(p) || !can(n, user, 'r')) denied(a)
        else (n.text || '').split('\n').forEach((l) => say(l))
      }
      break
    case 'echo': {
      const i = words.findIndex((w) => w === '>' || w === '>>')
      if (i === -1) say(words.slice(1).join(' '))
      else if (!words[i + 1]) err("bash: syntax error near unexpected token `newline'")
      else writeFile(P(words[i + 1]), words.slice(1, i).join(' '), words[i] === '>>')
      break
    }
    case 'touch':
      if (!args.length) err('touch: missing file operand')
      for (const a of args) if (!fs[P(a)]) writeFile(P(a), '', false)
      break
    case 'mkdir':
      if (!args.length) err('mkdir: missing operand')
      for (const a of args) {
        const p = P(a)
        const parent = parentOf(p)
        if (fs[p]) err(`mkdir: cannot create directory '${a}': File exists`)
        else if (!fs[parent]?.dir) err(`mkdir: cannot create directory '${a}': No such file or directory`)
        else if (!reach(p) || !can(fs[parent], user, 'w')) err(`mkdir: cannot create directory '${a}': Permission denied`)
        else fs = { ...fs, [p]: d(0o777 & ~parseInt(umask, 8), user, USERS[user].groups[0]) }
      }
      break
    case 'rm':
      if (!args.length) err('rm: missing operand')
      for (const a of args) {
        const p = P(a)
        const n = fs[p]
        if (!n) err(`rm: cannot remove '${a}': No such file or directory`)
        else if (n.dir && !flags.includes('r')) err(`rm: cannot remove '${a}': Is a directory`)
        // Deleting needs w on the folder, not on the file!
        else if (!reach(p) || !can(fs[parentOf(p)], user, 'w')) err(`rm: cannot remove '${a}': Permission denied`)
        else {
          fs = Object.fromEntries(Object.entries(fs).filter(([k]) => k !== p && !k.startsWith(p + '/')))
        }
      }
      break
    case 'chmod': {
      const [spec, ...files] = args
      if (!spec || !files.length) {
        err('chmod: missing operand (try chmod u+x deploy.sh)')
        break
      }
      for (const a of files) {
        const p = P(a)
        const n = fs[p]
        if (!n) {
          err(`chmod: cannot access '${a}': No such file or directory`)
          continue
        }
        if (user !== 'root' && n.owner !== user) {
          err(`chmod: changing permissions of '${a}': Operation not permitted`)
          continue
        }
        const m = applyChmod(n.mode, spec)
        if (m === null) {
          err(`chmod: invalid mode: '${spec}'`)
          break
        }
        const targets = flags.includes('R') && n.dir ? Object.keys(fs).filter((k) => k === p || k.startsWith(p + '/')) : [p]
        fs = { ...fs }
        for (const t of targets) fs[t] = { ...fs[t], mode: applyChmod(fs[t].mode, spec) }
      }
      break
    }
    case 'chown':
    case 'chgrp': {
      const [spec, ...files] = args
      if (!spec || !files.length) {
        err(`${cmd}: missing operand (try sudo ${cmd} ${cmd === 'chown' ? 'demo' : 'devs'} report.txt)`)
        break
      }
      let owner = null
      let group = null
      if (cmd === 'chgrp') group = spec
      else if (spec.includes(':')) [owner, group] = spec.split(':').map((s) => s || null)
      else owner = spec
      if (owner && !USERS[owner]) {
        err(`chown: invalid user: '${spec}'`)
        break
      }
      if (group && !(group in GROUP_IDS)) {
        err(`${cmd}: invalid group: '${spec}'`)
        break
      }
      for (const a of files) {
        const p = P(a)
        const n = fs[p]
        if (!n) {
          err(`${cmd}: cannot access '${a}': No such file or directory`)
          continue
        }
        const mayGroup = user === 'root' || (n.owner === user && USERS[user].groups.includes(group))
        if ((owner && user !== 'root') || (group && !mayGroup)) {
          err(`${cmd}: changing ${owner ? 'ownership' : 'group'} of '${a}': Operation not permitted`)
          if (user !== 'root') say('Hint: changing the owner needs sudo.', 'dim')
          continue
        }
        const targets = flags.includes('R') && n.dir ? Object.keys(fs).filter((k) => k === p || k.startsWith(p + '/')) : [p]
        fs = { ...fs }
        for (const t of targets) fs[t] = { ...fs[t], ...(owner ? { owner } : {}), ...(group ? { group } : {}) }
      }
      break
    }
    case 'useradd':
    case 'usermod':
    case 'groupadd':
    case 'userdel':
      say(`${cmd} works on a real Linux machine (try it in WSL with sudo). This practice terminal keeps its users fixed.`, 'dim')
      break
    default:
      err(`${cmd}: command not found (type help)`)
  }
  return { out, cwd, fs, umask }
}

/** Tab completion for the last word (commands first, then file names). */
export function complete(input, st) {
  const words = input.split(' ')
  const last = words[words.length - 1]
  if (words.length === 1 && !last.startsWith('./')) {
    const hit = COMMANDS.filter((c) => c.startsWith(last))
    return hit.length === 1 ? hit[0] + ' ' : input
  }
  const raw = last.startsWith('./') ? last.slice(2) : last
  const slash = raw.lastIndexOf('/')
  const dirPart = slash >= 0 ? raw.slice(0, slash + 1) : ''
  const base = raw.slice(slash + 1)
  const dir = resolve(st.cwd, dirPart || '.')
  const hits = children(st.fs, dir).filter((n) => n.startsWith(base) && (base.startsWith('.') || !n.startsWith('.')))
  if (hits.length !== 1) return input
  const full = join(dir, hits[0])
  words[words.length - 1] = (last.startsWith('./') ? './' : '') + dirPart + hits[0] + (st.fs[full]?.dir ? '/' : '')
  return words.join(' ')
}
