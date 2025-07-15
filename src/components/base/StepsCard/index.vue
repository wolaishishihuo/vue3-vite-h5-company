<template>
  <div class="flex-x-center mb-10px pb-30px">
    <!-- 左侧时间轴 -->
    <div class="relative mt-15px w-30px flex justify-center">
      <!-- 点和线的容器 -->
      <div class="flex flex-col items-center">
        <!-- 双点结构 -->
        <div class="relative">
          <!-- 外层大点 -->
          <div class="h-21px w-21px rounded-full bg-#4873C1 opacity-23" />
          <!-- 内层小点 -->
          <div class="absolute left-50% top-50% h-8px w-8px translate-x--50% translate-y--50% rounded-full bg-#4873C1" />
        </div>

        <!-- 连接线 -->
        <div
          v-if="hasBodyContent"
          class="mt-0 w-1px border-l border-#4873C1 border-dashed"
          :class="[bodyHeight > 0 ? 'h-full' : 'h-0']"
        />
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="ml-34px flex-1">
      <!-- 头部内容 -->
      <div v-if="slots.header" class="flex items-center">
        <slot name="header" />
      </div>

      <!-- 内容区域 -->
      <div v-if="slots.default" ref="bodyRef" class="mt-15px pl-5px">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, onUpdated, ref, useSlots } from 'vue';

defineOptions({
  name: 'StepsCard'
});

const slots = useSlots();
const hasBodyContent = computed(() => !!slots.default);

const bodyRef = ref<HTMLElement | null>(null);
const bodyHeight = ref(0);

const updateHeight = () => {
  if (bodyRef.value) {
    bodyHeight.value = bodyRef.value.offsetHeight;
  }
};

onMounted(updateHeight);
onUpdated(updateHeight);
</script>
