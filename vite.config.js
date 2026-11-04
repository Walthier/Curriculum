import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'pagina-ia': resolve(__dirname, 'pagina-ia.html'),
        cv: resolve(__dirname, 'cv.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
