import { defineConfig } from 'vite';

// BASE_PATH lets the same build serve from a domain root (Vercel) or a subpath (GitHub Pages).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 1500 },
});
