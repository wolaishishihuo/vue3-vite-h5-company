import type { ConfigEnv, UserConfig } from 'vite';
import path from 'node:path';
import process from 'node:process';
import { loadEnv } from 'vite';
import { createProxy, createVitePlugins, exclude, include, wrapperEnv } from './build';

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
  const viteEnv = wrapperEnv(env);

  return {
    root,
    base: viteEnv.VITE_PUBLIC_PATH,
    plugins: createVitePlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        '~root': path.join(__dirname, '.')
      }
    },
    esbuild: {
      drop: viteEnv.VITE_DROP_CONSOLE ? ['console', 'debugger'] : []
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      sourcemap: viteEnv.VITE_BUILD_SOURCEMAP,
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
            // Vue核心库
            if (/[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/.test(id)) {
              return 'vueChunk';
            }

            // 工具库
            if (/[\\/]node_modules[\\/](axios|dayjs|nprogress)[\\/]/.test(id)) {
              return 'utilsChunk';
            }

            // 其他node_modules模块
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
