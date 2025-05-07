import { createRemToPxResolver } from '@unocss/preset-wind4/utils';

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

const BASE_FONT_SIZE = 8;

export default defineConfig({
  // 自定义类样式
  shortcuts: [
    ['btn', 'px-6 py-3 rounded-[50px] border-none inline-block bg-[#3875C6] text-white cursor-pointer outline-hidden hover:bg-[#2d5d9e] disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 shadow-[0px_21px_38px_0px_rgba(56,117,198,0.32)]']
  ],
  presets: [
    presetWind4({
      utilityResolver: createRemToPxResolver(BASE_FONT_SIZE)
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2
    })
  ],

  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ]
});
