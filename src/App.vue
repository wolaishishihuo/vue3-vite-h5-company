<template>
  <van-config-provider theme="light">
    <router-view v-slot="{ Component, route }">
      <section class="app-wrapper">
        <keep-alive :include="routeCaches">
          <component :is="createComponentWrapper(Component, route)" :key="route.fullPath" />
        </keep-alive>
      </section>
    </router-view>
  </van-config-provider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useRouteCacheStore from '@/stores/modules/routeCache';

const routeCacheStore = useRouteCacheStore();
const { routeCaches } = storeToRefs(routeCacheStore);

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

<style scoped>
.app-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  > div {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
