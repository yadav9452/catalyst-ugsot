/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroComputer from './sections/HeroComputer'

export const hero = {
  title: 'What Is a Computer and',
  accent: 'How It Works',
  subtitle: 'From the phone in your pocket to the servers behind every website.',
  visual: HeroComputer, // a component, rendered on the right of the hero
}

export const goals = [
  ['What a computer is', 'A simple definition, with everyday examples'],
  ['How it works', 'The IPOS cycle: input, processing, output, storage'],
  ['Hardware and software', 'What they are, and how they work together'],
  ['Types of computers', 'From phones to the servers behind every website'],
]

// Links in the top bar. Each id must match a <Section id="..."> below.
export const chapters = [
  { id: 'warmup', label: 'Why computers' },
  { id: 'definition', label: 'What is a computer' },
  { id: 'ipos', label: 'IPOS cycle' },
  { id: 'hwsw', label: 'Hardware & software' },
  { id: 'types', label: 'Types' },
  { id: 'website', label: 'Websites & AI' },
  { id: 'myths', label: 'Myth or fact' },
  { id: 'practice', label: 'Practice' },
]

export const why = [
  ['</>', 'The code you write is software: instructions the hardware carries out'],
  ['⇄', 'Every program you build takes input, processes it and gives output'],
  ['☁', 'Your websites will live on servers; browsers are the clients'],
  ['⚡', 'Knowing CPU, RAM and storage helps you write faster code'],
]

export const recap = [
  'A computer takes input, processes it and produces output.',
  'Storage keeps data like photos, apps and code, even when the computer is switched off.',
  'Hardware is the physical parts; software is the instructions.',
  'Desktops, laptops, phones and embedded devices are all computers.',
  'Servers send websites and data to clients over a network.',
  'A website runs IPOS across three computers: browser (frontend), server (backend) and database (storage).',
  'AI chat apps are software on servers in data centres. Your laptop is just the client.',
]

export const quiz = [
  {
    q: 'When you send a chat message, what is the output?',
    options: ['Typing on the keyboard', 'The message appearing on screen', 'The CPU', 'Your chat history'],
    a: 1,
    why: 'Typing is the input. The message showing on your screen (and your friend’s) is the output.',
  },
  {
    q: 'Is a web browser hardware or software?',
    options: ['Hardware', 'Software', 'Both', 'Neither'],
    a: 1,
    why: 'A browser is a set of instructions. You can’t touch it, so it’s software.',
  },
  {
    q: 'You switch your laptop off and on again. What is still there?',
    options: ['A file you saved', 'Text you typed but never saved', 'Both of them', 'Neither of them'],
    a: 0,
    why: 'Saved files are kept in storage, so they are still there. Save often: Ctrl + S (Cmd + S on a Mac).',
  },
  {
    q: 'Which of these is an embedded computer?',
    options: ['A gaming desktop', 'A laptop', 'A washing machine’s controller', 'A data-center server'],
    a: 2,
    why: 'An embedded computer is built into another device to do one job, like running a wash cycle.',
  },
  {
    q: 'When you open a website, which computer sends you the page?',
    options: ['The client', 'The server', 'Your keyboard', 'The operating system'],
    a: 1,
    why: 'Your browser (the client) asks; the server responds with the files.',
  },
  {
    q: 'You sign up on a website. Where is your account saved so it’s still there tomorrow?',
    options: ['In the browser tab', 'In the server’s RAM', 'In a database', 'On the screen'],
    a: 2,
    why: 'The server saves it in a database: the website’s permanent storage.',
  },
  {
    q: 'Is ChatGPT a computer?',
    options: ['Yes, a very big one', 'No, it’s software running on many server computers', 'No, it’s a website with no computers', 'Yes, it lives in your laptop'],
    a: 1,
    why: 'ChatGPT is software. It runs on thousands of servers in data centres; your laptop is the client.',
  },
]

export const nextTeaser = 'We open the box: the CPU, RAM and storage, and how they work together to run your code.'
