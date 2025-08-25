<template>
  <div class="flex-col gap-20px p-20px">
    <h1 class="text-center">
      Demo 示例
    </h1>

    <template v-for="item in list" :key="item.path">
      <Cell v-if="item.path" :title="item.title" :path="item.path" />
      <Cell v-else :title="item.title" @click="handleClick" />
    </template>
  </div>
</template>

<script setup lang='tsx'>
import { popupManager } from '@/composables/usePopup';
import Cell from './components/Cell.vue';

const list = [
  {
    title: '弹窗'
  },
  {
    title: '宽高比示例',
    path: '/demo/aspectRatio'
  },
  {
    title: '树形表格',
    path: '/demo/tableTree'
  },
  {
    title: '定位按钮',
    path: '/demo/locationButton'
  },
  {
    title: '表格滚动列表',
    path: '/demo/tableScrollList'
  },
  {
    title: '人员组织',
    path: '/organization'
  },
  {
    title: '人像抓拍',
    path: '/demo/faceCamera'
  },
  {
    title: '人脸识别',
    path: '/demo/faceRecognition'
  },
  {
    title: '图表',
    path: '/demo/chart'
  },
  {
    title: 'PDF',
    path: '/demo/pdf'
  },
  {
    title: '文章卡片',
    path: '/demo/articleCard'
  }
];

const handleClick = () => {
  popupManager.create({
    title: '标题',
    content: () => (
      <div>
        <p>内容</p>
      </div>
    )
  });
};
</script>
