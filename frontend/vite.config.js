import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `npm run build:artifact` builds the app as a Claude artifact:
  // the FastAPI client is swapped for services/api.artifact.js and the
  // output uses relative paths with stable file names.
  if (mode === 'artifact') {
    return {
      plugins: [react()],
      base: './',
      resolve: {
        alias: [
          { find: /^(.*)\/services\/api$/, replacement: '$1/services/api.artifact' },
        ],
      },
      build: {
        outDir: 'dist-artifact',
        emptyOutDir: true,
        assetsInlineLimit: 100000,
        rollupOptions: {
          output: {
            entryFileNames: 'assets/app.js',
            chunkFileNames: 'assets/[name].js',
            assetFileNames: 'assets/[name][extname]',
          },
        },
      },
    }
  }

  return {
    plugins: [react()],
  }
})
