/*
 * Pictures for Lecture 3, taken from the Lecture 3 slide deck and stored in assets/lecture3/.
 * Use them as img.tux, img['gui-launchpad'] and so on (the key is the file name without .webp).
 * To swap a picture, replace the file with one of the same name.
 */
const files = import.meta.glob('../../../assets/lecture3/*.webp', { eager: true, import: 'default' })

export const img = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.webp$/, ''),
    url,
  ]),
)

// Lecture 1 photos (phone, laptop, CPU, RAM, SSD…) are reused here too.
export { photos } from '../01-what-is-a-computer/images'
