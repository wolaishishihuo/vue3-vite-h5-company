declare namespace TMap {
  interface LatLng {
    lat: number;
    lng: number;
  }

  interface MarkerStyleOptions {
    width?: number;
    height?: number;
    anchor?: {
      x: number;
      y: number;
    };
    src?: string;
    [key: string]: any;
  }

  interface MarkerGeometry {
    id: string;
    styleId?: string;
    position: LatLng | TMap.LatLng;
    properties?: {
      title?: string;
      [key: string]: any;
    };
  }

  interface MultiMarkerOptions {
    id?: string;
    map: any;
    styles: {
      [styleId: string]: any;
    };
    geometries: MarkerGeometry[];
  }

  interface MapOptions {
    center?: LatLng | TMap.LatLng;
    zoom?: number;
    pitch?: number;
    rotation?: number;
    [key: string]: any;
  }

  interface MarkerEventData {
    geometry: MarkerGeometry;
    latLng: TMap.LatLng;
    type: string;
  }
}

// 全局扩展Window接口
declare global {
  interface Window {
    TMap: {
      Map: new (container: HTMLElement, options?: TMap.MapOptions) => any;
      LatLng: new (lat: number, lng: number) => any;
      MarkerStyle: new (options: TMap.MarkerStyleOptions) => any;
      MultiMarker: new (options: TMap.MultiMarkerOptions) => any;
      [key: string]: any;
    };
  }
}

export { TMap };
