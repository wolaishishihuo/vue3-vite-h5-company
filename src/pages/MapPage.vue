<template>
  <div class="map-page">
    <h1>腾讯地图示例</h1>
    <div class="map-container" id="map-container" />
    <div class="event-info">
      <h3>点击地图位置信息：</h3>
      <p>纬度：{{ clickPosition.lat }}</p>
      <p>经度：{{ clickPosition.lng }}</p>
      <p v-if="error" class="error">
        错误: {{ error }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect } from 'vue';
import { useMap } from '@/composables/map/useMap';

const {
  initialized,
  addClickListener,
  clickPosition,
  error
} = useMap('map-container', {
  initOptions: { zoom: 12 },
  autoInit: true // 开启自动初始化
});

watchEffect(async () => {
  if (initialized.value) {
    try {
      // 等待地图初始化完成
      await initialized.value;
      console.log('地图初始化完成');

      // 添加事件监听等操作
      addClickListener((position) => {
        console.log('地图点击:', position);
      });

      // 其他操作...
    } catch (err) {
      console.error('地图操作失败:', err);
    }
  }
});
</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-container {
  width: 100%;
  height: 500px;
  margin-bottom: 20px;
}

.event-info {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
