<template>
  <van-config-provider theme="light">
    <nav-bar />
    <router-view v-slot="{ Component, route }">
      <section class="app-wrapper">
        <transition
          appear name="fade-transform" mode="out-in" @after-enter="onTransitionFinished"
          @after-leave="onTransitionFinished"
        >
          <keep-alive :include="cacheNames">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </section>
    </router-view>
    <tab-bar />
  </van-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useRouteCacheStore from '@/stores/modules/routeCache';
import { useRouteTransition } from '@/composables/useRouteTransition';

const routeCacheStore = useRouteCacheStore();
const cacheNames = computed(() => routeCacheStore.routeCaches as string[]);

const { completeTransition } = useRouteTransition();
const onTransitionFinished = () => {
  completeTransition();
};
</script>

<style scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  padding: 20px;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
