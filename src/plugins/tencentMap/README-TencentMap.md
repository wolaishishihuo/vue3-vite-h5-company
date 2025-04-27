# 腾讯地图集成指南

## 简介

本项目集成了腾讯地图SDK，提供了地图展示、标记点管理、地理编码等功能。

## 配置

1. 首先，您需要在腾讯地图开放平台 (https://lbs.qq.com/) 申请一个API密钥

2. 在项目根目录创建一个 `.env.local` 文件（该文件不会被Git跟踪），添加以下内容：

```
VITE_TENCENT_MAP_KEY=您的腾讯地图API密钥
```

## 使用方法

### 1. 使用地图组件

```vue
<template>
  <div class="map-container">
    <TencentMapComponent
      :center="{ lat: 39.916527, lng: 116.397128 }"
      :zoom="13"
      :markers="markers"
      @map-ready="onMapReady"
      @map-click="onMapClick"
      @marker-click="onMarkerClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TencentMapComponent from '@/components/TencentMapComponent.vue';

const markers = ref([
  { lat: 39.916527, lng: 116.397128, title: '北京市中心' }
]);

const onMapReady = (map) => {
  console.log('地图已加载完成', map);
};

const onMapClick = (location) => {
  console.log('点击了地图', location);
};

const onMarkerClick = ({ marker, index }) => {
  console.log('点击了标记', marker, index);
};
</script>

<style>
.map-container {
  height: 400px;
}
</style>
```

### 2. 使用 Composable

```vue
<template>
  <div class="map-container" id="myMap" />
  <button @click="addNewMarker">
    添加标记
  </button>
  <button @click="geocodeAddress">
    搜索地址
  </button>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import useTencentMap from '@/composables/useTencentMap';

const address = ref('北京市朝阳区');

// 初始化地图
const {
  map,
  isLoaded,
  addMarker,
  setCenter,
  addressToLocation,
  locationToAddress,
  initMap
} = useTencentMap('myMap');

onMounted(async () => {
  // 初始化地图
  await initMap();

  // 添加一个标记
  addMarker({
    position: { lat: 39.916527, lng: 116.397128 },
    title: '默认标记'
  });
});

// 添加新标记
const addNewMarker = () => {
  if (isLoaded.value) {
    addMarker({
      position: { lat: 39.916527 + Math.random() * 0.01, lng: 116.397128 + Math.random() * 0.01 },
      title: '新标记点'
    });
  }
};

// 地理编码示例
const geocodeAddress = async () => {
  try {
    // 地址转坐标
    const location = await addressToLocation(address.value);
    console.log('地址对应的坐标:', location);

    // 设置地图中心点
    setCenter(location);

    // 添加标记
    addMarker({
      position: location,
      title: address.value
    });
  } catch (error) {
    console.error('地理编码失败:', error);
  }
};
</script>
```

## 接口文档

### TencentMapComponent Props

| 属性名  | 类型   | 默认值                                | 说明               |
| ------- | ------ | ------------------------------------- | ------------------ |
| center  | Object | `{ lat: 39.916527, lng: 116.397128 }` | 地图中心点         |
| zoom    | Number | 13                                    | 地图缩放级别(3-20) |
| markers | Array  | []                                    | 标记点数组         |
| options | Object | {}                                    | 其他地图配置项     |

### TencentMapComponent Events

| 事件名      | 说明         | 参数                   |
| ----------- | ------------ | ---------------------- |
| mapReady    | 地图加载完成 | map: 地图实例          |
| mapClick    | 点击地图     | location: { lat, lng } |
| markerClick | 点击标记点   | { marker, index }      |

### TencentMapComponent 方法

通过 ref 可以访问以下方法：

| 方法名    | 参数            | 说明               |
| --------- | --------------- | ------------------ |
| getMap    | -               | 获取地图实例       |
| panTo     | (lat, lng)      | 平滑移动到指定位置 |
| addMarker | (markerOptions) | 添加标记点         |

### useTencentMap Composable

| 返回值            | 类型                                      | 说明             |
| ----------------- | ----------------------------------------- | ---------------- |
| map               | Ref\<any\>                                | 地图实例         |
| isLoaded          | Ref\<boolean\>                            | 地图是否已加载   |
| isLoading         | Ref\<boolean\>                            | 地图是否正在加载 |
| currentCenter     | Ref\<Position\>                           | 当前地图中心点   |
| currentZoom       | Ref\<number\>                             | 当前缩放级别     |
| markers           | Ref\<any[]\>                              | 标记点数组       |
| initMap           | (options?) => Promise\<boolean\>          | 初始化地图       |
| addMarker         | (options: MarkerOptions) => any           | 添加标记点       |
| clearMarkers      | () => void                                | 清除所有标记点   |
| setCenter         | (position: Position) => void              | 设置地图中心点   |
| setZoom           | (zoom: number) => void                    | 设置缩放级别     |
| addressToLocation | (address: string) => Promise\<Position\>  | 地址转坐标       |
| locationToAddress | (position: Position) => Promise\<string\> | 坐标转地址       |

## 注意事项

1. 确保设置容器元素的高度，否则地图可能不显示
2. 本地开发时请使用HTTPS或localhost环境，部分浏览器在非安全环境下会限制地理位置等功能
3. 在生产环境使用时，请注意API密钥的安全性，建议通过后端接口获取或设置使用域名限制
