import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    clearMocks: true,
    globals: true,
    setupFiles: ['dotenv/config'],
    alias: {
      '@': path.resolve(__dirname, '.')
    },
  },
})