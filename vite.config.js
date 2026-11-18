import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// VITE_BASE lets you host the site in a sub-folder, e.g. GitHub Pages:
//   VITE_BASE=/catalyst-ugsot/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
