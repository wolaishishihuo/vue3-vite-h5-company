<template>
  <div class="map-page">
    <div class="layout-container">
      <div class="map-section">
        <div id="map" class="map" />
      </div>
      <div class="control-section">
        <div class="panel-card">
          <h3 class="panel-title">
            地图工具
          </h3>
          <div class="search-box">
            <input v-model="searchKeyword" placeholder="搜索地点" @keyup.enter="searchPlaces">
            <button @click.stop="searchPlaces" :disabled="isSearching">
              {{ isSearching ? '搜索中...' : '搜索' }}
            </button>
          </div>

          <div v-if="places.length > 0" class="search-results">
            <div
              v-for="(place, index) in places"
              :key="index"
              class="search-item"
              @click="selectPlace(place)"
            >
              {{ place.title }}
            </div>
          </div>

          <div class="tool-panel">
            <button @click.stop="drawMode = 'marker'" :class="{ active: drawMode === 'marker' }">
              标记点
            </button>
            <button @click.stop="clearAll">
              清除所有
            </button>
          </div>

          <div v-if="drawMode === 'polyline' || drawMode === 'polygon'" class="drawing-hint">
            点击地图添加点，双击结束绘制
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { TencentMap } from '@/plugins/tencentMap';
import type { TMap } from '@/types/TMap';
import { useGeocoder, useMap, useMarker, usePlaceSearch } from '@/composables/map';

// 初始化地图
const { map, addEventListener } = useMap('map');

// 初始化各功能模块
const { addMarker, removeAllMarkers } = useMarker(map);
const { searchPlaces: searchPlacesApi, searchResults, isLoading: isSearching } = usePlaceSearch();
const { reverseGeocode } = useGeocoder();

// 状态变量
const searchKeyword = ref('');
const places = ref<any[]>([]);
const drawMode = ref<'marker' | 'polyline' | 'polygon' | null>('marker');
const drawingPoints = ref<TMap.LatLng[]>([]);
const isDrawing = ref(false);

// 搜索地点
const searchPlaces = async () => {
  if (!searchKeyword.value || isSearching.value) return;

  try {
    await searchPlacesApi(searchKeyword.value, map.value.getBounds());
    places.value = searchResults.value;
  } catch (err) {
    console.error('搜索失败:', err);
  }
};

// 选择地点
const selectPlace = (place: any) => {
  if (!place.location || !map.value) return;

  // 清除之前的标记
  removeAllMarkers();

  // 添加新标记
  addMarker({
    position: {
      lat: place.location.lat,
      lng: place.location.lng
    },
    title: place.title
  });

  // 移动地图到选中位置
  const TMapSDK = TencentMap.getTMapSDK();
  map.value.panTo(new TMapSDK.LatLng(
    place.location.lat,
    place.location.lng
  ));

  // 清空搜索结果
  places.value = [];
};

// 处理地图点击事件
const handleMapClick = async (position: TMap.LatLng) => {
  // 添加标记点
  addMarker({ position });
  // 显示地址信息
  try {
    const addressInfo = await reverseGeocode(position);
    if (addressInfo) {
      console.log('点击位置地址:', addressInfo.address);
    }
  } catch (err) {
    console.error('获取地址信息失败:', err);
  }
};

// 清除所有图形
const clearAll = () => {
  removeAllMarkers();
  drawingPoints.value = [];
  isDrawing.value = false;
};

// 初始化
onMounted(async () => {
  if (map.value) {
    // 添加点击监听
    addEventListener('click', (pos) => {
      handleMapClick(pos.latLng);
    });
  }
});
</script>

<style scoped>
.map-page {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.layout-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  height: 600px;
}

.map-section {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
}

.control-section {
  width: 300px;
}

.panel-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  box-sizing: border-box;
}

.panel-title {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.search-box {
  display: flex;
  margin-bottom: 15px;
}

.search-box input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-box button {
  padding: 10px 15px;
  background-color: #3777ff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.search-box button:hover {
  background-color: #2a60d6;
}

.search-box button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.search-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-item:last-child {
  border-bottom: none;
}

.search-item:hover {
  background-color: #f5f5f5;
}

.tool-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.tool-panel button {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 80px;
}

.tool-panel button:hover {
  background-color: #e8e8e8;
}

.tool-panel button.active {
  background-color: #3777ff;
  color: white;
  border-color: #3777ff;
}

.drawing-hint {
  font-size: 13px;
  color: #666;
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
    height: auto;
  }

  .map-section {
    height: 400px;
  }

  .control-section {
    width: 100%;
  }
}
</style>
