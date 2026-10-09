import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-backend-237404.onrender.com',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: ['mern-frontend-237404.onrender.com'],
  },
})
