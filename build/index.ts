import process from 'node:process';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';
import Sitemap from 'vite-plugin-sitemap';
import { loadEnv } from 'vite';
import { createViteVConsole } from './vconsole';

export function createVitePlugins(mode: string) {
  const env = loadEnv(mode, process.cwd());

  return [
    vue(),

    // https://github.com/jbaubree/vite-plugin-sitemap
    Sitemap({
      outDir: env.VITE_APP_OUT_DIR || 'dist'
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],
      resolvers: [VantResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
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
        {
          'vue-router': ['useRouter', 'useRoute']
        }
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/composables'
      ],
      resolvers: [VantResolver()]
    }),

    legacy({
      targets: ['defaults', 'not IE 11']
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),

    // https://github.com/vadxq/vite-plugin-vconsole
    createViteVConsole(mode)
  ];
}
