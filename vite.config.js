import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-data': ['./src/data/standardPalettes.js', './src/data/uiSystemPalettes.js']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    cssMinify: true,
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false,
    target: 'esnext',
    lib: false,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    middlewareMode: false,
    hmr: true
  },
  ssr: false,
  preview: {
    port: 5173
  }
})
