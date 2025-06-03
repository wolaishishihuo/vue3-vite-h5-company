import { TENCENT_MAP_KEY, TENCENT_MAP_LIBRARY } from '@/constants';
import { loadScript } from '@/utils';
import { BaseSDK } from '../base/BaseSDK';

/**
 * 腾讯地图 TMap GL 封装类
 * 只负责SDK的初始化和提供API访问
 */
export class TencentMapSDK extends BaseSDK {
  constructor() {
    super();
  }

  /**
   * 加载SDK具体实现
   * @returns Promise<void>
   */
  protected async loadSDK(): Promise<void> {
    // 加载地图SDK
    await loadScript(`https://map.qq.com/api/gljs?v=1.exp&key=${TENCENT_MAP_KEY}&libraries=${TENCENT_MAP_LIBRARY}`);
    // 加载地图服务SDK
    // await loadScript(`https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${TENCENT_MAP_KEY}`);

    console.log('腾讯地图SDK初始化成功');
  }

  /**
   * 获取TMap SDK实例
   */
  public getTMapSDK(): any {
    if (!this.isInitialized()) {
      throw new Error('地图SDK尚未加载，请先调用TencentMap.init()方法');
    }
    return window.TMap;
  }
}

// 创建默认实例，保持与单例模式使用方式兼容
const defaultInstance = new TencentMapSDK();
export default defaultInstance;
