/* Lecture details used by the shared LectureLayout (hero, chapters, wrap-up, quiz). */
import HeroChip from './sections/HeroChip'

export const hero = {
  title: 'Computer Internals:',
  accent: 'Hardware & Software',
  subtitle: 'Open the box: the CPU, memory and devices inside, and the software that tells them what to do.',
  visual: HeroChip,
}

export const goals = [
  ['Inside the CPU', 'Control Unit, ALU, registers and how it runs instructions'],
  ['Memory and storage', 'Primary vs secondary memory, and why apps load into RAM'],
  ['Input and output', 'How devices connect you to the computer'],
  ['Performance', 'Why CPU, RAM and SSD decide how fast it feels'],
  ['System and application software', 'The kinds of each, examples, and how they work together'],
]

// Top-bar links. Each id must match a <Section id="..."> in the lecture.
export const chapters = [
  { id: 'hardware', label: 'Hardware' },
  { id: 'cycle', label: 'How the CPU works' },
  { id: 'ram-rom', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'load-ram', label: 'Apps in RAM' },
  { id: 'io', label: 'Input & output' },
  { id: 'performance', label: 'Performance' },
  { id: 'software', label: 'Software' },
  { id: 'software-types', label: 'Software types' },
]

export const why = [
  ['</>', 'Every app you use runs as instructions that the CPU fetches, decodes and executes'],
  ['⚡', 'More RAM and an SSD make your browser, online classes and apps faster'],
  ['☰', 'Your apps are application software running on top of the operating system'],
  ['⚙', 'Knowing what the OS does helps you fix everyday problems: slow laptops, missing drivers, full storage'],
]

export const recap = [
  'The CPU has a Control Unit, an ALU, and registers and cache.',
  'It runs every instruction as fetch, decode, execute, store.',
  'Primary memory (registers, cache, RAM, ROM) is fast; secondary memory (SSD/HDD) is big and keeps files.',
  'Apps are copied from storage into RAM first, because the CPU can only work fast from RAM.',
  'A faster CPU, more RAM and an SSD make a computer feel faster.',
  'System software (OS, drivers, utilities, firmware) runs the computer; application software does tasks for you.',
  'Apps reach the hardware only through the operating system.',
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
    q: 'Which of these is system software?',
    options: ['WhatsApp', 'A printer driver', 'Netflix', 'Canva'],
    a: 1,
    why: 'A driver helps the operating system talk to a device, so it is system software. The others are apps that do a task for you.',
  },
]

export const nextTeaser = 'Meet Linux: the operating system behind most servers, the cloud and DevOps.'
