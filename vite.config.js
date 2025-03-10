import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate a 404.html that redirects to index.html for SPA routing
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    // Ensure all routes fallback to index.html during development
    historyApiFallback: true,
  },
})
