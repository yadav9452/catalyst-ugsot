/*
 * Pictures for Lecture 6, taken from the Lecture 6 slide deck and stored in assets/lecture6/.
 * Use them as img.user, img['ls-l'] and so on (the key is the file name without .webp).
 */
const files = import.meta.glob('../../../assets/lecture6/*.webp', { eager: true, import: 'default' })

export const img = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.webp$/, ''),
    url,
  ]),
)
