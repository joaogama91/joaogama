import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',          // <-- MUITO IMPORTANTE (antes era '/joaogama/')
  plugins: [react()],
})
