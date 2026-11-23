/*
 * A small pretend Ubuntu shell for Lecture 7 that behaves like apt.
 * It knows a handful of real packages, their dependencies and versions, and
 * keeps track of what is installed, so students see the same messages they
 * will see on their own laptop or on a server.
 *
 * State: { pkgs, rc, fresh, sudoAsked }
 *   pkgs  = installed packages: name → { v, auto } (auto = pulled in as a dependency)
 *   rc    = removed packages whose config files are still on disk: name → true
 *   fresh = has `apt update` been run? Until then apt doesn't know what's in the repository.
 * run(line, state) returns { state, out: [{ t, k }], clear }.
 */
export const HOME = '/home/student'

const ARCHIVE = 'http://archive.ubuntu.com/ubuntu'

// What the pretend repository offers. size = download (kB), inst = disk space (kB).
export const REPO = {
  tree: { v: '2.1.1-2ubuntu3', sec: 'universe/utils', size: 47, inst: 115, deps: [], desc: 'displays an indented directory tree, in colour', bin: '/usr/bin/tree' },
  cowsay: { v: '3.03+dfsg2-8', sec: 'universe/games', size: 18, inst: 93, deps: ['libtext-charwidth-perl'], desc: 'configurable talking cow', bin: '/usr/games/cowsay' },
  'libtext-charwidth-perl': { v: '0.04-11build3', sec: 'main/perl', size: 9, inst: 37, deps: [], desc: 'get display widths of characters on the terminal' },
  git: { v: '1:2.43.0-1ubuntu7.1', sec: 'main/vcs', size: 3680, inst: 18900, deps: ['git-man', 'liberror-perl'], desc: 'fast, scalable, distributed revision control system', bin: '/usr/bin/git' },
  'git-man': { v: '1:2.43.0-1ubuntu7.1', sec: 'main/doc', size: 1100, inst: 2400, deps: [], desc: 'fast, scalable, distributed revision control system (manual pages)' },
  'liberror-perl': { v: '0.17029-2', sec: 'main/perl', size: 25, inst: 80, deps: [], desc: 'Perl module for error/exception handling in an OO-ish way' },
  nginx: { v: '1.24.0-2ubuntu7.1', sec: 'main/httpd', size: 521, inst: 1400, deps: ['nginx-common'], desc: 'small, powerful, scalable web/proxy server', bin: '/usr/sbin/nginx', conf: '/etc/nginx' },
  'nginx-common': { v: '1.24.0-2ubuntu7.1', sec: 'main/httpd', size: 43, inst: 220, deps: [], desc: 'small, powerful, scalable web/proxy server - common files' },
  nodejs: { v: '18.19.1+dfsg-6ubuntu5', sec: 'universe/javascript', size: 306, inst: 812, deps: ['libnode109'], desc: 'evented I/O for V8 javascript - runtime executable', bin: '/usr/bin/node' },
  libnode109: { v: '18.19.1+dfsg-6ubuntu5', sec: 'universe/libs', size: 11600, inst: 46300, deps: [], desc: 'evented I/O for V8 javascript - runtime library' },
  htop: { v: '3.3.0-4build1', sec: 'main/utils', size: 171, inst: 434, deps: ['libnl-3-200'], desc: 'interactive processes viewer', bin: '/usr/bin/htop' },
  'libnl-3-200': { v: '3.7.0-0.3build1', sec: 'main/libs', size: 55, inst: 191, deps: [], desc: 'library for dealing with netlink sockets' },
  vlc: { v: '3.0.20-3build6', sec: 'universe/video', size: 17, inst: 98, deps: ['vlc-bin', 'vlc-plugin-base', 'libvlc5', 'libvlccore9'], desc: 'multimedia player and streamer', bin: '/usr/bin/vlc' },
  'vlc-bin': { v: '3.0.20-3build6', sec: 'universe/video', size: 27, inst: 160, deps: [], desc: 'binaries from VLC' },
  'vlc-plugin-base': { v: '3.0.20-3build6', sec: 'universe/video', size: 3500, inst: 15300, deps: [], desc: 'multimedia player and streamer (base plugins)' },
  libvlc5: { v: '3.0.20-3build6', sec: 'universe/libs', size: 78, inst: 231, deps: [], desc: 'multimedia player and streamer library' },
  libvlccore9: { v: '3.0.20-3build6', sec: 'universe/libs', size: 1500, inst: 4300, deps: [], desc: 'base library for VLC and its modules' },
  curl: { v: '8.5.0-2ubuntu10.6', sec: 'main/web', size: 227, inst: 534, deps: ['libssl3t64'], desc: 'command line tool for transferring data with URL syntax', bin: '/usr/bin/curl' },
  openssl: { v: '3.0.13-0ubuntu3.5', sec: 'main/utils', size: 1003, inst: 2300, deps: ['libssl3t64'], desc: 'Secure Sockets Layer toolkit - cryptographic utility', bin: '/usr/bin/openssl' },
  libssl3t64: { v: '3.0.13-0ubuntu3.5', sec: 'main/libs', size: 1938, inst: 6300, deps: [], desc: 'Secure Sockets Layer toolkit - shared libraries' },
  python3: { v: '3.12.3-0ubuntu2', sec: 'main/python', size: 23, inst: 87, deps: [], desc: 'interactive high-level object-oriented language (default python3 version)', bin: '/usr/bin/python3' },
  'linux-generic': { v: '6.8.0-51.52', sec: 'main/kernel', size: 2, inst: 17, deps: ['linux-image-6.8.0-51-generic'], desc: 'Complete Generic Linux kernel and headers' },
  'linux-image-6.8.0-51-generic': { v: '6.8.0-51.52', sec: 'main/kernel', size: 14800, inst: 15200, deps: [], desc: 'Signed kernel image generic' },
}

// Programs students can type, and the package that provides each one.
const BINS = { tree: 'tree', cowsay: 'cowsay', git: 'git', nginx: 'nginx', node: 'nodejs', htop: 'htop', vlc: 'vlc', curl: 'curl', openssl: 'openssl', python3: 'python3' }

/** A fresh Ubuntu: a few things installed, some of them out of date, and apt update not run yet. */
export function freshState() {
  return {
    pkgs: {
      curl: { v: '8.5.0-2ubuntu10.1', auto: false },
      openssl: { v: '3.0.13-0ubuntu3.1', auto: false },
      libssl3t64: { v: '3.0.13-0ubuntu3.1', auto: true },
      python3: { v: '3.12.3-0ubuntu2', auto: false },
      'linux-generic': { v: '6.8.0-45.45', auto: false },
    },
    rc: {},
    fresh: false,
    sudoAsked: false,
  }
}

export const COMMANDS = ['apt', 'apt-get', 'clear', 'dpkg', 'echo', 'help', 'ls', 'pwd', 'sudo', 'which', 'whoami', ...Object.keys(BINS)]
export const APT_SUBS = ['update', 'upgrade', 'full-upgrade', 'install', 'remove', 'purge', 'autoremove', 'search', 'show', 'list']
const NEEDS_ROOT = new Set(['update', 'upgrade', 'full-upgrade', 'install', 'remove', 'purge', 'autoremove', 'dist-upgrade'])

/* ---------- Helpers ---------- */

const o = (t, k = 'out') => ({ t, k })
const kb = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)} MB` : `${n} kB`)
const wrapList = (names) => {
  const lines = []
  let cur = ' '
  for (const n of names) {
    if ((cur + ' ' + n).length > 70) {
      lines.push(cur)
      cur = ' '
    }
    cur += ' ' + n
  }
  lines.push(cur)
  return lines.map((t) => o(t))
}
const reading = () => [o('Reading package lists... Done'), o('Building dependency tree... Done'), o('Reading state information... Done')]

/** Packages apt can see: everything installed, plus the repository once `apt update` has run. */
export const known = (st, name) => (st.fresh || st.pkgs[name] ? REPO[name] : undefined)

/** Installed packages that have a newer version in the (known) repository. */
export function upgradable(st) {
  if (!st.fresh) return []
  return Object.keys(st.pkgs).filter((n) => REPO[n] && REPO[n].v !== st.pkgs[n].v)
}

/** Every dependency (and their dependencies) of `name` that isn't installed yet. */
function missingDeps(st, name, seen = new Set()) {
  for (const d of REPO[name]?.deps ?? []) {
    if (seen.has(d) || st.pkgs[d]) continue
    seen.add(d)
    missingDeps(st, d, seen)
  }
  return seen
}

/** Packages still needed: manual ones and everything they depend on. */
function needed(pkgs) {
  const keep = new Set()
  const visit = (n) => {
    if (keep.has(n) || !pkgs[n]) return
    keep.add(n)
    for (const d of REPO[n]?.deps ?? []) visit(d)
  }
  Object.keys(pkgs)
    .filter((n) => !pkgs[n].auto)
    .forEach(visit)
  return keep
}

export const orphans = (pkgs) => {
  const keep = needed(pkgs)
  return Object.keys(pkgs).filter((n) => !keep.has(n))
}

const summary = (up, inst, rem, notUp) => o(`${up} upgraded, ${inst} newly installed, ${rem} to remove and ${notUp} not upgraded.`)

function orphanNote(pkgs) {
  const left = orphans(pkgs).sort()
  if (!left.length) return []
  return [
    o(`The following package${left.length > 1 ? 's were' : ' was'} automatically installed and ${left.length > 1 ? 'are' : 'is'} no longer required:`),
    ...wrapList(left),
    o(`Use 'sudo apt autoremove' to remove ${left.length > 1 ? 'them' : 'it'}.`),
  ]
}

/* ---------- apt actions ---------- */

function aptUpdate(st) {
  const next = { ...st, fresh: true }
  const n = upgradable(next).length
  return {
    state: next,
    out: [
      o(`Hit:1 ${ARCHIVE} noble InRelease`),
      o(`Get:2 ${ARCHIVE} noble-updates InRelease [126 kB]`),
      o('Get:3 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]'),
      o(`Get:4 ${ARCHIVE} noble-updates/main amd64 Packages [1,045 kB]`),
      o('Fetched 1,297 kB in 2s (648 kB/s)'),
      ...reading(),
      o(n ? `${n} package${n > 1 ? 's' : ''} can be upgraded. Run 'apt list --upgradable' to see them.` : 'All packages are up to date.', 'ok'),
    ],
  }
}

function aptInstall(st, names) {
  if (!names.length) return { state: st, out: [...reading(), summary(0, 0, 0, upgradable(st).length)] }
  const out = reading()
  const missing = names.filter((n) => !known(st, n))
  if (missing.length) {
    out.push(o(`E: Unable to locate package ${missing[0]}`, 'err'))
    if (!st.fresh) out.push(o('(Tip from the simulator: apt doesn’t know any packages yet. Run sudo apt update first.)', 'dim'))
    return { state: st, out }
  }
  const pkgs = { ...st.pkgs }
  const fresh = []
  const upgrades = []
  for (const n of names) {
    if (pkgs[n] && pkgs[n].v === REPO[n].v) {
      out.push(o(`${n} is already the newest version (${pkgs[n].v}).`))
      if (pkgs[n].auto) {
        pkgs[n] = { ...pkgs[n], auto: false }
        out.push(o(`${n} set to manually installed.`))
      }
    } else if (pkgs[n]) upgrades.push(n)
    else fresh.push(n)
  }
  const extra = new Set()
  for (const n of [...fresh, ...upgrades]) for (const d of missingDeps(st, n)) if (!names.includes(d)) extra.add(d)
  const extras = [...extra].sort()
  const newOnes = [...fresh, ...extras].sort()
  const notUp = upgradable(st).filter((n) => !upgrades.includes(n)).length
  if (!newOnes.length && !upgrades.length) {
    out.push(summary(0, 0, 0, notUp))
    return { state: { ...st, pkgs }, out }
  }
  if (extras.length) out.push(o('The following additional packages will be installed:'), ...wrapList(extras))
  if (newOnes.length) out.push(o('The following NEW packages will be installed:'), ...wrapList(newOnes))
  if (upgrades.length) out.push(o('The following packages will be upgraded:'), ...wrapList(upgrades))
  out.push(summary(upgrades.length, newOnes.length, 0, notUp))
  const all = [...newOnes, ...upgrades]
  const get = all.reduce((s, n) => s + REPO[n].size, 0)
  const disk = all.reduce((s, n) => s + REPO[n].inst, 0)
  out.push(o(`Need to get ${kb(get)} of archives.`), o(`After this operation, ${kb(disk)} of additional disk space will be used.`))
  if (newOnes.length + upgrades.length > 1) out.push(o('Do you want to continue? [Y/n] Y'), o('(The simulator answers Y for you. On your laptop, press Enter.)', 'dim'))
  all.forEach((n, i) => out.push(o(`Get:${i + 1} ${ARCHIVE} noble/${REPO[n].sec.split('/')[0]} amd64 ${n} amd64 ${REPO[n].v} [${kb(REPO[n].size)}]`)))
  out.push(o(`Fetched ${kb(get)} in 1s`))
  for (const n of all) {
    out.push(o(pkgs[n] ? `Preparing to unpack .../${n}_${REPO[n].v}_amd64.deb ...` : `Selecting previously unselected package ${n}.`, 'dim'))
    out.push(o(`Unpacking ${n} (${REPO[n].v})${pkgs[n] ? ` over (${pkgs[n].v})` : ''} ...`, 'dim'))
  }
  const rc = { ...st.rc }
  for (const n of all) {
    pkgs[n] = { v: REPO[n].v, auto: pkgs[n] ? pkgs[n].auto : !names.includes(n) }
    delete rc[n]
  }
  for (const n of [...all].reverse()) out.push(o(`Setting up ${n} (${REPO[n].v}) ...`, 'ok'))
  out.push(o('Processing triggers for man-db (2.12.0-4build2) ...', 'dim'))
  return { state: { ...st, pkgs, rc }, out }
}

/** remove, purge and autoremove share this. */
function aptRemove(st, names, { purge = false, auto = false } = {}) {
  const out = reading()
  const pkgs = { ...st.pkgs }
  const rc = { ...st.rc }
  let targets
  if (auto) targets = orphans(pkgs)
  else {
    targets = []
    for (const n of names) {
      if (pkgs[n]) targets.push(n)
      else if (purge && rc[n]) targets.push(n)
      else if (!REPO[n] && !st.fresh) {
        out.push(o(`E: Unable to locate package ${n}`, 'err'))
        return { state: st, out }
      } else out.push(o(`Package '${n}' is not installed, so not removed`))
    }
    // Removing a package also removes installed packages that depend on it.
    let grew = true
    while (grew) {
      grew = false
      for (const p of Object.keys(pkgs)) {
        if (!targets.includes(p) && (REPO[p]?.deps ?? []).some((d) => targets.includes(d))) {
          targets.push(p)
          grew = true
        }
      }
    }
  }
  targets.sort()
  const notUp = upgradable(st).filter((n) => !targets.includes(n)).length
  if (!targets.length) {
    out.push(summary(0, 0, 0, notUp))
    return { state: st, out }
  }
  const after = { ...pkgs }
  targets.forEach((n) => delete after[n])
  if (!auto) out.push(...orphanNote(after))
  out.push(o('The following packages will be REMOVED:'), ...wrapList(targets.map((n) => (purge ? n + '*' : n))))
  out.push(summary(0, 0, targets.length, notUp))
  const freed = targets.filter((n) => pkgs[n]).reduce((s, n) => s + REPO[n].inst, 0)
  if (freed) out.push(o(`After this operation, ${kb(freed)} disk space will be freed.`))
  if (targets.length > 1) out.push(o('Do you want to continue? [Y/n] Y'), o('(The simulator answers Y for you. On your laptop, press Enter.)', 'dim'))
  out.push(o('(Reading database ... 74512 files and directories currently installed.)', 'dim'))
  for (const n of targets) {
    if (pkgs[n]) out.push(o(`Removing ${n} (${pkgs[n].v}) ...`, 'ok'))
    if (REPO[n]?.conf) {
      if (purge) out.push(o(`Purging configuration files for ${n} (${REPO[n].v}) ...`, 'ok'))
      else rc[n] = true
    }
    if (purge) delete rc[n]
  }
  out.push(o('Processing triggers for man-db (2.12.0-4build2) ...', 'dim'))
  return { state: { ...st, pkgs: after, rc }, out }
}

function aptUpgrade(st, full) {
  const out = [...reading(), o('Calculating upgrade... Done')]
  const ups = upgradable(st)
  // A plain upgrade never installs new packages, so anything that needs one is "kept back".
  const kept = full ? [] : ups.filter((n) => [...missingDeps(st, n)].length)
  const doing = ups.filter((n) => !kept.includes(n)).sort()
  const newOnes = full ? [...new Set(doing.flatMap((n) => [...missingDeps(st, n)]))].sort() : []
  if (!doing.length) {
    out.push(summary(0, 0, 0, kept.length))
    if (!st.fresh) out.push(o('(Nothing to upgrade? apt only knows about new versions after sudo apt update.)', 'dim'))
    return { state: st, out }
  }
  if (newOnes.length) out.push(o('The following NEW packages will be installed:'), ...wrapList(newOnes))
  if (kept.length) out.push(o('The following packages have been kept back:'), ...wrapList(kept))
  out.push(o('The following packages will be upgraded:'), ...wrapList(doing))
  out.push(summary(doing.length, newOnes.length, 0, kept.length))
  const all = [...newOnes, ...doing]
  out.push(o(`Need to get ${kb(all.reduce((s, n) => s + REPO[n].size, 0))} of archives.`), o('Do you want to continue? [Y/n] Y'))
  const pkgs = { ...st.pkgs }
  for (const n of all) out.push(o(`Unpacking ${n} (${REPO[n].v})${pkgs[n] ? ` over (${pkgs[n].v})` : ''} ...`, 'dim'))
  for (const n of all) {
    pkgs[n] = { v: REPO[n].v, auto: pkgs[n] ? pkgs[n].auto : true }
    out.push(o(`Setting up ${n} (${REPO[n].v}) ...`, 'ok'))
  }
  if (kept.length) out.push(o(`(${kept.join(', ')} needs a new package, so only sudo apt full-upgrade will upgrade it.)`, 'dim'))
  return { state: { ...st, pkgs }, out }
}

function aptSearch(st, term) {
  const out = [o('Sorting... Done'), o('Full Text Search... Done')]
  if (!term) return { state: st, out: [o('E: You must give at least one search pattern', 'err')] }
  const t = term.toLowerCase()
  for (const n of Object.keys(REPO).sort()) {
    if (!known(st, n)) continue
    if (!n.includes(t) && !REPO[n].desc.toLowerCase().includes(t)) continue
    const inst = st.pkgs[n] ? (st.pkgs[n].v === REPO[n].v ? ' [installed]' : ` [installed, upgradable to: ${REPO[n].v}]`) : ''
    out.push(o(`${n}/noble ${REPO[n].v} amd64${inst}`, 'ok'), o(`  ${REPO[n].desc}`), o(''))
  }
  if (!st.fresh) out.push(o('(Hardly anything found? apt only knows the repository after sudo apt update.)', 'dim'))
  return { state: st, out }
}

function aptShow(st, name) {
  const p = name && known(st, name)
  if (!p) return { state: st, out: [o(`N: Unable to locate package ${name ?? ''}`, 'err'), o('E: No packages found', 'err')] }
  return {
    state: st,
    out: [
      o(`Package: ${name}`, 'ok'),
      o(`Version: ${p.v}`),
      o('Priority: optional'),
      o(`Section: ${p.sec}`),
      o('Maintainer: Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>'),
      o(`Installed-Size: ${kb(p.inst)}`),
      o(`Depends: ${['libc6 (>= 2.34)', ...p.deps].join(', ')}`),
      o(`Download-Size: ${kb(p.size)}`),
      o(`APT-Manual-Installed: ${st.pkgs[name] ? (st.pkgs[name].auto ? 'no' : 'yes') : 'no'}`),
      o(`APT-Sources: ${ARCHIVE} noble/${p.sec.split('/')[0]} amd64 Packages`),
      o(`Description: ${p.desc}`),
    ],
  }
}

function aptList(st, flags) {
  const out = [o('Listing... Done')]
  if (flags.includes('--upgradable')) {
    for (const n of upgradable(st).sort()) out.push(o(`${n}/noble-updates ${REPO[n].v} amd64 [upgradable from: ${st.pkgs[n].v}]`))
  } else if (flags.includes('--installed')) {
    for (const n of Object.keys(st.pkgs).sort()) out.push(o(`${n}/noble,now ${st.pkgs[n].v} amd64 [installed${st.pkgs[n].auto ? ',automatic' : ''}]`))
  } else out.push(o('(Try apt list --installed or apt list --upgradable)', 'dim'))
  return { state: st, out }
}

function apt(st, args, root, tool) {
  let [sub, ...rest] = args
  if (tool === 'apt-cache' && !['search', 'show'].includes(sub)) return { state: st, out: [o(`E: Invalid operation ${sub ?? ''}`, 'err')] }
  if (sub === 'dist-upgrade') sub = 'full-upgrade'
  const flags = rest.filter((a) => a.startsWith('-'))
  const names = rest.filter((a) => !a.startsWith('-'))
  if (!sub) return { state: st, out: [o('apt 2.7.14 (amd64)'), o('Usage: apt [options] command'), o('Most used commands: update, upgrade, install, remove, purge, autoremove, search, show, list', 'dim')] }
  if (!APT_SUBS.includes(sub)) return { state: st, out: [o(`E: Invalid operation ${sub}`, 'err')] }
  if (NEEDS_ROOT.has(sub) && !root) {
    if (sub === 'update')
      return {
        state: st,
        out: [o('Reading package lists... Done'), o('E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)', 'err'), o('E: Unable to lock directory /var/lib/apt/lists/', 'err')],
      }
    return {
      state: st,
      out: [
        o('E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)', 'err'),
        o('E: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?', 'err'),
      ],
    }
  }
  switch (sub) {
    case 'update':
      return aptUpdate(st)
    case 'install':
      return aptInstall(st, names)
    case 'remove':
      return aptRemove(st, names)
    case 'purge':
      return aptRemove(st, names, { purge: true })
    case 'autoremove':
      return aptRemove(st, [], { auto: true, purge: flags.includes('--purge') })
    case 'upgrade':
      return aptUpgrade(st, false)
    case 'full-upgrade':
      return aptUpgrade(st, true)
    case 'search':
      return aptSearch(st, names[0])
    case 'show':
      return aptShow(st, names[0])
    default:
      return aptList(st, flags)
  }
}

/* ---------- Programs ---------- */

const pad = (s, n) => (s + ' '.repeat(n)).slice(0, Math.max(n, s.length))

function dpkg(st, args) {
  if (args[0] !== '-l') return [o('Try: dpkg -l (list installed packages) or dpkg -l nginx', 'dim')]
  const names = args.length > 1 ? args.slice(1) : Object.keys({ ...st.pkgs, ...st.rc }).sort()
  const rows = names.filter((n) => st.pkgs[n] || st.rc[n])
  if (!rows.length) return [o(`dpkg-query: no packages found matching ${args[1]}`, 'err')]
  return [
    o('Desired=Install/Remove/Purge | Status=Installed/Config-files', 'dim'),
    o('||/ Name                 Version                Description', 'dim'),
    o('+++-====================-======================-==========================', 'dim'),
    ...rows.map((n) => o(`${st.pkgs[n] ? 'ii ' : 'rc '} ${pad(n, 20)} ${pad(st.pkgs[n]?.v ?? REPO[n].v, 22)} ${REPO[n].desc.slice(0, 40)}`, st.pkgs[n] ? 'out' : 'warn')),
  ]
}

const COW = (msg) => {
  const line = '_'.repeat(msg.length + 2)
  const dash = '-'.repeat(msg.length + 2)
  return [` ${line}`, `< ${msg} >`, ` ${dash}`, '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||'].map((t) => o(t))
}

function program(st, cmd, args) {
  const pkg = BINS[cmd]
  if (!st.pkgs[pkg]) {
    return [o(`Command '${cmd}' not found, but can be installed with:`), o(`sudo apt install ${pkg}`, 'ok')]
  }
  const v = st.pkgs[pkg].v
  const ver = args.some((a) => ['-v', '-V', '--version'].includes(a))
  switch (cmd) {
    case 'tree':
      return ['.', '├── notes.txt', '└── my-site', '    ├── index.html', '    └── style.css', '', '2 directories, 3 files'].map((t) => o(t))
    case 'cowsay':
      return COW(args.join(' ') || 'moo')
    case 'git':
      return ver ? [o(`git version ${v.split(':')[1].split('-')[0]}`)] : [o('usage: git [--version] [--help] <command> [<args>]'), o('(You’ll learn git properly in the next lectures.)', 'dim')]
    case 'node':
      return ver ? [o(`v${v.split('+')[0]}`)] : [o('Welcome to Node.js. (The simulator can’t open the Node prompt. Try node -v.)', 'dim')]
    case 'nginx':
      return ver ? [o(`nginx version: nginx/${v.split('-')[0]} (Ubuntu)`)] : [o('nginx: [emerg] bind() to 0.0.0.0:80 failed (13: Permission denied)', 'err'), o('(A web server needs sudo to use port 80. Try nginx -v.)', 'dim')]
    case 'htop':
      return [o('(htop fills the terminal with a live list of running programs. Press q to quit it. The simulator can’t draw it.)', 'dim')]
    case 'vlc':
      return [o(`VLC media player ${v.split('-')[0]} Vetinari`), ...(ver ? [] : [o('(VLC opens in its own window. The simulator can’t show it.)', 'dim')])]
    case 'curl':
      return ver ? [o(`curl ${v.split('-')[0]} (x86_64-pc-linux-gnu) libcurl/${v.split('-')[0]} OpenSSL/3.0.13`)] : [o('curl: try \'curl --help\' or \'curl --manual\' for more information')]
    case 'openssl':
      return [o(`OpenSSL ${v.split('-')[0]} 30 Jan 2024 (Library: OpenSSL ${v.split('-')[0]} 30 Jan 2024)`)]
    default:
      return ver ? [o('Python 3.12.3')] : [o('Python 3.12.3. (The simulator can’t open the Python prompt. Try python3 --version.)', 'dim')]
  }
}

const HELP = [
  'Package commands:',
  '  sudo apt update               refresh the list of available packages',
  '  apt search <word>             find packages',
  '  apt show <package>            read a package’s details',
  '  sudo apt install <package>    install (with its dependencies)',
  '  sudo apt remove <package>     uninstall, keep its settings',
  '  sudo apt purge <package>      uninstall and delete its settings',
  '  sudo apt autoremove           remove dependencies nobody needs',
  '  sudo apt upgrade              install newer versions',
  '  sudo apt full-upgrade         upgrade, even if new packages are needed',
  '  apt list --installed | --upgradable',
  'Other: dpkg -l, which <program>, ls, pwd, whoami, clear',
  `Packages to try: ${['tree', 'cowsay', 'git', 'nginx', 'nodejs', 'htop', 'vlc'].join(', ')}`,
]

/* ---------- The shell ---------- */

export function run(line, st) {
  const words = line.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return { state: st, out: [] }
  let root = false
  let state = st
  const pre = []
  if (words[0] === 'sudo') {
    words.shift()
    if (!words.length) return { state, out: [o('usage: sudo <command>', 'err')] }
    root = true
    if (!state.sudoAsked) {
      pre.push(o('[sudo] password for student:', 'dim'), o('(On your laptop, type your password: nothing appears while you type. The simulator skips this.)', 'dim'))
      state = { ...state, sudoAsked: true }
    }
  }
  const [cmd, ...args] = words
  const done = (r) => ({ ...r, out: [...pre, ...r.out] })
  switch (cmd) {
    case 'apt':
    case 'apt-get':
    case 'apt-cache':
      return done(apt(state, args, root, cmd))
    case 'help':
      return done({ state, out: HELP.map((t) => o(t, 'dim')) })
    case 'clear':
      return { state, out: [], clear: true }
    case 'pwd':
      return done({ state, out: [o(HOME)] })
    case 'whoami':
      return done({ state, out: [o(root ? 'root' : 'student')] })
    case 'echo':
      return done({ state, out: [o(args.join(' ').replace(/^["']|["']$/g, ''))] })
    case 'ls': {
      const p = args.find((a) => !a.startsWith('-'))
      if (!p || p === '.' || p === '~' || p === HOME) return done({ state, out: [o('my-site  notes.txt')] })
      if (p.replace(/\/$/, '') === '/etc/nginx') {
        const there = state.pkgs.nginx || state.rc.nginx
        return done({ state, out: there ? [o('conf.d  mime.types  nginx.conf  sites-available  sites-enabled')] : [o("ls: cannot access '/etc/nginx': No such file or directory", 'err')] })
      }
      return done({ state, out: [o(`ls: cannot access '${p}': No such file or directory (the simulator only knows ~ and /etc/nginx)`, 'err')] })
    }
    case 'which': {
      const pkg = BINS[args[0]]
      return done({ state, out: pkg && state.pkgs[pkg] ? [o(REPO[pkg].bin)] : [] })
    }
    case 'dpkg':
      return done({ state, out: dpkg(state, args) })
    default:
      if (BINS[cmd]) return done({ state, out: program(state, cmd, args) })
      return done({ state, out: [o(`${cmd}: command not found`, 'err')] })
  }
}

/** Tab completion: commands first, then apt sub-commands, then package names. */
export function complete(input, st) {
  const words = input.split(' ')
  const last = words[words.length - 1]
  const before = words.slice(0, -1).filter((w) => w && w !== 'sudo')
  let pool
  if (!before.length) pool = COMMANDS
  else if (['apt', 'apt-get'].includes(before[0]) && before.length === 1) pool = APT_SUBS
  else if (['apt', 'apt-get'].includes(before[0])) pool = Object.keys(st.fresh ? REPO : { ...st.pkgs, ...st.rc })
  else return input
  const hits = pool.filter((c) => c.startsWith(last))
  if (hits.length !== 1) return input
  return [...words.slice(0, -1), hits[0]].join(' ') + ' '
}
