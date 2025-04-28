import { ref, shallowRef } from 'vue';
import type { Ref } from 'vue';
import { TencentMap } from '@/plugins/tencentMap';
import type { TMap } from '@/types/TMap';

export function useMarker(mapInstance?: Ref<any>) {
  const markers = shallowRef<any[]>([]);
  const error = ref<string | null>(null);

  /**
   * 添加标记点
   */
  const addMarker = (options: {
    position: TMap.LatLng;
    icon?: string;
    title?: string;
    draggable?: boolean;
    zIndex?: number;
    map?: any;
  }) => {
    if (!mapInstance?.value && !options.map) {
      error.value = '地图实例未提供';
      return null;
    }

    try {
      const TMapSDK = TencentMap.getTMapSDK();
      const uniqueId = `marker_${Date.now()}`;

      const marker = new TMapSDK.MultiMarker({
        id: uniqueId,
        map: options.map || mapInstance?.value,
        zIndex: options.zIndex || 100,
        styles: {
          // 定义样式
          default: new TMapSDK.MarkerStyle({
            width: 25,
            height: 35,
            anchor: { x: 12, y: 35 },
            src: options.icon || 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png'
          })
        },
        geometries: [
          {
            id: `point_${Date.now()}`,
            styleId: 'default',
            position: new TMapSDK.LatLng(options.position.lat, options.position.lng),
            properties: {
              title: options.title || ''
            }
          }
        ]
      });

      markers.value.push(marker);
      return marker;
    } catch (err: any) {
      error.value = err.message || '创建标记点失败';
      return null;
    }
  };

  /**
   * 批量添加标记点
   */
  const addMarkers = (markersList: Array<{
    position: TMap.LatLng;
    icon?: string;
    title?: string;
    draggable?: boolean;
    zIndex?: number;
  }>, map?: any) => {
    if (!mapInstance?.value && !map) {
      error.value = '地图实例未提供';
      return null;
    }

    try {
      const TMapSDK = TencentMap.getTMapSDK();

      // 创建几何点数据数组
      const geometries = markersList.map((item, index) => ({
        id: `point_${Date.now()}_${index}`,
        styleId: 'default',
        position: new TMapSDK.LatLng(item.position.lat, item.position.lng),
        properties: {
          title: item.title || ''
        }
      }));

      // 创建一个 MultiMarker 实例
      const marker = new TMapSDK.MultiMarker({
        id: `marker_group_${Date.now()}`,
        map: map || mapInstance?.value,
        zIndex: markersList[0]?.zIndex || 100,
        styles: {
          default: new TMapSDK.MarkerStyle({
            width: 25,
            height: 35,
            anchor: { x: 12, y: 35 },
            src: markersList[0]?.icon || 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png'
          })
        },
        geometries
      });

      markers.value.push(marker);
      return marker;
    } catch (err: any) {
      error.value = err.message || '批量创建标记点失败';
      return null;
    }
  };

  /**
   * 移除标记点
   */
  const removeMarker = (marker: any) => {
    if (!marker) return;

    marker.setMap(null);
    markers.value = markers.value.filter(m => m !== marker);
  };

  /**
   * 移除所有标记点
   */
  const removeAllMarkers = () => {
    markers.value.forEach(marker => marker.setMap(null));
    markers.value = [];
  };

  return {
    markers,
    error,
    addMarker,
    addMarkers,
    removeMarker,
    removeAllMarkers
  };
}
