/*
 * Photos and logos for Lecture 1, from assets/lecture1/.
 * To swap a picture, replace the file (or change the import path) here;
 * every section that uses it updates automatically.
 */
import pcSet from '../../../assets/lecture1/acer-desktop-computer-7bcb439e.jpg'
// Desktop computers with a separate CPU cabinet (tower), monitor, keyboard and mouse.
import towerPc from '../../../assets/lecture1/desktop image-1.jpg'
import towerPc2 from '../../../assets/lecture1/computer image-2.jpg'
import cpu from '../../../assets/lecture1/cpu ships.webp'
import desktop from '../../../assets/lecture1/desktop-aio-dell-pro-qb24250-wired-fixst-emza-bk-gallery-1_copy.png'
import ssd from '../../../assets/lecture1/internal-ssd-sata-m2-nvme-comparison.avif'
import keyboard from '../../../assets/lecture1/KEYBOARD.webp'
import laptop from '../../../assets/lecture1/laptop.webp'
import mobile from '../../../assets/lecture1/mobile.webp'
import monitor from '../../../assets/lecture1/MonitorLCDlcd.svg'
import ram from '../../../assets/lecture1/ram.jpeg'

export const photos = { pcSet, towerPc, towerPc2, cpu, desktop, keyboard, laptop, mobile, monitor, ram, ssd }

// Logos in assets/lecture1/logos/ are found by file name (spelling variants allowed).
const logoFiles = import.meta.glob('../../../assets/lecture1/logos/*.{svg,png,webp,jpg,jpeg}', { eager: true, import: 'default' })
const aliases = {
  windows: ['windows'],
  chrome: ['chrome', 'chorme', 'google-chrome'],
  vscode: ['vscode', 'vs-code', 'visual-studio-code'],
}

/** URL of a software logo, or null if the file isn't there. */
export function logo(name) {
  const names = aliases[name] ?? [name]
  const key = Object.keys(logoFiles).find((k) => names.includes(k.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase()))
  return key ? logoFiles[key] : null
}
