import { Callout, PauseBadge, Reveal, Section } from '../../../design-system'
import { HOME } from './permSim'
import Terminal from './Terminal'

const node = (st, name) => st.fs[`${HOME}/${name}`]
const ran = (st, test) => st.events.some(test)

const tasks = [
  {
    label: 'Look at the permissions of everything here (include hidden files)',
    hint: 'ls -la',
    done: (st) => ran(st, (e) => e.cmd === 'ls' && e.flags.includes('l')),
  },
  { label: 'Try to run deploy.sh', hint: './deploy.sh', done: (st) => ran(st, (e) => e.cmd === './deploy.sh') },
  { label: 'It said Permission denied. Let the owner run it', hint: 'chmod u+x deploy.sh', done: (st) => (node(st, 'deploy.sh')?.mode & 0o100) !== 0 },
  { label: 'Run deploy.sh again, successfully', hint: './deploy.sh', done: (st) => ran(st, (e) => e.cmd === './deploy.sh' && e.ok) },
  { label: 'Make .env private: only you may read and write it', hint: 'chmod 600 .env', done: (st) => node(st, '.env')?.mode === 0o600 },
  {
    label: 'Stop others from reading notes.txt',
    hint: 'chmod o-r notes.txt',
    done: (st) => node(st, 'notes.txt') && (node(st, 'notes.txt').mode & 0o004) === 0,
  },
  { label: 'Give report.txt to the user demo', hint: 'sudo chown demo report.txt', done: (st) => node(st, 'report.txt')?.owner === 'demo' },
  { label: 'Check your umask', hint: 'umask', done: (st) => ran(st, (e) => e.cmd === 'umask') },
]

export default function Practice() {
  return (
    <Section
      id="practice"
      eyebrow="Practice lab"
      title="Your turn: take control of a project folder"
      intro="This terminal really checks permissions, just like Linux. Work through the list; it ticks itself."
      tone="alt"
    >
      <PauseBadge>Pause the video and do all eight tasks</PauseBadge>
      <Reveal>
        <Terminal
          tasks={tasks}
          welcome={['Type help to see the commands. Tab completes names, ↑ repeats, Ctrl + L clears.', 'You are student. Try: ls -l']}
          label="Practice terminal: type a command"
        />
      </Reveal>
      <Callout label="Also try">
        cat /root/secret.txt, then sudo cat /root/secret.txt. Or cd /home/demo: demo’s home folder is 750, so you can’t get in. Then do the same on your own
        laptop, in your Linux home folder.
      </Callout>
    </Section>
  )
}
