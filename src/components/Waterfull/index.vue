<!--
 * @Descripttion: 瀑布流组件
 * @version:
 * @Author: lhl
 * @Date: 2024-09-05 10:08:06
 * @LastEditors: lhl
 * @LastEditTime: 2024-09-05 21:49:41
-->
<template>
  <div
    class="waterfall-container"
    :style="{ gap: `${gap}px` }"
  >
    <div
      v-for="(column, index) in waterfallColumns"
      :key="index"
      class="waterfall-column"
    >
      <div
        v-for="(item, itemIndex) in column"
        :key="itemIndex"
        class="waterfall-item"
      >
        <img
          v-if="item.loaded"
          :src="item.src"
          :alt="item.alt"
          :data-src="item.src"
          class="waterfall-image"
          @load="handleImageLoad(item)"
        >
        <div
          v-else
          class="loading-animation"
        />
        <div class="item-content">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

interface Props {
  items: { src: string; alt: string; content: string }[];
  columns?: number;
  gap?: number;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 2,
  gap: 10
});

const waterfallColumns = ref<{ src: string; alt: string; content: string; loaded: boolean }[][]>([]);

const distributeItems = () => {
  if (props.items.length === 0) return;
  waterfallColumns.value = Array.from({ length: props.columns }, () => []);
  props.items.forEach((item, index) => {
    const columnIndex = index % props.columns;
    waterfallColumns.value[columnIndex].push({ ...item, loaded: true });
  });
};

watch(() => [props.items, props.columns], distributeItems, { immediate: true, deep: true });

onMounted(() => {
  distributeItems();
  setupIntersectionObserver(); // 观察者在此调用
});

onUnmounted(() => {
  waterfallColumns.value = [];
});

const handleImageLoad = (item: { src: string; alt: string; content: string; loaded: boolean }) => {
  console.log(`Image loaded: ${item.src}`);
  if (item.loaded) return;
  item.loaded = true;
};

const observedImages = new Set(); // 跟踪已观察的图片元素

const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const img = entry.target as HTMLImageElement;

        if (observedImages.has(img)) {
          return;
        }

        const dataSrc = img.dataset.src;
        if (entry.isIntersecting && dataSrc) {
          observedImages.add(img);
          img.src = dataSrc;

          const done = () => {
            handleImageLoad(getWaterfallItemFromImage(img));
            observer.unobserve(img);
            observedImages.delete(img);
          };

          if (img.complete) {
            done();
          } else {
            img.onload = img.onerror = done;
          }
        }
      });
    },
    { rootMargin: '0px 0px 100px 0px' }
  );

  document.querySelectorAll('.waterfall-image').forEach((img) => {
    if (img instanceof HTMLImageElement && !img.src && !observedImages.has(img)) {
      observer.observe(img);
    }
  });
};

function getWaterfallItemFromImage(img: HTMLImageElement): {
  src: string;
  alt: string;
  content: string;
  loaded: boolean;
} {
  const itemIndex = Array.from(document.querySelectorAll('.waterfall-image')).indexOf(img);
  const columnIndex = Math.floor(itemIndex / Math.ceil(props.items.length / props.columns));
  return waterfallColumns.value[columnIndex][itemIndex % Math.ceil(props.items.length / props.columns)];
}
</script>

<style scoped>
.waterfall-container {
  display: flex;
  justify-content: space-between;
}

.waterfall-column {
  flex: 1;
}

.waterfall-item {
  margin-bottom: 10px;
}

.waterfall-image {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.3s;
}

.waterfall-image[src] {
  opacity: 1;
}

.loading-animation {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  animation: loading 1s infinite;
}

@keyframes loading {
  0% {
    background: #f0f0f0;
  }

  50% {
    background: #e0e0e0;
  }

  100% {
    background: #f0f0f0;
  }
}

.item-content {
  padding: 10px;
  background: #fff;
}
</style>
