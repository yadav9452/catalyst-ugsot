// Creates a new lecture folder from the template.
// Usage: npm run new-lecture -- 2
import { cpSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lectures } from '../src/course/curriculum.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const number = Number(process.argv[2])
const lecture = lectures.find((l) => l.number === number)

if (!lecture) {
  console.error(`No lecture ${process.argv[2] ?? ''} in src/course/curriculum.js. Usage: npm run new-lecture -- <number>`)
  process.exit(1)
}

const folder = `${String(number).padStart(2, '0')}-${lecture.slug}`
const target = join(root, 'src', 'lectures', folder)

if (existsSync(target)) {
  console.error(`src/lectures/${folder} already exists.`)
  process.exit(1)
}

cpSync(join(root, 'src', 'lectures', '_template'), target, { recursive: true })
console.log(`Created src/lectures/${folder} for “${lecture.title}”.`)
console.log('Edit its meta.js and Lecture.jsx, then run npm run dev.')
