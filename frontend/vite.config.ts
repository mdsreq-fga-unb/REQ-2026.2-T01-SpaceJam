import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// No Docker o backend se chama "backend"; rodando fora do Docker, é localhost.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_PROXY_TARGET || 'http://localhost:8000'
  return {
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
  }
})
