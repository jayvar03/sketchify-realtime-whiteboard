import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: process.env.NODE_ENV === "development" ? {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    } : undefined,
  },
})
