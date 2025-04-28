import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { isSDKLoaded, TencentMap } from '@/plugins/tencentMap';
import type { TMap } from '@/types/TMap';
import { mapDefaultConfig } from '@/config/tencentMap';

// 定义支持的地图事件类型
type MapEventType = 'click' | 'dblclick' | 'rightclick' | 'mousemove' | 'dragstart' | 'drag' | 'dragend' | 'zoom_changed';

// 事件处理函数类型
type EventHandler = (event: any) => void;

/**
 * 地图Hook - 用于封装地图初始化和事件处理
 * @param mapContainerId 地图容器元素ID
 * @param options 地图初始化选项
 */
export function useMap(mapContainerId: string, options?: {
  initOptions?: TMap.MapOptions;
  autoInit?: boolean;
}) {
  // 地图实例 - 使用any替代TMap.Map以避免类型错误
  const map = shallowRef<any>(null);
  // 点击位置
  const clickPosition = ref<TMap.LatLng>({ lat: 0, lng: 0 });
  // 错误信息
  const error = ref<string | null>(null);
  // 加载状态
  const isLoading = ref(false);
  // 事件处理器存储
  const eventHandlers = new Map<string, EventHandler>();
  // 初始化完成的Promise
  const initialized = ref<Promise<any> | null>(null);

  /**
   * 初始化地图
   */
  const initMap = (initOptions?: TMap.MapOptions): Promise<any> => {
    isLoading.value = true;

    // 创建新的初始化Promise
    const initPromise = new Promise<any>((resolve, reject) => {
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

        // 确保参数合并优先级：默认配置 < 组件选项 < 方法参数
        const mergedOptions = {
          ...mapDefaultConfig,
          ...options?.initOptions,
          ...initOptions
        };

        // 创建地图实例
        map.value = new TMapSDK.Map(container, mergedOptions);

        resolve(map.value);
      } catch (err: any) {
        error.value = err.message || '地图初始化失败';
        reject(err);
      }
    }).finally(() => {
      isLoading.value = false;
    });

    // 保存初始化Promise
    initialized.value = initPromise;
    return initPromise;
  };

  /**
   * 添加事件监听
   * @param eventType 事件类型
   * @param callback 事件回调函数
   */
  const addEventListener = <T extends MapEventType>(
    eventType: T,
    callback: EventHandler
  ): void => {
    if (!map.value) {
      error.value = '地图尚未初始化，请先调用initMap()';
      return;
    }

    // 移除已有的同类型事件
    removeEventListener(eventType);

    // 保存处理函数引用
    eventHandlers.set(eventType, callback);

    // 添加事件监听
    map.value.on(eventType, callback);
  };

  /**
   * 移除事件监听
   * @param eventType 事件类型
   */
  const removeEventListener = (eventType: string): void => {
    if (!map.value || !eventHandlers.has(eventType)) {
      return;
    }

    const handler = eventHandlers.get(eventType);
    if (handler) {
      map.value.off(eventType, handler);
      eventHandlers.delete(eventType);
    }
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
    // 清理所有事件
    eventHandlers.forEach((handler, eventType) => {
      map.value?.off(eventType, handler);
    });
    eventHandlers.clear();

    // 腾讯地图没有提供destroy方法，置空引用
    map.value = null;
  });

  return {
    map,
    clickPosition,
    error,
    isLoading,
    initMap,
    addEventListener,
    removeEventListener,
    initialized
  };
}
