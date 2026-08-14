import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Absolute base, required by BrowserRouter: a real route like /ai must resolve
  // its assets from the site root, not relative to /ai/. Deep links therefore
  // need a host rewrite to index.html — see public/_redirects and public/404.html.
  base: '/',
})
