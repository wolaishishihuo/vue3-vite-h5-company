import type { PluginOption } from 'vite';
import { VantResolver } from '@vant/auto-import-resolver';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import viteCompression from 'vite-plugin-compression';
import { createViteVConsole } from './vconsole';

export const createVitePlugins = (viteEnv: ViteEnv): (PluginOption | PluginOption[])[] => {
  return [
    vue(),
    vueJsx(),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['tsx', 'vue'],
      // resolvers: [VantResolver(), ElementPlusResolver()],
      resolvers: [VantResolver({ importStyle: false }), ElementPlusResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      dts: 'src/types/components.d.ts'
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/
      ],
      imports: [
        'vue',
        '@vueuse/core',
        'vue-router',
        'pinia'
      ],
      dts: 'src/types/auto-imports.d.ts',
      // resolvers: [VantResolver(), ElementPlusResolver()]
      resolvers: [VantResolver({ importStyle: false }), ElementPlusResolver()]
    }),

    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    // 创建打包压缩配置
    createCompression(viteEnv),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),

    // https://github.com/vadxq/vite-plugin-vconsole
    createViteVConsole(viteEnv)
  ];
};

/**
 * @description 根据 compress 配置，生成不同的压缩规则
 * @param viteEnv
 */
const createCompression = (viteEnv: ViteEnv): PluginOption | PluginOption[] => {
  const { VITE_BUILD_COMPRESS = 'none', VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;
  const compressList = VITE_BUILD_COMPRESS.split(',');
  const plugins: PluginOption[] = [];
  if (compressList.includes('gzip')) {
    plugins.push(
      viteCompression({
        ext: '.gz',
        algorithm: 'gzip',
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  if (compressList.includes('brotli')) {
    plugins.push(
      viteCompression({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  return plugins;
};
