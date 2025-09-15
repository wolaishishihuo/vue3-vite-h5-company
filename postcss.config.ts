// 此文件不支持热更新，修改后需要重启生效

// 需要转换的 fixed 选择器列表
const rootContainingBlockSelectorList = [
  '.van-tabbar',
  '.van-popup',
  '.van-popup--bottom',
  '.van-popup--top',
  '.van-popup--left',
  '.van-popup--right'
];

export default {
  plugins: {
    'autoprefixer': {},
    // https://github.com/wswmsword/postcss-mobile-forever
    'postcss-mobile-forever': {
      // UI 设计稿宽度
      viewportWidth: (file) => {
        // 组件库和 vant 都按 375px 基准转换
        if (file.includes('vant') || file.includes('@jname/vue-mobile-components')) {
          return 375;
        }
        // 项目自己的代码按实际设计稿基准
        return 750; // 根据你的设计稿调整
      },
      // 限制视图的最大宽度
      maxDisplayWidth: 750,
      // 页面最外层选择器
      appSelector: '#app',
      // 是否对「页面最外层选择器」对应的元素进行描边
      border: true,
      // 转换单位后保留的小数点位数
      unitPrecision: 3,
      // 转换后的单位
      mobileUnit: 'vw',
      // 需要转换的属性
      propList: ['*'],
      // 忽略的选择器
      selectorBlackList: ['.ignore', 'keep-px', 'el-'],
      // 忽略的属性
      propertyBlackList: {
        '.van-icon': 'font'
      },
      // 忽略的属性值
      valueBlackList: ['1px'],
      // 忽略的目录或文件
      exclude: [/node_modules\/element-plus/],
      // 包含块是根元素的选择器列表
      rootContainingBlockSelectorList
    }
  }
};
