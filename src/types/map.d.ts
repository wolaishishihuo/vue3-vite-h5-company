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

  class Map {
    constructor(container: HTMLElement, options?: any);
  }
}

// 全局扩展Window接口
declare global {
  interface Window {
    TMap: typeof TMap & {
      Map: typeof TMap.Map;
      [key: string]: any;
    };
    qq: {
      maps: {
        Geolocation: new () => any;
      };
    };
  }
}
