<template>
  <van-config-provider theme="light">
    <nav-bar />
    <router-view v-slot="{ Component }">
      <section class="app-wrapper">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" />
        </keep-alive>
      </section>
    </router-view>
    <tab-bar />
  </van-config-provider>
</template>

<script setup lang="ts">
import useRouteCache from '@/stores/modules/routeCache';
import weChatSDK from '@/plugins/weChat';

const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[];
});

onMounted(() => {
  // 初始化微信SDK
  weChatSDK.init();
});
</script>

<style scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  padding: 16px;
}
</style>
