import 'dotenv/config'
import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  outDir: 'staticfiles',
  plugins: [reactPlugin()],
  assetsInclude: ['**/*.PNG', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
})
