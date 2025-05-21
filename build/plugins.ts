import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vitePluginImp from 'vite-plugin-imp';

import { createViteVConsole } from './vconsole';

export function createVitePlugins(mode: string) {
  return [
    vue(),
    vueJsx(),
    vitePluginImp({
      libList: [
        {
          libName: 'vant',
          replaceOldImport: false,
          style: (name) => {
            if (name.includes('toast')) {
              return 'vant/es/toast/style/index';
            }

            if (name.includes('dialog')) {
              return 'vant/es/dialog/style/index';
            }

            if (name.includes('image-preview')) {
              return 'vant/es/image-preview/style/index';
            }

            if (name.includes('notify')) {
              return 'vant/es/notify/style/index';
            }

            return `vant/es/${name}/style/index`;
          }
        }
        // {
        //   libName: 'element-plus',
        //   replaceOldImport: false,
        //   style: (name) => {
        //     if (['el-config-provider', 'effect'].includes(name)) return false;
        //     return `element-plus/es/components/${name.replace('el-', '')}/style/css`;
        //   }
        // }
      ]
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
