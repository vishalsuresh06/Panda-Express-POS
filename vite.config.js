import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  outDir: 'staticfiles',
  plugins: [react()],
  assetsInclude: ['**/*.PNG', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
  
})
