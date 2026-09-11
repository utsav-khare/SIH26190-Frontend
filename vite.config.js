import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the large third-party libs (react, react-dom, react-router-dom,
    // lucide-react) in a separate vendor chunk so that app code changes
    // invalidate only the app bundle — useful when the app grows beyond a
    // handful of pages. React 18 + router already account for the bulk of
    // the dependency graph here.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'lucide-react',
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

