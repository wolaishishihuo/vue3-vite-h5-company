/**
 * 腾讯地图默认配置，适配移动端
 * https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap
 */
export const mapDefaultConfig = {
  // 地图中心点
  center: { lat: 39.916527, lng: 116.397128 },
  // 缩放级别设置
  zoom: 14,
  minZoom: 10,
  maxZoom: 20,
  pitch: 30,
  rotation: 0,
  scale: 1,
  // 偏移设置
  offset: { x: 0, y: 0 },
  // 交互控制
  cursor: 'pointer',
  draggable: true,
  scrollable: true,
  rotatable: false,
  pitchable: false,
  touchZoomable: true,
  doubleClickZoom: false,
  // 边界限制（可选）
  boundary: null,
  // 控件显示
  showControl: false,
  // 底图配置
  baseMap: {
    type: 'vector',
    features: ['base', 'building2d', 'point', 'label']
  },
  // 渲染配置
  renderOptions: {
    preserveDrawingBuffer: true
  },
  // 掩膜配置（可选）
  clip: null
};
