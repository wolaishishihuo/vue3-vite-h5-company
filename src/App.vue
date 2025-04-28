<template>
  <van-config-provider theme="light">
    <nav-bar />
    <router-view v-slot="{ Component }">
      <section class="app-wrapper">
        <transition appear name="fade-transform" mode="out-in">
          <keep-alive :include="keepAliveRouteNames">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </section>
    </router-view>
    <tab-bar />
  </van-config-provider>
</template>

<script setup lang="ts">
import useRouteCache from '@/stores/modules/routeCache';

const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[];
});
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
