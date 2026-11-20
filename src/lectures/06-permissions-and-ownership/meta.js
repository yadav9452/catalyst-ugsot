/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroLock from './sections/HeroLock'

export const hero = {
  title: 'Permissions and',
  accent: 'Ownership',
  subtitle:
    'Who may read, change or run each file? Learn to read -rwxr-x--- at a glance, change it with chmod, manage users and groups, and keep your projects and servers safe.',
  visual: HeroLock,
}

export const goals = [
  ['Read permissions', 'Decode a string like -rwxr-x--- at a glance'],
  ['r, w, x', 'What they mean for files and for folders'],
  ['chmod', 'Change permissions in letters (u+x) and numbers (755)'],
  ['Users & groups', 'whoami, id, sudo, useradd, usermod -aG, groupadd'],
  ['Ownership & defaults', 'chown, chgrp, -R and how umask sets new files'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'intro', label: 'Why' },
  { id: 'see', label: 'ls -l' },
  { id: 'rwx', label: 'r w x' },
  { id: 'classes', label: 'Owner · group · others' },
  { id: 'read', label: 'Reading' },
  { id: 'chmod', label: 'chmod' },
  { id: 'numeric', label: '755 & co' },
  { id: 'users', label: 'Users' },
  { id: 'sudo', label: 'sudo' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'groups', label: 'Groups' },
  { id: 'chown', label: 'chown' },
  { id: 'umask', label: 'umask' },
  { id: 'practice', label: 'Practice lab' },
  { id: 'dev', label: 'Real errors' },
]

export const why = [
  ['🛡', 'Every website you deploy runs on a Linux server, and permissions limit the damage when something goes wrong'],
  ['🔐', 'Secrets like .env files and SSH keys must be 600: SSH even refuses keys that are too open'],
  ['▶️', '“Permission denied” on ./deploy.sh is just a missing x: now you can fix it in seconds'],
  ['👥', 'Teams share folders through groups instead of making everything 777'],
]

export const recap = [
  'ls -l shows the type (- file, d directory, l link), then rwx for user (owner), group and others.',
  'Files: r read, w change, x run. Folders: r list, w create/delete inside, x enter. Deleting a file needs w on its folder.',
  'Linux checks owner, then group, then others, and uses the first class that matches you.',
  'chmod in letters: u/g/o/a, then + - =, then r w x (chmod u+x, g-w, o=r).',
  'chmod in numbers: r=4, w=2, x=1, one digit per class. Use 644, 755, 600, 700. Avoid 777.',
  'whoami, id, groups and /etc/passwd tell you about users. Root is UID 0; regular users start at 1000.',
  'sudo runs one command as root. useradd -m, passwd, usermod -aG, userdel -r and groupadd manage accounts.',
  'chown user:group changes ownership (-R for folders); chgrp changes only the group.',
  'umask switches permissions off new files: 666/777 with umask 022 give 644/755.',
]

export const quiz = [
  {
    q: 'What can the group do with a file that shows -rw-r-----?',
    options: ['Nothing', 'Read it', 'Read and change it', 'Read, change and run it'],
    a: 1,
    why: 'Split it: rw- (owner), r-- (group), --- (others). The group can only read.',
  },
  {
    q: 'Which number is rwxr-xr-x?',
    options: ['777', '755', '644', '711'],
    a: 1,
    why: 'rwx = 4+2+1 = 7, r-x = 4+0+1 = 5, r-x = 5. So 755.',
  },
  {
    q: './deploy.sh says Permission denied. What is the quickest fix?',
    options: ['sudo ./deploy.sh', 'chmod 777 deploy.sh', 'chmod u+x deploy.sh', 'chown root deploy.sh'],
    a: 2,
    why: 'The script is missing execute. u+x adds it for the owner only. 777 would let everyone change it.',
  },
  {
    q: 'Which permission should your .env file (API keys) have?',
    options: ['777', '755', '644', '600'],
    a: 3,
    why: '600 = rw------- : only you can read and change it.',
  },
  {
    q: 'What does the -a in sudo usermod -aG web demo do?',
    options: ['Adds a new user', 'Appends: demo keeps their other groups', 'Gives demo admin rights', 'Applies to all users'],
    a: 1,
    why: 'Without -a, -G replaces the whole group list, and demo could lose sudo.',
  },
  {
    q: 'You can’t delete old.txt even though the file has w. Why?',
    options: ['Files need x to be deleted', 'You need w on the folder it is in', 'Only root can delete files', 'The file is too big'],
    a: 1,
    why: 'Deleting changes the folder’s list of names, so the folder’s w is what counts.',
  },
  {
    q: 'With umask 022, what permissions does a new file get?',
    options: ['666 rw-rw-rw-', '644 rw-r--r--', '755 rwxr-xr-x', '600 rw-------'],
    a: 1,
    why: 'Files start at 666; umask 022 switches off w for group and others: 644.',
  },
  {
    q: 'Which command makes demo the owner of report.txt?',
    options: ['chmod demo report.txt', 'sudo chown demo report.txt', 'sudo chgrp demo report.txt', 'usermod demo report.txt'],
    a: 1,
    why: 'chown changes the owner, and giving a file away needs sudo. chgrp would change only the group.',
  },
]

export const nextTeaser = 'Package Management and Software Installation: apt, sudo and installing the tools every developer needs.'
