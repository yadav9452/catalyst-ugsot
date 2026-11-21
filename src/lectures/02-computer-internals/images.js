// Lecture 2 reuses the photos and logos stored for Lecture 1 (assets/lecture1/).
export { photos, logo } from '../01-what-is-a-computer/images'

/*
 * Lecture 2's own photos live in assets/lecture2/ and are found by file name.
 * Drop in a file called mouse.jpg, webcam.png, hdd.webp… and pic('mouse') returns it.
 * Until a photo is added, the page shows a drawing instead.
 */
const files = import.meta.glob('../../../assets/lecture2/*.{jpg,jpeg,png,webp,avif,svg}', { eager: true, import: 'default' })

export function pic(name) {
  const key = Object.keys(files).find(
    (k) =>
      k
        .split('/')
        .pop()
        .replace(/\.[^.]+$/, '')
        .toLowerCase() === name,
  )
  return key ? files[key] : null
}
