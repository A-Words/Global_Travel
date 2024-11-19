import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //'/login': 'http://localhost:3000',
      //'/register': 'http://localhost:3000',
      '/api': 'http://localhost:3000'
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          'heritage': [
            './src/stores/heritageStore',
            './src/components/Home/constants'
          ],
          'auth': [
            './src/contexts/AuthContext'
          ],
          'three': [
            'three',
            '@react-three/fiber',
            '@react-three/drei'
          ],
          'antd': [
            'antd'
          ],
          'ant-icons': [
            '@ant-design/icons'
          ],
          'babylon-core': [
            '@babylonjs/core/Engines/engine',
            '@babylonjs/core/scene',
            '@babylonjs/core/Cameras/arcRotateCamera',
            '@babylonjs/core/Maths/math.vector',
            '@babylonjs/core/Helpers/photoDome',
            '@babylonjs/core/Events/pointerEvents'
          ]
        }
      }
    }
  }
});
