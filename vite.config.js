import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// All files containing JSX use a .jsx extension, so no custom loader config is
// needed — this keeps the dev server, production build, and Vitest consistent.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Vitest — jsdom + jest-axe for automated accessibility + interaction tests.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
    env: {
      // Force the mock API in tests so no real network calls are made.
      VITE_USE_MOCK: 'true',
    },
  },
})
