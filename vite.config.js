import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// We keep some context/provider files with a `.js` extension (per spec) even
// though they contain JSX. Tell esbuild to parse JSX inside `.js` files so the
// dev server and build both work without renaming.
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
