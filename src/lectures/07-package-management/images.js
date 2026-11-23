/*
 * Pictures for Lecture 7, taken from the Lecture 7 slide deck and stored in assets/lecture7/.
 * Use them as img['pm-overview'], img['repos-why'] and so on (the key is the file name without .webp).
 */
const files = import.meta.glob('../../../assets/lecture7/*.webp', { eager: true, import: 'default' })

export const img = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.webp$/, ''),
    url,
  ]),
)
