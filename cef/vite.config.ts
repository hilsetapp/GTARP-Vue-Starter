import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  // относительные пути — RAGE грузит CEF через package:// схему
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // shared/ лежит выше корня Vite — разрешаем к нему доступ
    fs: { allow: ['..'] },
  },
  build: {
    // CEF в RAGE — не самый свежий хром, не выпендриваемся
    target: 'chrome89',
    outDir: 'dist',
    emptyOutDir: true,
  },
});
