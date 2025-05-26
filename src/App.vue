<template>
  <router-view v-slot="{ Component, route }">
    <div class="app-wrapper bg-white">
      <transition
        appear name="fade-transform" mode="out-in" @after-enter="onTransitionFinished"
        @after-leave="onTransitionFinished"
      >
        <keep-alive :include="routeCaches">
          <component :is="createComponentWrapper(Component, route)" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </div>
  </router-view>
</template>

<script setup lang="ts">
import useRouteCacheStore from '@/stores/modules/routeCache';
import { useRouteTransition } from '@/composables/useRouteTransition';
import { storeToRefs } from 'pinia';

const routeCacheStore = useRouteCacheStore();
const { routeCaches } = storeToRefs(routeCacheStore);

const { completeTransition } = useRouteTransition();
const onTransitionFinished = () => {
  completeTransition();
};

const wrapperMap = new Map();
function createComponentWrapper(component, route) {
  if (!component) return;
  const wrapperName = route.name;
  let wrapper = wrapperMap.get(wrapperName);
  if (!wrapper) {
    wrapper = { name: wrapperName, render: () => h(component) };
    wrapperMap.set(wrapperName, wrapper);
  }
  return h(wrapper);
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  > div {
    height: 100%;
  }
}
/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-0.3rem);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(0.3rem);
}
</style>
