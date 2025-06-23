# Vue3 Mobile H5 企业级项目模板

基于 Vue 3 生态系统的移动端 H5 应用模板，采用现代化的开发工具链和最佳实践。

## 技术栈

- 🚀 [Vue 3](https://v3.vuejs.org/) - 渐进式 JavaScript 框架
- 🏗️ [Vite](https://vitejs.dev/) - 下一代前端构建工具
- 🎨 [Vant](https://vant-ui.github.io/vant/#/zh-CN) - 移动端组件库
- 📦 [Pinia](https://pinia.vuejs.org/) - 状态管理
- 🛠️ [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- 🎯 [Vue Router](https://router.vuejs.org/) - 官方路由管理器
- 🔧 [VueUse](https://vueuse.org/) - 实用的 Composition API 工具集
- 📱 [postcss-mobile-forever](https://github.com/wswmsword/postcss-mobile-forever) - 移动端适配方案
- 🎭 [UnoCSS](https://github.com/unocss/unocss) - 即时原子 CSS 引擎

## 项目结构

```
├── build                   # 构建相关配置
├── public                  # 静态资源
├── src                    # 源代码
│   ├── api                # API 接口
│   ├── assets             # 主题 字体等静态资源
│   ├── components         # 全局组件
│   ├── composables        # 组合式函数
│   ├── config             # 全局配置
│   ├── constants          # 常量配置
│   ├── enums             # 枚举配置
│   ├── http              # axios 配置
│   ├── plugins           # 插件
│   ├── router            # 路由
│   ├── stores            # 状态管理
│   ├── styles            # 全局样式
│   ├── types             # 类型定义
│   ├── utils             # 全局工具函数
│   ├── views             # 页面
│   ├── App.vue           # 入口页面
│   └── main.ts           # 入口文件
├── .editorconfig         # 编辑器配置
├── .eslintrc.js         # ESLint 配置
├── .gitignore           # Git忽略文件
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 开发规范

### 代码风格

- 使用 ESLint + TypeScript 进行代码检查
- 遵循 Vue 3 组合式 API 风格指南
- 使用 TypeScript 编写代码，确保类型安全

### 组件开发规范

1. 组件命名采用大驼峰命名法
2. 使用 Composition API 编写组件逻辑
3. Props 必须定义类型和默认值
4. 事件采用 emit 声明方式

### Git 提交规范

提交信息格式：`类型: 描述`（描述不超过20字）

类型包括：

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构
- perf: 性能优化
- test: 测试
- chore: 构建过程或辅助工具的变动

## 开发环境设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境
pnpm build:pro

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck
```

## 常见问题

### 1. 移动端适配问题

- 使用 postcss-mobile-forever 进行移动端适配
- 设计稿基准宽度为 375px
- 开发时使用 px 单位，构建时会自动转换为 vw 单位

### 2. 跨域问题

- 开发环境通过 Vite 的 proxy 配置解决
- 生产环境需要后端支持 CORS 或使用 Nginx 反向代理

### 3. 性能优化

- 路由懒加载
- 组件按需引入
- 图片懒加载
- 合理使用 keep-alive
- 避免不必要的重渲染

## 宽高比(Aspect Ratio)兼容性解决方案

项目提供了基于Less的宽高比兼容性解决方案，同时支持现代浏览器和低版本浏览器，通过padding-bottom技术模拟固定宽高比。

### 预设宽高比类

```html
<!-- 16:9 视频容器 -->
<div class="aspect-video">
  <img src="./video-cover.jpg" class="aspect-content-cover" />
</div>

<!-- 1:1 正方形容器 -->
<div class="aspect-square">
  <div class="aspect-content-center">居中内容</div>
</div>

<!-- 4:3 容器 -->
<div class="aspect-4-3">
  <div>内容</div>
</div>

<!-- 手机屏幕比例 -->
<div class="aspect-iphoneX">
  <div>模拟iPhone屏幕</div>
</div>
```

### 自定义宽高比

1. 在aspect-ratio.less中添加自定义类:

```less
.aspect-custom {
  .aspect-ratio(5, 3); // 5:3比例
}
```

2. 在组件中使用:

```html
<div class="aspect-custom">
  <div>5:3比例内容</div>
</div>
```

### 支持的预设类

- **容器宽高比**：

  - `.aspect-video` (16:9)
  - `.aspect-square` (1:1)
  - `.aspect-portrait` (9:16)
  - `.aspect-4-3` (4:3)
  - `.aspect-3-2` (3:2)
  - `.aspect-iphoneX` (375:812)
  - `.aspect-16-10` (16:10)
  - `.aspect-2-1` (2:1)

- **内容样式**：
  - `.aspect-content-cover`（填充）
  - `.aspect-content-contain`（包含）
  - `.aspect-content-center`（居中）

## 部署

1. 构建生产环境代码

```bash
pnpm build:pro
```

2. 将 dist 目录下的文件部署到服务器

3. Nginx 配置参考

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
