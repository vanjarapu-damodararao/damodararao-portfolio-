import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config. The 3D code is loaded lazily (React.lazy), so Vite
// automatically splits Three.js into its own file that loads after the text.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { chunkSizeWarningLimit: 900 },
});
