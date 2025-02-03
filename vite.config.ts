import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/products': {
        target: 'https://server-weht.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/requisitions': {
        target: 'https://server-weht.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});