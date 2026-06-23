import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localNodeModules = path.resolve(__dirname, 'node_modules')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      'react': path.resolve(localNodeModules, 'react'),
      'react-dom': path.resolve(localNodeModules, 'react-dom'),
      'react-dom/client': path.resolve(localNodeModules, 'react-dom/client.js'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    include: ['**/*.test.tsx', '**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.d.ts',
        'src/main.tsx',
        'vite.config.ts'
      ]
    }
  }
})
