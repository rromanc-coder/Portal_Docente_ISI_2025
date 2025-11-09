import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',             // base del proyecto
  publicDir: 'public',   // carpeta de archivos estáticos
  build: {
    outDir: 'dist',      // salida del build
  },
  plugins: [react()],
})
