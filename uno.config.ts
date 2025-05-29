import { createRemToPxResolver } from '@unocss/preset-wind4/utils';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import fs from 'node:fs';

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

const BASE_FONT_SIZE = 4;

// 本地 SVG 图标存放目录
const iconsDir = './src/assets/svgs';

// 读取本地 SVG 目录，自动生成 `safelist`
const generateSafeList = () => {
  try {
    return fs
      .readdirSync(iconsDir)
      .filter(file => file.endsWith('.svg'))
      .map(file => `i-svg:${file.replace('.svg', '')}`);
  } catch (error) {
    console.error('无法读取图标目录:', error);
    return [];
  }
};
export default defineConfig({
  // 自定义类样式
  shortcuts: [
    ['btn', 'px-6 py-3 rounded-[50px] border-none w-90% inline-block bg-[#3875C6] text-white cursor-pointer outline-hidden hover:bg-[#2d5d9e] disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 shadow-[0px_21px_38px_0px_rgba(56,117,198,0.32)]'],
    ['fixed-bottom-btns', 'fixed bottom-0 left-0 right-0 flex flex-col justify-center px-0 py-15px bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'],
    // flex布局
    ['flex-center', 'flex justify-center items-center'],
    ['flex-between', 'flex justify-between items-center'],
    ['flex-around', 'flex justify-around items-center'],
    ['flex-evenly', 'flex justify-evenly items-center'],
    ['flex-start', 'flex justify-start items-center'],
    ['flex-end', 'flex justify-end items-center'],
    ['flex-col', 'flex flex-col'],
    ['flex-col-between', 'flex flex-col items-center justify-between'],
    ['flex-col-center', 'flex flex-col justify-center items-center'],
    // 文本溢出省略
    ['text-truncate', 'whitespace-nowrap overflow-hidden text-ellipsis'],
    // 背景重复
    ['bg-no-repeat-contain', 'bg-no-repeat bg-contain'],
    ['bg-no-repeat-cover', 'bg-no-repeat bg-cover'],
    // 绝对定位
    ['abs-full', 'absolute left-0 right-0 top-0 bottom-0'],
    ['abs-x-center', 'absolute left-50% top-0 translate-x--1/2'],
    ['abs-y-center', 'absolute left-0 top-50% translate-y--1/2'],
    ['abs-center', 'absolute left-50% top-50% translate-x--1/2 translate-y--1/2'],
    // 图片
    ['wh-full-contain', 'wh-full object-contain'],
    ['wh-full-cover', 'wh-full object-cover'],
    ['wh-full', 'w-full h-full']
  ],
  rules: [
    // example: p-10_20_30_40
    [
      /^([pm])-(\d+)_(\d+)(?:_(\d+))?(?:_(\d+))?(?:_(\d+))?$/,
      ([, type, top, right, bottom, left]) => {
        const pm = type === 'p' ? 'padding' : 'margin';
        const sides = [top, right, bottom, left]
          .filter(Boolean)
          .map(item => `${item}px`)
          .join(' ');
        return {
          [pm]: sides
        };
      }
    ],
    // example: wh-100
    [
      /^wh-(\d+)$/,
      ([, wh]) => ({
        width: `${wh}px`,
        height: `${wh}px`
      })
    ]
  ],
  presets: [
    presetWind4({
      utilityResolver: createRemToPxResolver(BASE_FONT_SIZE)
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      // 设置全局图标默认属性
      extraProperties: {
        width: '1em',
        height: '1em',
        display: 'inline-block'
      },
      // 注册本地 SVG 图标集合
      collections: {
        // svg 是图标集合名称，使用 `i-svg:图标名` 调用
        svg: FileSystemIconLoader(iconsDir, (svg) => {
          // 如果 SVG 文件未定义 `fill` 属性，则默认填充 `currentColor`
          // 这样图标颜色会继承文本颜色，方便在不同场景下适配
          return svg.includes('fill="')
            ? svg
            : svg.replace(/^<svg /, '<svg fill="currentColor" ');
        })
      }
    })
  ],
  safelist: generateSafeList(),
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ]
});
