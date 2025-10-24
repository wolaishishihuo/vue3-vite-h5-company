import type { Declaration, Plugin, Root } from 'postcss';
import postcss from 'postcss';

interface PluginOptions {
  viewportWidth?: number | ((file: string) => number); // 设计稿宽度
  unitPrecision?: number; // 转换后保留的小数点位数
  selectorBlackList?: string[]; // 忽略的选择器
  valueBlackList?: string[]; // 忽略的属性值
  exclude?: RegExp[]; // 忽略的文件/目录
  maxWidth?: number; // 移动端最大宽度（<=maxWidth 使用vw，>maxWidth 使用px）
  rootContainingBlockSelectorList?: string[]; // fixed 定位元素选择器列表
  appSelector?: string; // 页面根元素选择器
}

/**
 * PostCSS 插件：PC 优先 - 默认保持 px，移动端（≤maxWidth）转 vw
 *
 * 策略：
 * - 默认样式：保持原始 px（用于 PC 端，>maxWidth）
 * - 移动端媒体查询：≤maxWidth 时转换为 vw
 *
 * 优势：
 * - 不会产生重复 selector，避免被 CSS 压缩器去重
 * - PC 端不需要额外的媒体查询，性能更好
 * - 更符合响应式设计的最佳实践
 *
 * ⚠️ 重要：此插件会跳过已存在的媒体查询（如 UnoCSS 的 md:、lg: 等）
 */
const postcssPluginPxToVwWithMedia = (options: PluginOptions = {}): Plugin => {
  const {
    viewportWidth = 750,
    unitPrecision = 5,
    selectorBlackList = [],
    valueBlackList = ['1px'],
    exclude = [],
    maxWidth = 750, // 默认 750px 及以下使用 vw
    rootContainingBlockSelectorList = [],
    appSelector = '#app'
  } = options;

  return {
    postcssPlugin: 'postcss-px-to-vw-with-media',

    Once(root: Root) {
      const file = root.source?.input?.file || '';

      // 检查是否需要排除此文件
      if (exclude.some(pattern => pattern.test(file))) {
        return;
      }

      // 获取当前文件的 viewportWidth
      const currentViewportWidth = typeof viewportWidth === 'function'
        ? viewportWidth(file)
        : viewportWidth;

      // 创建移动端媒体查询（转换为 vw）
      const mobileMediaQuery = postcss.atRule({
        name: 'media',
        params: `(max-width: ${maxWidth}px)`
      });

      // 遍历顶层规则，克隆到移动端媒体查询并转换 px 为 vw
      root.walkRules((rule) => {
        // ⚠️ 跳过已有媒体查询内的规则（如 UnoCSS 的 md:、lg: 等）
        if (rule.parent?.type === 'atrule') {
          return;
        }

        // 检查选择器是否在黑名单中
        const isBlacklisted = selectorBlackList.some((blackItem) => {
          return rule.selector.includes(blackItem);
        });

        if (isBlacklisted) {
          return;
        }

        // 检查规则是否包含 px 值
        let hasPx = false;
        rule.walkDecls((decl) => {
          if (decl.value.includes('px')) {
            hasPx = true;
          }
        });

        // 如果没有 px 值，跳过
        if (!hasPx) {
          return;
        }

        // 克隆规则并转换 px 为 vw（用于移动端）
        const clonedRule = rule.clone();

        clonedRule.walkDecls((decl: Declaration) => {
          if (decl.value.includes('px')) {
            decl.value = decl.value.replace(
              /(\d+(\.\d+)?)px/g,
              (match, number) => {
                // 检查是否在黑名单中
                if (valueBlackList.includes(match)) {
                  return match;
                }

                // px 转 vw
                const convertedValue = (Number.parseFloat(number) / currentViewportWidth) * 100;
                return `${convertedValue.toFixed(unitPrecision)}vw`;
              }
            );
          }
        });

        // 将转换后的规则添加到移动端媒体查询
        mobileMediaQuery.append(clonedRule);
      });

      // 为移动端 fixed 定位元素添加特殊处理（防止 vw 布局中定位错乱）
      if (rootContainingBlockSelectorList.length > 0 && appSelector) {
        // 创建移动端专用的 app 根元素 transform 规则
        const mobileAppRule = postcss.rule({ selector: appSelector });
        mobileAppRule.append(postcss.decl({
          prop: 'transform',
          value: 'translateZ(0)'
        }));
        mobileMediaQuery.append(mobileAppRule);
      }

      // 将移动端媒体查询添加到 CSS 末尾
      if (mobileMediaQuery.nodes.length > 0) {
        root.append(mobileMediaQuery);
      }
    }
  };
};

postcssPluginPxToVwWithMedia.postcss = true;

export default postcssPluginPxToVwWithMedia;
