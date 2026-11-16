
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// No Docker o backend se chama "backend"; rodando fora do Docker, é localhost.
const apiTarget =
  process.env.VITE_PROXY_TARGET ?? 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    // O front chama /api/... e o Vite repassa para o Django.
    proxy: {
      '/api': apiTarget,
      '/media': apiTarget,
    },

    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testes_Julia/setupJulia.ts',
    css: true,
  },
});
