import path from 'node:path';
import process from 'node:process';
import { loadEnv } from 'vite';
import type { ConfigEnv, UserConfig } from 'vite';
import { createVitePlugins } from './build';
import { exclude, include } from './build/optimize';

interface PreRenderedAsset {
  name: string | undefined;
  originalFileName: string | null;
  source: string | Uint8Array;
  type: 'asset';
}

// 用于处理预渲染的静态资源
const isImageFile = (assetInfo: { name?: string }) => {
  const imageExtensions = /\.(png|jpe?g|gif|svg|webp)$/i;
  return assetInfo.name?.match(imageExtensions) !== null;
};

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const isProd = mode === 'production';

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(mode),
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: '',
          ws: false,
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        '~root': path.join(__dirname, '.')
      }
    },
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : []
    },
    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: !isProd,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          assetFileNames(assetInfo: PreRenderedAsset) {
            if (assetInfo.name === 'css') {
              return 'css/[name]-[hash].css';
            }
            // 图片资源打包成图片文件
            if (isImageFile(assetInfo)) {
              return 'images/[name]-[hash].[ext]';
            }
            // 如果以上条件都不满足，返回默认的文件名格式
            return '[ext]/[name].[hash].[ext]';
          },
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',

          // 代码分割配置
          manualChunks(id) {
            // 将 vue 及其相关包打包成一个文件 打包成 'vue.js'
            if (id.includes('vue')) {
              return 'vue';
            }
            // 将 axios 单独打包成一个文件 打包成 'axios.js'
            if (id.includes('node_modules/axios')) {
              return 'axios';
            }
            // 其他 node_modules 中的包按照名称进行分组
            if (id.includes('node_modules')) {
              const moduleName = id.split('node_modules/')[1].split('/')[0];
              return moduleName;
            }
          }
        }
      }
    },

    optimizeDeps: { include, exclude }
  };
};
