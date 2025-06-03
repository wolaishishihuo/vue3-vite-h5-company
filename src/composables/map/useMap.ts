import type { TMap } from '@/types/TMap';
import { mapDefaultConfig } from '@/config/tencentMap';
import TencentMapSDK from '@/plugins/tencentMap';

/**
 * 地图Hook - 封装地图初始化
 * @param mapContainerId 地图容器元素ID
 * @param initOptions 地图初始化选项
 * @param autoInit 是否自动初始化地图
 */

const useMap = (
  mapContainerId: string,
  initOptions?: TMap.MapOptions,
  autoInit = true
) => {
  // 地图实例
  const map = shallowRef<any>(null);
  // 加载状态
  const isLoading = ref(false);

  /**
   * 初始化地图
   */
  const initMap = (): Promise<any> => {
    // 已初始化则直接返回
    if (map.value) return Promise.resolve(map.value);

    isLoading.value = true;

    return new Promise<any>((resolve, reject) => {
      try {
        // 检查SDK是否已初始化
        if (!TencentMapSDK.isInitialized()) {
          throw new Error('地图SDK尚未加载，请确保已调用TencentMap.init()');
        }

        // 获取容器元素
        const container = document.getElementById(mapContainerId);
        if (!container) {
          throw new Error(`找不到地图容器元素: ${mapContainerId}`);
        }

        // 合并配置
        const options = {
          ...mapDefaultConfig,
          ...initOptions
        };

        // 创建地图实例
        const TMapSDK = TencentMapSDK.getTMapSDK();
        map.value = new TMapSDK.Map(container, options);
        resolve(map.value);
      } catch (err: any) {
        reject(err);
      } finally {
        isLoading.value = false;
      }
    });
  };

  // 在组件挂载时自动初始化地图
  onMounted(() => {
    if (autoInit) {
      initMap().catch(err => console.error('地图自动初始化失败:', err));
    }
  });

  // 在组件卸载时清理资源
  onUnmounted(() => {
    map.value = null;
  });

  return {
    map,
    isLoading,
    initMap
  };
};

export default useMap;
