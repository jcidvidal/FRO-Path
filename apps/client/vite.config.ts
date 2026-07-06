import { defineConfig } from 'vitest/config'
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
    // dedupe garantiza una sola instancia de React sin acoplar la
    // resolucion a apps/client/node_modules. Los alias hardcodeados
    // anteriores rompian el build cuando npm hoistea react a la raiz
    // del monorepo (caso del CI con npm workspaces).
    dedupe: ['react', 'react-dom', 'react-router-dom'],
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
