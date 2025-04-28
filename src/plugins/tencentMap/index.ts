import { TENCENT_MAP_KEY } from '@/constants';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { loadScript } from '@/utils';

// 全局状态，记录SDK是否已加载
const isSDKLoaded: Ref<boolean> = ref(false);
const isSDKLoading: Ref<boolean> = ref(false);

/**
 * 腾讯地图 TMap GL 封装类
 * 只负责SDK的初始化
 */
class TencentMap {
  /**
   * 初始化地图SDK
   * @param options 地图配置选项
   * @returns Promise<boolean> 初始化是否成功
   */
  public static async init(): Promise<boolean> {
    if (isSDKLoaded.value) {
      return true;
    }

    if (isSDKLoading.value) {
      return await new Promise<boolean>((resolve) => {
        const checkLoaded = setInterval(() => {
          if (isSDKLoaded.value) {
            clearInterval(checkLoaded);
            resolve(true);
          }
        }, 100);
      });
    }

    isSDKLoading.value = true;
    try {
      await loadScript(`https://map.qq.com/api/gljs?v=1.exp&key=${TENCENT_MAP_KEY}`);
      await loadScript(`https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${TENCENT_MAP_KEY}`);

      isSDKLoaded.value = true;
      isSDKLoading.value = false;
      console.log('腾讯地图SDK初始化成功');
      return true;
    } catch (error) {
      console.error('腾讯地图SDK加载失败:', error);
      isSDKLoading.value = false;
      return false;
    }
  }

  /**
   * 获取SDK加载状态
   */
  public static getSDKLoadStatus(): { isLoaded: Ref<boolean>; isLoading: Ref<boolean> } {
    return {
      isLoaded: isSDKLoaded,
      isLoading: isSDKLoading
    };
  }

  /**
   * 获取TMap SDK实例
   */
  public static getTMapSDK(): any {
    if (!isSDKLoaded.value) {
      throw new Error('地图SDK尚未加载，请先调用TencentMap.init()方法');
    }
    return window.TMap;
  }
}

export { TencentMap, isSDKLoaded, isSDKLoading };
