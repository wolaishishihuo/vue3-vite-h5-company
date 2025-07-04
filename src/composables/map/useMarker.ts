import TencentMapSDK from '@/plugins/tencentMap';

// 标记点选项接口
interface MarkerOptions {
  position: TMap.LatLng;
  icon?: string;
  title?: string;
  draggable?: boolean;
  zIndex?: number;
}

const useMarker = (mapInstance: Ref<any>) => {
  const markers = shallowRef<any[]>([]);
  const TMapSDK = TencentMapSDK.getTMapSDK();

  // 默认样式
  const createDefaultStyle = (icon?: string) => {
    return new TMapSDK.MarkerStyle({
      width: 25,
      height: 35,
      anchor: { x: 12, y: 35 },
      src: icon || 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png'
    });
  };

  // 几何点
  const createGeometry = (position: TMap.LatLng, title?: string, index: number = 0) => {
    return {
      id: `point_${Date.now()}_${index}`,
      styleId: 'default',
      position: new TMapSDK.LatLng(position.lat, position.lng),
      properties: {
        title: title || ''
      }
    };
  };

  /**
   * 添加标记点
   */
  const addMarker = (options: MarkerOptions) => {
    try {
      if (!mapInstance.value) {
        return null;
      }

      const marker = new TMapSDK.MultiMarker({
        id: `marker_${Date.now()}`,
        map: mapInstance.value,
        zIndex: options.zIndex || 100,
        styles: {
          default: createDefaultStyle(options.icon)
        },
        geometries: [createGeometry(options.position, options.title)]
      });

      markers.value.push(marker);
      return marker;
    } catch {
      return null;
    }
  };

  /**
   * 批量添加标记点
   */
  const addMarkers = (markersList: MarkerOptions[]) => {
    try {
      if (!mapInstance.value) {
        return null;
      }

      // 创建几何点数据数组
      const geometries = markersList.map((item, index) =>
        createGeometry(item.position, item.title, index)
      );

      // 创建一个 MultiMarker 实例
      const marker = new TMapSDK.MultiMarker({
        id: `marker_group_${Date.now()}`,
        map: mapInstance.value,
        zIndex: markersList[0]?.zIndex || 100,
        styles: {
          default: createDefaultStyle(markersList[0]?.icon)
        },
        geometries
      });

      markers.value.push(marker);
      return marker;
    } catch {
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
    addMarker,
    addMarkers,
    removeMarker,
    removeAllMarkers
  };
};
export default useMarker;
