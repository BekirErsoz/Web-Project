import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: false
  },
  server: {
    port: 5173,
    strictPort: true, // Port kullanımdaysa hata ver, başka porta geçme
    // Source map hatalarını konsola yazdırma
    hmr: {
      overlay: false
    }
  }
});
