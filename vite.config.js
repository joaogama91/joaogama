import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/joaogama/',   // <- nome do repositório no GitHub
  plugins: [react()],
})
