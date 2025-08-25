<template>
  <div class="demo-page">
    <div class="p-16">
      <div class="demo-section">
        <h2 class="demo-title">
          纯文本模式
        </h2>
        <ArticleCard
          :article="textArticle"
          mode="text"
          @click="handleClick"
        />
      </div>

      <div class="demo-section">
        <h2 class="demo-title">
          单图模式
        </h2>
        <ArticleCard
          :article="singleImageArticle"
          mode="single-image"
          @click="handleClick"
        />
      </div>

      <div class="demo-section">
        <h2 class="demo-title">
          多图模式
        </h2>
        <ArticleCard
          :article="multiImageArticle"
          mode="multi-image"
          @click="handleClick"
        />
      </div>

      <div class="demo-section">
        <h2 class="demo-title">
          自动判断模式
        </h2>
        <ArticleCard
          :article="autoModeArticle"
          @click="handleClick"
        />
      </div>

      <div class="demo-section">
        <h2 class="demo-title">
          长文本省略效果
        </h2>
        <ArticleCard
          :article="longTextArticle"
          mode="text"
          @click="handleClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArticleInfo } from '@/components/core/ArticleCard/types';
import { showToast } from 'vant';
import ArticleCard from '@/components/core/ArticleCard/index.vue';

defineOptions({
  name: 'ArticleCardDemo'
});

const textArticle: ArticleInfo = {
  id: 1,
  title: 'Vue 3 组合式API最佳实践',
  summary: '本文将介绍Vue 3组合式API的核心概念，包括setup函数、响应式系统、生命周期钩子等内容，帮助开发者更好地理解和使用Vue 3。',
  publishTime: '2024-01-15',
  status: {
    text: '已处理',
    type: 'processed'
  }
};

const singleImageArticle: ArticleInfo = {
  id: 2,
  title: 'TypeScript 类型体操实战指南',
  summary: 'TypeScript的类型系统非常强大，通过类型体操可以实现复杂的类型推导和约束。本文通过实际案例展示如何编写高级类型。',
  publishTime: '2024-01-14',
  images: ['https://picsum.photos/400/300?random=1'],
  status: {
    text: '待处理',
    type: 'pending'
  }
};

const multiImageArticle: ArticleInfo = {
  id: 3,
  title: 'Vite 构建优化完全指南',
  summary: '深入了解Vite的构建机制，学习如何通过各种配置和插件优化项目的构建速度和产物大小，提升开发和部署效率。',
  publishTime: '2024-01-13',
  images: [
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4'
  ]
};

const autoModeArticle: ArticleInfo = {
  id: 4,
  title: '移动端H5开发最佳实践',
  summary: '移动端H5开发需要考虑设备适配、性能优化、用户体验等多个方面，本文总结了一些实用的开发技巧和注意事项。',
  publishTime: '2024-01-12',
  images: [
    'https://picsum.photos/400/300?random=5',
    'https://picsum.photos/400/300?random=6'
  ],
  status: {
    text: '待处理',
    type: 'pending'
  }
};

const longTextArticle: ArticleInfo = {
  id: 5,
  title: '前端性能优化实战经验分享',
  summary: '性能优化是前端开发中的重要话题，涉及到加载速度、运行时性能、用户体验等多个方面。本文将从实际项目出发，分享一些行之有效的优化策略和技巧，包括资源压缩、懒加载、缓存策略、代码分割、图片优化等内容，希望能对大家的项目有所帮助。通过这些优化手段，我们可以显著提升应用的性能表现，为用户提供更好的使用体验。',
  publishTime: '2024-01-11',
  status: {
    text: '已处理',
    type: 'processed'
  }
};

const handleClick = (article: ArticleInfo) => {
  showToast(`点击了文章: ${article.title}`);
};
</script>

<style scoped lang="less">
.demo-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 24px;
}

.demo-title {
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  padding: 0 4px;
}
</style>
