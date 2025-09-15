# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 Vue 3.5+ + Vite 6+ + TypeScript 5+ 的移动端 H5 企业级项目模板，专注于提供通用的移动端开发脚手架和可复用组件。项目使用 Vant 4+ 作为移动端 UI 组件库，配合 UnoCSS 和 postcss-mobile-forever 实现移动端适配。

## 常用命令

### 开发和构建

```bash
pnpm dev                 # 启动开发服务器
pnpm build:dev          # 构建开发环境
pnpm build:pro          # 构建生产环境
pnpm preview            # 预览构建结果
```

### 代码质量检查

```bash
pnpm lint               # ESLint 代码检查 (使用 @antfu/eslint-config)
pnpm lint:fix           # 自动修复 ESLint 问题
pnpm typecheck          # TypeScript 类型检查 (严格模式)
```

### 版本管理

```bash
pnpm release            # 发布新版本 (bumpp)
pnpm commitlint         # 检查提交信息格式
```

## 技术栈与开发规范

### 核心技术栈

- **前端框架**: Vue 3.5+ (组合式 API + `<script setup>` 语法糖)
- **构建工具**: Vite 6+
- **UI 组件库**: Vant 4+ (移动端)
- **状态管理**: Pinia 3+ + pinia-plugin-persistedstate
- **路由**: Vue Router 4.x (支持 hash/history 模式)
- **样式方案**: UnoCSS (原子化CSS，rem转px基准值: 4px) + Less + postcss-mobile-forever
- **类型系统**: TypeScript 5+ (严格模式)
- **代码检查**: ESLint + @antfu/eslint-config (禁用 Prettier)
- **包管理**: pnpm 10+
- **网络请求**: Axios 1+

### 移动端特性

- **移动端适配**: UnoCSS 原子化CSS + postcss-mobile-forever，设计稿基准 375px
- **设备集成**: 企业微信 (@wecom/jssdk)、摄像头、地图服务 (腾讯地图)、文件上传压缩
- **交互体验**: 触摸手势支持 (@vant/touch-emulator)、移动端调试 (vConsole)
- **性能优化**: 图片懒加载、路由懒加载、代码分割、离线缓存

## 项目架构

### 路径别名配置

- `@` → `src` 目录
- `~` → `src/assets` 目录
- `~root` → 项目根目录

### 目录结构与规范

```
src/
├─ api/                  # 接口管理
│  ├─ interface/         # 接口类型定义
│  └─ modules/           # 按业务模块划分接口
├─ assets/               # 静态资源
│  ├─ images/           # 图片资源
│  ├─ svgs/             # SVG图标 (配合UnoCSS使用)
│  └─ iconfont/         # 字体图标
├─ components/           # 组件库
│  ├─ base/             # 基础UI组件 (NavBar、TabBar等)
│  └─ core/             # 核心业务组件 (Chart等)
├─ composables/          # 组合式函数
├─ config/              # 配置文件
├─ constants/           # 常量定义
├─ directives/          # 自定义指令
├─ enums/               # 枚举定义
├─ http/                # HTTP请求配置
├─ modules/             # 功能模块 (可选的业务模块封装)
├─ plugins/             # 插件配置
├─ router/              # 路由配置
├─ stores/              # 状态管理 (按模块划分)
├─ styles/              # 全局样式
├─ types/               # 类型声明
├─ utils/               # 工具函数
├─ views/               # 页面视图
├─ App.vue              # 根组件
└─ main.ts              # 入口文件
```

### 命名规范

- **组件**: PascalCase (`NavBar.vue`)，避免与 HTML 元素和 Vant 组件冲突
- **页面**: kebab-case (`home/index.vue`)
- **Composables**: camelCase (`useCamera.ts`)
- **Props**: 声明时 camelCase，模板中 kebab-case
- **类型/接口**: PascalCase，优先使用 `interface`
- **常量**: UPPER_CASE

### 组件开发规范

- 使用单文件组件 (SFC) + `<script setup lang="ts">`
- 必须使用 `defineOptions({ name: 'ComponentName' })` 定义组件名
- Props 使用基于类型的声明 + `withDefaults`
- 优先使用 `ref` 而非 `reactive`
- 样式优先使用 UnoCSS 原子化类名，复杂样式使用 Scoped Less

### 移动端适配方案

项目实现了完善的移动端适配：

- **UnoCSS**: 原子化CSS，rem转px (基准值 4px)，丰富的预设类和自定义规则
- **宽高比兼容**: `src/styles/aspect-ratio.less` 提供新旧浏览器兼容方案
  - 现代浏览器: CSS `aspect-ratio` 属性
  - 旧浏览器: padding-bottom 技术
  - 预设比例: `aspect-video` (16:9)、`aspect-square` (1:1)、`aspect-iphoneX` (375:812) 等

### 核心功能封装

#### 状态管理 (Pinia)

- 配置持久化插件，Store 模块位于 `src/stores/modules/`
- `routeCache.ts` - 路由缓存管理（keep-alive）
- 使用 Setup Store 语法，避免无脑使用全局状态

#### 路由架构

- 配置在 `src/router/staticRouter.ts`
- 支持 hash/history 模式切换 (VITE_ROUTER_MODE)
- 集成 NProgress 进度条和路由缓存管理
- 路由名称必须与组件名称保持一致

#### Composables 生态

核心组合式函数位于 `src/composables/`：

- `usePopup.ts` - 弹窗管理器，支持程序化创建和管理
- `useHttpLoading.ts` - HTTP 请求加载状态
- `useTouchFeedback.ts` - 触摸反馈

#### 样式系统

- **UnoCSS 预设**: 主题色 primary (#3875c6)、secondary (#F6F7F8)
- **快捷类**: flex 布局、定位、文本处理等
- **自定义规则**: 支持 `wh-{size}`、`{p|m}-{top}_{right}_{bottom}_{left}` 等
- **SVG 图标**: 自动读取 `src/assets/svgs/` 生成图标集，使用 `i-svg:图标名`

### 构建优化

Vite 配置包含：

- **代码分割**: Vue 核心库、工具库、第三方模块分别打包
- **资源分类**: CSS、图片、JS 文件分目录输出
- **兼容性**: 支持传统浏览器 (@vitejs/plugin-legacy)
- **压缩**: gzip/brotli 压缩
- **优化**: esbuild 优化、sourcemap 配置

### Git 提交规范

使用 commitlint + simple-git-hooks：

```
type: message

类型枚举:
- feat: 新功能
- fix: 修复错误
- perf: 性能优化
- refactor: 重构代码
- docs: 文档和注释
- types: 类型相关
- test: 单测相关
- ci: 持续集成、工作流
- revert: 撤销更改
- chore: 琐事（更新依赖、修改配置等）
```

### 保留的通用功能

- 基础组件库 (Popup, Chart等)
- 工具函数和 Composables
- 演示页面 (图表、PDF、宽高比、定位等通用功能)
- 移动端适配方案
- 路由缓存管理

## App.vue 架构

主应用采用移动端三层布局：

- **NavBar**: 顶部导航栏
- **RouterView**: 内容区域，支持 keep-alive 缓存
- **TabBar**: 底部导航栏

使用动态组件包装器优化路由缓存性能，确保每个路由都有独立的组件实例。

## 开发注意事项

1. **移动端优先**: 考虑触摸区域、手势操作、屏幕适配
2. **性能优化**: 图片懒加载、路由懒加载、合理使用缓存
3. **用户体验**: 优化加载速度、提供反馈机制、适配弱网环境
4. **代码质量**: TypeScript 严格模式、ESLint 校验、避免类型体操
5. **组件设计**: 原子化组件、避免直接操作 DOM、使用唯一 key
6. **安全考虑**: 防范移动端安全问题、避免敏感信息泄露
