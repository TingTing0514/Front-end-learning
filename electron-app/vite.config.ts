import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from "vite-plugin-electron";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      entry:'./src-electron/main.ts'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

})
