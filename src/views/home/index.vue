<template>
  <div class="p-20px flex-col gap-20px">
    <h1 class="text-center">
      Demo 示例
    </h1>

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
  },
  {
    title: '地图定位',
    path: '/demo/mapLocation'
  },
  {
    title: '表格滚动列表',
    path: '/demo/tableScrollList'
  },
  {
    title: '人员组织',
    path: '/organization'
  }
];
</script>
