import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false,
    // Configure SPA fallback
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: '/index.html' }
      ]
    }
  },
  build: {
    // Optimize image handling in build
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const assetName =
            assetInfo.names?.[0] ??
            assetInfo.originalFileNames?.[0] ??
            assetInfo.name ??
            'asset'
          const info = assetName.split('.')
          const ext = info[info.length - 1]?.toLowerCase() ?? ''
          if (/png|jpe?g|gif|svg|webp|ico/.test(ext)) {
            return `imgs/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          } else {
            return `assets/[name]-[hash][extname]`
          }
        }
      }
    }
  }
})
