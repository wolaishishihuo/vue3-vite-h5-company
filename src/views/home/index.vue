<template>
  <div class="p-20px flex-col gap-20px">
    <template v-for="item in list" :key="item.path">
      <Cell :title="item.title" :path="item.path" />
    </template>
  </div>
</template>

<script setup lang='ts'>
import Cell from './components/Cell.vue';

const list = [
  {
    title: '树形表格',
    path: '/demo/tableTree'
  },
  {
    title: '下拉刷新',
    path: '/demo/pullDownRefresh'
  },
  {
    title: '定位按钮',
    path: '/demo/locationButton'
  }
];
</script>
