import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //'/login': 'http://localhost:3000',
      //'/register': 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      'three': 'three',
      'three/examples/jsm': 'three/examples/jsm'
    }
  },
  optimizeDeps: {
    include: ['three']
  },
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'three': ['three']
        }
      }
    }
  }
});
