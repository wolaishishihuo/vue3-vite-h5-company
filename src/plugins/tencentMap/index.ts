import { TENCENT_MAP_KEY } from '@/constants';
import type { Ref } from 'vue';
import { ref } from 'vue';

declare global {
  interface Window {
    TMap: any;
  }
}

/**
 * 腾讯地图 TMap GL 封装类
 */
class TencentMap {
  private static instance: TencentMap | null = null;
  private map: any = null;
  private isLoaded: Ref<boolean> = ref(false);
  private isLoading: Ref<boolean> = ref(false);
  private mapKey: string = TENCENT_MAP_KEY || '';
  private TMap: any = null;
  private marker: any = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): TencentMap {
    if (!this.instance) {
      this.instance = new TencentMap();
    }
    return this.instance;
  }

  /**
   * 初始化地图SDK
   * @param options 地图配置选项
   * @returns Promise<boolean> 初始化是否成功
   */
  public async init(options?: { key?: string }): Promise<boolean> {
    if (this.isLoaded.value) {
      return true;
    }

    if (this.isLoading.value) {
      return await new Promise<boolean>((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.isLoaded.value) {
            clearInterval(checkLoaded);
            resolve(true);
          }
        }, 100);
      });
    }

    this.isLoading.value = true;
    const key = options?.key || this.mapKey;

    try {
      await this.loadScript(`https://map.qq.com/api/gljs?v=1.exp&key=${key}`);

      this.isLoaded.value = true;
      this.isLoading.value = false;
      this.TMap = window.TMap;
      console.log('腾讯地图SDK初始化成功');
      return true;
    } catch (error) {
      console.error('腾讯地图SDK加载失败:', error);
      this.isLoading.value = false;
      return false;
    }
  }

  /**
   * 加载外部脚本
   * @param src 脚本地址
   */
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = err => reject(err);
      document.head.appendChild(script);
    });
  }

  /**
   * 初始化地图
   * @param elementId 地图容器元素ID
   * @param options 地图初始化选项
   */
  public initMap(elementId: string, options?: any): any {
    if (!this.isLoaded.value) {
      throw new Error('地图API尚未加载，请先调用init()方法');
    }

    const container = document.getElementById(elementId);
    if (!container) {
      throw new Error(`找不到地图容器元素: ${elementId}`);
    }

    const defaultOptions = {
      center: new this.TMap.LatLng(39.916527, 116.397128), // 默认北京中心
      zoom: 13
    };

    // 合并配置
    const mergedOptions = { ...defaultOptions, ...options };

    this.map = new this.TMap.Map(container, mergedOptions);

    return this.map;
  }

  /**
   * 添加标记点
   * @param position 标记点位置
   * @param styleOptions 标记点样式选项
   */
  public addMarker(position: { lat: number; lng: number }, styleOptions?: any): any {
    if (!this.map) {
      throw new Error('地图尚未初始化，请先调用initMap()方法');
    }
    console.log(position);

    // 创建默认样式
    const defaultStyle = {
      width: 25,
      height: 35,
      anchor: { x: 16, y: 32 }
    };

    const style = { ...defaultStyle, ...styleOptions };

    // 构建标记点配置
    const markerOptions = {
      id: 'marker-layer', // 图层id
      map: this.map,
      styles: { // 点标注的相关样式
        marker: new this.TMap.MarkerStyle(style)
      },
      geometries: [{ // 点标注数据数组
        id: 'marker',
        styleId: 'marker',
        position: new this.TMap.LatLng(position.lat, position.lng),
        properties: {
          title: 'marker'
        }
      }]
    };

    // 如果已存在标记点，先移除
    if (this.marker) {
      this.marker.setMap(null);
    }

    // 创建新标记点
    this.marker = new this.TMap.MultiMarker(markerOptions);

    return this.marker;
  }

  /**
   * 更新标记点位置
   * @param position 新位置
   */
  public updateMarkerPosition(position: { lat: number; lng: number }): void {
    if (!this.marker) {
      this.addMarker(position);
      return;
    }

    // 更新标记点位置
    this.marker.setGeometries([{
      id: 'marker',
      styleId: 'marker',
      position: new this.TMap.LatLng(position.lat, position.lng),
      properties: {
        title: 'marker'
      }
    }]);
  }

  /**
   * 启用地图点击选点功能
   * @param callback 点击回调函数
   */
  public enableClickSelect(callback?: (position: { lat: number; lng: number }) => void): void {
    if (!this.map) {
      throw new Error('地图尚未初始化，请先调用initMap()方法');
    }

    // 监听点击地图事件
    this.map.on('click', (event: any) => {
      const position = event.latLng;

      // 更新标记点位置
      this.updateMarkerPosition({
        lat: position.lat,
        lng: position.lng
      });

      // 如果有回调函数，调用回调
      if (callback) {
        callback({
          lat: position.lat,
          lng: position.lng
        });
      }
    });
  }

  /**
   * 禁用地图点击选点功能
   */
  public disableClickSelect(): void {
    if (!this.map) {
      return;
    }

    // 移除点击地图事件监听
    this.map.off('click');
  }

  /**
   * 获取地图实例
   */
  public getMap(): any {
    return this.map;
  }

  /**
   * 获取当前标记点位置
   */
  public getMarkerPosition(): { lat: number; lng: number } | null {
    if (!this.marker) {
      return null;
    }

    const geometries = this.marker.getGeometries();
    if (geometries && geometries.length > 0) {
      const position = geometries[0].position;
      return {
        lat: position.lat,
        lng: position.lng
      };
    }

    return null;
  }
}

// 导出单例实例
export default TencentMap.getInstance();
