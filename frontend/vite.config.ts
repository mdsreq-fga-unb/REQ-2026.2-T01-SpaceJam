import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// No Docker o backend se chama "backend"; rodando fora do Docker, é localhost.
const apiTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // O front chama /api/... e o Vite repassa para o Django: sem CORS em desenvolvimento.
    proxy: {
      '/api': apiTarget,
      '/media': apiTarget,
    },
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    },
  },
})
