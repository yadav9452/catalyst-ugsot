import { Callout, PauseBadge, Reveal, Section } from '../../../design-system'
import { upgradable } from './aptSim'
import Terminal from './Terminal'

const ran = (st, test) => st.events.some(test)
const isApt = (e, sub) => ['apt', 'apt-get'].includes(e.cmd) && e.sub === sub

const tasks = [
  { label: 'Refresh the package index', hint: 'sudo apt update', done: (st) => st.fresh },
  { label: 'Search for a tool that shows folders as a tree', hint: 'apt search tree', done: (st) => ran(st, (e) => isApt(e, 'search')) },
  { label: 'Read the details of the tree package', hint: 'apt show tree', done: (st) => ran(st, (e) => isApt(e, 'show') && e.args.includes('tree')) },
  { label: 'Install tree, then run it', hint: 'sudo apt install tree, then tree', done: (st) => ran(st, (e) => e.cmd === 'tree' && e.ok) },
  { label: 'Install git and notice the extra packages it brings', hint: 'sudo apt install git', done: (st) => !!st.pkgs.git },
  { label: 'Remove git, then clear its leftover dependencies', hint: 'sudo apt remove git, then sudo apt autoremove', done: (st) => !st.pkgs.git && ran(st, (e) => isApt(e, 'install') && e.args.includes('git')) && !st.pkgs['git-man'] },
  { label: 'Upgrade everything, including what upgrade keeps back', hint: 'sudo apt upgrade, then sudo apt full-upgrade', done: (st) => st.fresh && upgradable(st).length === 0 },
  { label: 'Install nginx, check its version, then purge it', hint: 'sudo apt install nginx · nginx -v · sudo apt purge nginx', done: (st) => ran(st, (e) => e.cmd === 'nginx' && e.ok) && !st.pkgs.nginx && !st.rc.nginx },
]

export default function Practice() {
  return (
    <Section
      id="practice"
      eyebrow="Practice lab"
      title="Your turn: set up a fresh Ubuntu machine"
      intro="This terminal behaves like apt on a new Ubuntu system. Work through the list; it ticks itself. Try mistakes too: leave out sudo, or install before updating."
      tone="alt"
    >
      <PauseBadge>Pause the video and do all eight tasks</PauseBadge>
      <Reveal>
        <Terminal
          tasks={tasks}
          welcome={['Type help to see the commands. Tab completes names, ↑ repeats, Ctrl + L clears.', 'A brand-new Ubuntu. Where do you start?']}
          label="Practice terminal: type a command"
        />
      </Reveal>
      <Callout label="Also try">
        sudo apt install cowsay, then cowsay hello. Run dpkg -l to see dpkg’s list of installed packages. Remove nginx (not purge) and run ls /etc/nginx: the settings
        are still there. Then do the same in Ubuntu on your own laptop.
      </Callout>
    </Section>
  )
}
