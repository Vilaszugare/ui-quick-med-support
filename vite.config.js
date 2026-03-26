import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Use './' base only for production builds (required for Android/Capacitor).
  // During dev ('serve'), keep base as '/' so localhost:5173/ works correctly.
  base: command === 'build' ? './' : '/',
  build: { outDir: "dist" },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['https://medmis.vercel.app/', 'lics-fry.loca.lt']
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
}))