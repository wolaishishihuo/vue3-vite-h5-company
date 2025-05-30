<template>
  <div class="flex-col h-full">
    <nav-bar />
    <div class="flex-1 relative overflow-auto">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="routeCaches">
          <component :is="createComponentWrapper(Component, route)" :key="route.fullPath" />
        </keep-alive>
      </router-view>
    </div>
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import useRouteCacheStore from '@/stores/modules/routeCache';
import { storeToRefs } from 'pinia';

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
