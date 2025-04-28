<template>
  <div class="map-container">
    <div id="map" class="map" />
    <div class="control-panel">
      <div class="search-box">
        <input v-model="searchKeyword" placeholder="搜索地点" @keyup.enter="searchPlaces">
        <button @click="searchPlaces" :disabled="isSearching">
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
        <button @click="drawMode = 'marker'" :class="{ active: drawMode === 'marker' }">
          标记点
        </button>
        <button @click="clearAll">
          清除所有
        </button>
      </div>

      <div v-if="drawMode === 'polyline' || drawMode === 'polygon'" class="drawing-hint">
        点击地图添加点，双击结束绘制
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { TencentMap } from '@/plugins/tencentMap';
import { useMap } from '@/composables/map/useMap';
import { useMarker } from '@/composables/map/useMarker';
import { usePlaceSearch } from '@/composables/map/usePlaceSearch';
import { useGeocoder } from '@/composables/map/useGeocoder';
import type { TMap } from '@/types/TMap';

// 初始化地图
const { map } = useMap('map');

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
    await searchPlacesApi(searchKeyword.value);
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
  if (!drawMode.value) return;

  if (drawMode.value === 'marker') {
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
    map.value.on('click', (evt: any) => {
      const pos = {
        lat: evt.latLng.lat,
        lng: evt.latLng.lng
      };
      handleMapClick(pos);
    });
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.map {
  width: 100%;
  height: 100%;
}

.control-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.search-box {
  display: flex;
  margin-bottom: 10px;
}

.search-box input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.search-box button {
  padding: 8px 12px;
  background-color: #3777ff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-box button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.search-item {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.search-item:hover {
  background-color: #f5f5f5;
}

.tool-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
  z-index: 1000;
}

.tool-panel button {
  padding: 6px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.tool-panel button.active {
  background-color: #3777ff;
  color: white;
  border-color: #3777ff;
}

.drawing-hint {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
}
</style>
