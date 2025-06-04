import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import commonjs, { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [viteCommonjs(), vue()],
    define: {
      // 注入 NODE_ENV 到客户端代码
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    base: process.env.NODE_ENV == 'production' ? '/console/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
    },
    build: {
      outDir: 'console',
      emptyOutDir: true,
    }
  }
})
