<template>
  <van-tabbar v-if="show" v-model="active" placeholder route>
    <van-tabbar-item replace to="/">
      首页
      <template #icon>
        <div class="i-carbon:home" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/profile">
      我的
      <template #icon>
        <div class="i-carbon:user" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { routeWhiteList } from '@/config/routes';

const active = ref(0);
const route = useRoute();

const show = computed(() => route.name && routeWhiteList.includes(route.name as string));
</script>
