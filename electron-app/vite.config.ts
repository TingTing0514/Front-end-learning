import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from "vite-plugin-electron/simple";
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    electron({
      main:{
        entry:'./electron/main.ts'
      },
      preload:{
        input:'./electron/preload.ts'
      }
     
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
    build: {
    outDir: 'dist'
  }
})
