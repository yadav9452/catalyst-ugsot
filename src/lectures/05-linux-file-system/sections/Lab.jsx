import { Callout, Reveal, Section } from '../../../design-system'
import { HOME, isDir } from './fsSim'
import Terminal from './Terminal'

const P = HOME + '/AI_Project'
const has = (s, p) => p in s.fs

const tasks = [
  {
    label: 'Make AI_Project with src, docs and logs inside',
    hint: 'mkdir -p AI_Project/{src,docs,logs}',
    done: (s) => ['src', 'docs', 'logs'].every((d) => isDir(s.fs, `${P}/${d}`)),
  },
  { label: 'Create an empty app.log inside logs', hint: 'touch AI_Project/logs/app.log', done: (s) => has(s, `${P}/logs/app.log`) },
  {
    label: 'Write two lines into docs/notes.txt (one >, one >>)',
    hint: 'echo "Day 1" > AI_Project/docs/notes.txt  then  echo "Day 2" >> …',
    done: (s) => (s.fs[`${P}/docs/notes.txt`]?.text ?? '').includes('\n'),
  },
  { label: 'Add a hidden .env file to AI_Project', hint: 'touch AI_Project/.env', done: (s) => has(s, `${P}/.env`) },
  {
    label: 'Make a backup folder and copy app.log into it',
    hint: 'mkdir AI_Project/backup  then  cp AI_Project/logs/app.log AI_Project/backup/',
    done: (s) => has(s, `${P}/backup/app.log`),
  },
  {
    label: 'Rename docs/notes.txt to docs/readme.txt',
    hint: 'mv AI_Project/docs/notes.txt AI_Project/docs/readme.txt',
    done: (s) => has(s, `${P}/docs/readme.txt`) && !has(s, `${P}/docs/notes.txt`),
  },
  {
    label: 'Delete the backup folder',
    hint: 'rm -r AI_Project/backup',
    done: (s) => !has(s, `${P}/backup`) && s.events.some((e) => e.cmd === 'rm' && e.ok && e.args.some((a) => a.includes('backup'))),
  },
  {
    label: 'Check your work: show the whole tree, hidden files too',
    hint: 'ls -aR AI_Project   (or: tree AI_Project)',
    done: (s) => s.events.some((e) => (e.cmd === 'tree' || (e.cmd === 'ls' && e.flags.includes('R'))) && e.ok && e.args.some((a) => a.includes('AI_Project'))),
  },
]

export default function Lab() {
  return (
    <Section
      id="lab"
      eyebrow="Part 12 · Practice lab"
      title="Build a project folder from scratch"
      intro="Everything from today in one go. Work in the practice terminal (it starts in your home folder, ~) or in your real terminal. Use hints only if you’re stuck."
    >
      <Reveal>
        <Terminal
          tasks={tasks}
          title="student@laptop: ~"
          welcome={['Practice lab: build AI_Project step by step.', 'Commands: help · Tab completes names · ↑ repeats · Ctrl+L clears']}
          label="Practice lab terminal"
        />
      </Reveal>
      <Callout>This is exactly how you’ll start every web project: make the folders, add files, keep secrets in a hidden .env, and check the tree.</Callout>
    </Section>
  )
}
