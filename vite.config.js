import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works from any path — a user site, a project
  // subpath like /portfolio/, or opened straight off disk.
  base: './',
})
