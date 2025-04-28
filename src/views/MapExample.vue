<template>
  <div class="map-page">
    <h1>腾讯地图功能示例</h1>
    <p class="description">
      本页面展示了腾讯地图的各种功能封装示例
    </p>

    <MapDemo />

    <div class="code-explanation">
      <h2>使用说明</h2>
      <p>项目中已封装以下地图功能模块：</p>
      <ul>
        <li><strong>useMap</strong> - 基础地图功能</li>
        <li><strong>useMarker</strong> - 标记点功能</li>
        <li><strong>useGeocoder</strong> - 地理编码/逆地理编码功能</li>
        <li><strong>usePlaceSearch</strong> - 地点搜索功能</li>
      </ul>

      <h3>使用示例</h3>
      <pre>
          import { useMap, useMarker } from '@/composables/map';

          // 在组件中使用
          const { map, initMap } = useMap('map');
          const { addMarker } = useMarker(map);

          // 初始化地图
          await initMap();

          // 添加标记点
          addMarker({
            position: { lat: 39.916527, lng: 116.397128 },
            title: '北京市中心'
          });
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapDemo from '@/views/MapDemo.vue';
</script>

<style scoped>
.map-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.description {
  color: #666;
  margin-bottom: 30px;
}

.code-explanation {
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h2 {
  color: #333;
  margin-bottom: 15px;
}

ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

li {
  margin-bottom: 8px;
}

pre {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
