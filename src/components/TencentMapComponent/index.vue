<template>
  <div class="map-container">
    <div id="tencent-map" class="map-content" />
    <div v-if="selectedPosition" class="map-info">
      <p>已选择位置：</p>
      <p>经度：{{ selectedPosition.lng }}</p>
      <p>纬度：{{ selectedPosition.lat }}</p>
    </div>
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner" />
      <p>地图加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import tencentMap from '@/plugins/tencentMap';

// 定义props
interface Props {
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultCenter: () => ({
    lat: 39.916527,
    lng: 116.397128
  }),
  zoom: 13,
  clickable: true
});

// 定义事件
const emit = defineEmits(['positionChange']);

// 状态
const mapLoaded = ref(false);
const loading = ref(false);
const selectedPosition = ref<{ lat: number; lng: number } | null>(null);

// 初始化地图
const initMap = async () => {
  try {
    loading.value = true;

    // 初始化地图实例
    tencentMap.initMap('tencent-map', {
      zoom: props.zoom
    });

    // 添加默认标记点
    tencentMap.addMarker(props.defaultCenter);

    // 更新当前选中位置
    selectedPosition.value = props.defaultCenter;

    // 如果允许点击选点，启用选点功能
    if (props.clickable) {
      tencentMap.enableClickSelect((position) => {
        selectedPosition.value = position;
        emit('positionChange', position);
      });
    }

    mapLoaded.value = true;
  } catch (error) {
    console.error('地图初始化失败:', error);
  } finally {
    loading.value = false;
  }
};

// 公开给父组件的方法
const updatePosition = (position: { lat: number; lng: number }) => {
  if (!mapLoaded.value) return;

  tencentMap.updateMarkerPosition(position);
  selectedPosition.value = position;
};

// 获取当前选中的位置
const getCurrentPosition = () => {
  if (!mapLoaded.value) return null;
  return tencentMap.getMarkerPosition();
};

// 暴露方法给父组件
defineExpose({
  updatePosition,
  getCurrentPosition
});

// 生命周期
onMounted(() => {
  initMap();
});

onUnmounted(() => {
  // 清理地图事件监听
  if (mapLoaded.value && props.clickable) {
    tencentMap.disableClickSelect();
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.map-content {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.map-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  font-size: 14px;
}

.map-info p {
  margin: 5px 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
