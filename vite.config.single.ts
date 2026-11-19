import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * 单文件构建配置：把 JS / CSS / 字体 / 截图全部内联进一个 HTML，
 * 产物可直接双击用 file:// 打开，无需服务器。
 *
 * 与正式站（base=/CloudTrace/）分开，避免影响线上部署。
 */
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      // 运行时 `${base}${path}` 会拼成 ./screenshots/x.png，
      // 这里把 BASE_URL 清空，方便后续替换成 data URI。
      name: 'strip-base-url',
      transform(code) {
        if (!code.includes('import.meta.env.BASE_URL')) return null;
        return { code: code.replaceAll('import.meta.env.BASE_URL', '""'), map: null };
      },
    },
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist-single',
    emptyOutDir: true,
    // 大到足以把字体、图标全部内联为 data URI
    assetsInlineLimit: 64 * 1024 * 1024,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        // 单文件不能有独立 chunk
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
});
