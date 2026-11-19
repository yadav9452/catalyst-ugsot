/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroChip from './sections/HeroChip'

export const hero = {
  title: 'Computer Internals:',
  accent: 'Hardware, Software & Instructions',
  subtitle: 'Open the box: the CPU, memory and devices inside, and the software that tells them what to do.',
  visual: HeroChip,
}

export const goals = [
  ['Inside the CPU', 'Control Unit, ALU, registers and how it runs instructions'],
  ['Memory and storage', 'Registers, cache, RAM, ROM, SSD and HDD'],
  ['Input and output', 'How devices connect you to the computer'],
  ['Performance', 'Why CPU, RAM and SSD decide how fast it feels'],
  ['Software and instructions', 'System vs application software, and why precision matters'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'hardware', label: 'Hardware' },
  { id: 'cycle', label: 'How the CPU works' },
  { id: 'memory', label: 'Memory' },
  { id: 'io', label: 'Input & output' },
  { id: 'performance', label: 'Performance' },
  { id: 'software', label: 'Software' },
  { id: 'precise', label: 'Instructions' },
]

export const why = [
  ['</>', 'Every line of code you write is fetched, decoded and executed by the CPU'],
  ['⚡', 'More RAM and an SSD make VS Code, the browser and your dev server faster'],
  ['☰', 'Your apps are application software running on top of the operating system'],
  ['!', 'Computers do exactly what you write, so precise code is the difference between 12 and NaN'],
]

export const recap = [
  'The CPU has a Control Unit, an ALU, and registers and cache.',
  'It runs every instruction as fetch, decode, execute, store.',
  'RAM holds current work; ROM starts the computer; SSD/HDD keep files.',
  'A faster CPU, more RAM and an SSD make a computer feel faster.',
  'System software runs the computer; application software does tasks.',
  'Computers follow instructions exactly, so they must be precise.',
]

export const quiz = [
  {
    q: 'Which part of the CPU works out what an instruction means?',
    options: ['The ALU', 'The Control Unit', 'The cache', 'The SSD'],
    a: 1,
    why: 'The Control Unit decodes each instruction and tells the other parts what to do.',
  },
  {
    q: 'A laptop with 4 GB of RAM feels slow with many tabs open. Why?',
    options: ['The screen is too small', 'The RAM is full, so data keeps moving to slower storage', 'The keyboard is old', 'The ROM is full'],
    a: 1,
    why: 'When RAM runs out, the computer swaps data to storage, which is much slower.',
  },
  {
    q: 'Is a touchscreen an input device, an output device, or both?',
    options: ['Input', 'Output', 'Both', 'Neither'],
    a: 2,
    why: 'You touch it to give input, and it shows output on the same surface.',
  },
  {
    q: 'Is Chrome system software or application software?',
    options: ['System software', 'Application software', 'Firmware', 'Hardware'],
    a: 1,
    why: 'Chrome does a specific task for the user, so it is application software. Windows or macOS is system software.',
  },
  {
    q: 'let a = 5; let b; console.log(a + b) prints…',
    options: ['5', '12', 'NaN', 'An error message asking for b'],
    a: 2,
    why: 'b has no value, so a + b is Not a Number. The computer never asks; it just follows the steps.',
  },
]

export const nextTeaser = 'Meet Linux: the operating system behind most servers, the cloud and DevOps.'
