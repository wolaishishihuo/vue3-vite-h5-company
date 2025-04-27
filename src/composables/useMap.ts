import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { isSDKLoaded, TencentMap } from '@/plugins/tencentMap';
import type { TMap } from '@/types/TMap';

/**
 * 地图Hook - 用于封装地图初始化和事件处理
 * @param mapContainerId 地图容器元素ID
 * @param options 地图初始化选项
 */
export function useMap(mapContainerId: string, options?: {
  initOptions?: TMap.MapOptions;
  autoInit?: boolean;
}) {
  // 地图实例
  const map = shallowRef<any>(null);
  // 点击位置
  const clickPosition = ref<TMap.LatLng>({ lat: 0, lng: 0 });
  // 错误信息
  const error = ref<string | null>(null);
  // 点击事件处理函数
  let clickHandler: ((event: any) => void) | null = null;
  // 初始化完成的Promise
  const initialized = ref<Promise<any> | null>(null);

  /**
   * 初始化地图
   */
  const initMap = (initOptions?: TMap.MapOptions): Promise<any> => {
    // 创建新的初始化Promise
    const initPromise = new Promise((resolve, reject) => {
      if (!isSDKLoaded.value) {
        const err = '地图SDK尚未加载，请确保已调用TencentMap.init()';
        error.value = err;
        reject(new Error(err));
        return;
      }

      try {
        // 获取地图容器元素
        const container = document.getElementById(mapContainerId);
        if (!container) {
          const err = `找不到地图容器元素: ${mapContainerId}`;
          error.value = err;
          reject(new Error(err));
          return;
        }

        // 获取SDK实例
        const TMapSDK = TencentMap.getTMapSDK();

        // 默认选项
        const defaultOptions: TMap.MapOptions = {
          center: new TMapSDK.LatLng(39.916527, 116.397128), // 默认北京中心
          zoom: 13
        };

        // 合并配置
        const mergedOptions = { ...defaultOptions, ...options?.initOptions, ...initOptions };

        // 创建地图实例
        map.value = new TMapSDK.Map(container, mergedOptions);

        resolve(map.value);
      } catch (err: any) {
        error.value = err.message || '地图初始化失败';
        reject(err);
      }
    });
    // 保存初始化Promise
    initialized.value = initPromise;
    return initPromise;
  };

  /**
   * 添加点击事件监听
   * @param callback 点击事件回调函数，不传则使用默认处理逻辑
   */
  const addClickListener = (callback?: (position: TMap.LatLng, event: any) => void) => {
    if (!map.value) {
      error.value = '地图尚未初始化，请先调用initMap()';
      return;
    }

    // 移除已有的点击事件
    removeClickListener();

    // 创建点击事件处理函数
    clickHandler = (evt: any) => {
      const position = {
        lat: evt.latLng.lat,
        lng: evt.latLng.lng
      };

      // 更新点击位置
      clickPosition.value = position;

      // 如果有自定义回调，则调用
      if (callback) {
        callback(position, evt);
      }
    };

    // 添加点击事件监听
    map.value.on('click', clickHandler);
  };

  /**
   * 移除点击事件监听
   */
  const removeClickListener = () => {
    if (!map.value || !clickHandler) {
      return;
    }

    // 移除点击事件监听
    map.value.off('click', clickHandler);
    clickHandler = null;
  };

  // 在组件挂载时自动初始化地图
  onMounted(async () => {
    if (options?.autoInit !== false) {
      try {
        await initMap();
      } catch (err) {
        console.error('地图自动初始化失败:', err);
      }
    }
  });

  // 在组件卸载时清理资源
  onUnmounted(() => {
    removeClickListener();
    // 腾讯地图没有提供destroy方法，置空引用
    map.value = null;
  });

  return {
    map,
    clickPosition,
    error,
    initMap,
    addClickListener,
    removeClickListener,
    initialized
  };
}
