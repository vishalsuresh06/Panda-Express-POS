import 'dotenv/config'
import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  outDir: 'staticfiles',
  plugins: [reactPlugin()],
  assetsInclude: ['**/*.PNG', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
})
