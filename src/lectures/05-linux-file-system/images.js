/*
 * Pictures for Lecture 5, taken from the Lecture 5 slide deck and stored in assets/lecture5/.
 * Use them as img.folder, img['fhs-map'] and so on (the key is the file name without .webp).
 */
const files = import.meta.glob('../../../assets/lecture5/*.webp', { eager: true, import: 'default' })

export const img = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.webp$/, ''),
    url,
  ]),
)

// Lecture 3 pictures (Tux, terminal…) are reused here.
export { img as img3 } from '../03-introduction-to-linux/images'
