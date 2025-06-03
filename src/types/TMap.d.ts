declare namespace TMap {
  interface LatLng {
    lat: number;
    lng: number;
  }

  interface MapOptions {
    center?: LatLng | TMap.LatLng;
    zoom?: number;
    pitch?: number;
    rotation?: number;
    [key: string]: any;
  }

}

// 全局扩展Window接口
declare global {
  interface Window {
    TMap: {
      Map: new (container: HTMLElement, options?: any) => any;
      [key: string]: any;
    };
    qq: {
      maps: {
        Geolocation: new () => any;
      };
    };
  }
}

export { TMap };
