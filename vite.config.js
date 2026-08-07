import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // NB: new URL('.', import.meta.url).pathname yields "/D:/..." on Windows —
  // an fs path Node can't resolve, so .env silently failed to load and the
  // dev proxy always errored with "Must set target or forward". process.cwd()
  // is portable across Windows/macOS/Linux since Vite always runs from the
  // project root.
  const env = loadEnv(mode, process.cwd(), '')
  const targetUrl = env.VITE_TARGET_URL

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: targetUrl,
          changeOrigin: true,
        },
        '/uploads': {
          target: targetUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
