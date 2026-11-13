import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset paths are reliable on GitHub Pages project sites.
export default defineConfig({
  plugins: [react()],
  base: './',
})
