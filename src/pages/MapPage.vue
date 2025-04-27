<!-- 腾讯地图示例页面 -->
<template>
  <div class="map-page">
    <h1 class="page-title">
      腾讯地图选点示例
    </h1>

    <div class="map-wrapper">
      <TencentMapComponent
        ref="mapComponent"
        :default-center="defaultCenter"
        :zoom="15"
        :clickable="true"
        @position-change="handlePositionChange"
      />
    </div>

    <div class="position-info">
      <h3>已选择位置信息</h3>
      <div v-if="currentPosition">
        <p>经度：{{ currentPosition.lng }}</p>
        <p>纬度：{{ currentPosition.lat }}</p>
        <button class="confirm-btn" @click="confirmPosition">
          确认选择
        </button>
      </div>
      <div v-else>
        <p>请点击地图选择位置</p>
      </div>
    </div>

    <!-- 确认消息提示 -->
    <div v-if="showConfirmMessage" class="confirm-message">
      <div class="confirm-message-content">
        <p>已确认位置: ({{ confirmPositionText }})</p>
        <button @click="showConfirmMessage = false">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TencentMapComponent from '@/components/TencentMapComponent/index.vue';

// 默认中心点（北京天安门）
const defaultCenter = {
  lat: 39.908823,
  lng: 116.397470
};

// 当前选中的位置
const currentPosition = ref<{ lat: number; lng: number } | null>(null);
const mapComponent = ref<InstanceType<typeof TencentMapComponent> | null>(null);

// 确认提示相关
const showConfirmMessage = ref(false);
const confirmPositionText = ref('');

// 处理位置变化
const handlePositionChange = (position: { lat: number; lng: number }) => {
  currentPosition.value = position;
  console.log('位置已更新:', position);
};

// 确认选择位置
const confirmPosition = () => {
  if (!currentPosition.value) return;

  // 这里可以处理位置确认后的逻辑
  // 例如：发送到服务器、保存到本地存储等
  console.log('确认选择位置:', currentPosition.value);

  // 显示确认信息
  confirmPositionText.value = `${currentPosition.value.lat}, ${currentPosition.value.lng}`;
  showConfirmMessage.value = true;
};

// 可以在此处添加其他业务逻辑，如地址解析等
</script>

<style scoped>
.map-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.map-wrapper {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.position-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.confirm-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #1989fa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn:hover {
  background-color: #0076e4;
}

/* 确认消息样式 */
.confirm-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-message-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.confirm-message-content button {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #1989fa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
