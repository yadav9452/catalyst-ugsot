/*
 * Pictures for Lecture 4, taken from the Lecture 4 slide deck and stored in assets/lecture4/.
 * Use them as img.nut, img['fhs-tree'] and so on (the key is the file name without .webp).
 */
const files = import.meta.glob('../../../assets/lecture4/*.webp', { eager: true, import: 'default' })

export const img = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.webp$/, ''),
    url,
  ]),
)

// Lecture 3 pictures (Tux, Chrome, terminal…) and Lecture 1 photos are reused here.
export { img as img3, photos } from '../03-introduction-to-linux/images'
