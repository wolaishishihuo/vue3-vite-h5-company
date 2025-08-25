<template>
  <div
    class="article-item border-b-1 p-16"
    @click="handleClick"
  >
    <!-- 主要内容区域 -->
    <div class="flex gap-12">
      <!-- 左侧内容 -->
      <div class="min-w-0 flex-1 text-32">
        <div>
          <!-- 标题 -->
          <div class="mb-8 text-truncate color-gray-800 font-600">
            {{ article.title }}
          </div>

          <!-- 摘要 -->
          <div class="line-clamp-2 mb-12 color-gray-600">
            {{ article.summary }}
          </div>
        </div>

        <!-- 多图模式 -->
        <div
          v-if="computedMode === 'multi-image' && article.images?.length"
          class="mt-12"
        >
          <div class="flex gap-30">
            <van-image
              v-for="(image, index) in article.images.slice(0, 3)"
              :key="index"
              :src="image"
              fit="cover"
              lazy-load
              radius="10"
              class="h-146 w-210 flex-1"
            />
          </div>
        </div>
        <!-- 多图模式的底部元信息 -->
        <div class="mt-12 flex-between">
          <div
            v-if="article.status"
            class="inline-flex items-center justify-center rounded-18 px-25 py-8 text-20"
            :class="getTagClass(article.status.type)"
          >
            {{ article.status.text }}
          </div>
          <span class="flex-center gap-8 text-24 color-#999">
            <van-icon name="clock-o" size="16" />
            {{ formatTime(article.publishTime) }}
          </span>
        </div>
      </div>

      <!-- 右侧单图 -->
      <div
        v-if="computedMode === 'single-image' && article.images?.[0]"
        class="ml-12 h-146 w-210 flex-shrink-0"
      >
        <van-image
          :src="article.images[0]"
          fit="cover"
          lazy-load
          radius="10"
          class="rounded-10"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArticleCardProps, ArticleDisplayMode } from './types';
import dayjs from 'dayjs';
import { computed } from 'vue';

defineOptions({
  name: 'ArticleCard'
});

const props = withDefaults(defineProps<ArticleCardProps>(), {
  mode: undefined
});

const emit = defineEmits<{
  click: [article: ArticleCardProps['article']];
}>();

const computedMode = computed<ArticleDisplayMode>(() => {
  if (props.mode) return props.mode;

  const images = props.article.images;
  if (!images?.length) return 'text';
  if (images.length === 1) return 'single-image';
  return 'multi-image';
});

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD');
};

const getTagClass = (type: string) => {
  const classMap = {
    pending: 'bg-#FF891F color-#fff border border-#FF891F',
    processed: 'bg-#3975C6 color-#fff border border-#3975C6',
    default: 'bg-#F5F5F5 color-#999 border border-#F5F5F5'
  };
  return classMap[type as keyof typeof classMap] || classMap.default;
};

const handleClick = () => {
  emit('click', props.article);
};
</script>
