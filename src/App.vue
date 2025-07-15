<template>
  <div class="h-full flex-col">
    <div class="relative flex-1 overflow-auto">
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
