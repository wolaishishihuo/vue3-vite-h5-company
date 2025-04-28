import { ref } from 'vue';
import { TencentMap } from '@/plugins/tencentMap';
import type { TMap } from '@/types/TMap';

export function useGeocoder() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const result = ref<any>(null);

  /**
   * 地理编码 - 地址转坐标
   * @param address 地址文本
   */
  const geocode = async (address: string): Promise<TMap.LatLng | null> => {
    if (!address) {
      error.value = '地址不能为空';
      return null;
    }

    isLoading.value = true;
    error.value = null;
    result.value = null;

    try {
      const TMapSDK = TencentMap.getTMapSDK();
      const geocoder = new TMapSDK.service.Geocoder();
      console.log(
        geocoder
      );

      return new Promise((resolve, reject) => {
        geocoder.getLocation({
          address,
          success: (res: any) => {
            if (res.status === 0 && res.result.location) {
              const location = res.result.location;
              result.value = {
                lat: location.lat,
                lng: location.lng,
                formatted_address: res.result.address || address,
                raw: res.result
              };
              resolve({ lat: location.lat, lng: location.lng });
            } else {
              error.value = '未找到地址对应的坐标';
              resolve(null);
            }
          },
          error: (err: any) => {
            error.value = err.message || '地理编码查询失败';
            reject(err);
          },
          complete: () => {
            isLoading.value = false;
          }
        });
      });
    } catch (err: any) {
      isLoading.value = false;
      error.value = err.message || '地理编码服务初始化失败';
      return null;
    }
  };

  /**
   * 逆地理编码 - 坐标转地址
   * @param location 坐标位置
   */
  const reverseGeocode = async (location: TMap.LatLng): Promise<any | null> => {
    console.log(location);

    if (!location.lat || !location.lng) {
      error.value = '坐标不能为空';
      return null;
    }

    isLoading.value = true;
    error.value = null;
    result.value = null;

    try {
      const TMapSDK = TencentMap.getTMapSDK();

      const geocoder = new TMapSDK.service.Geocoder();
      console.log(
        geocoder
      );
      return new Promise((resolve, reject) => {
        geocoder.getAddress({
          location: new TMapSDK.LatLng(location.lat, location.lng),
          success: (res: any) => {
            if (res.status === 0 && res.result) {
              result.value = {
                address: res.result.address,
                formatted_address: res.result.formatted_addresses?.recommend || res.result.address,
                addressComponent: res.result.address_component,
                raw: res.result
              };
              resolve(result.value);
            } else {
              error.value = '未找到坐标对应的地址';
              resolve(null);
            }
          },
          error: (err: any) => {
            error.value = err.message || '逆地理编码查询失败';
            reject(err);
          },
          complete: () => {
            isLoading.value = false;
          }
        });
      });
    } catch (err: any) {
      isLoading.value = false;
      error.value = err.message || '逆地理编码服务初始化失败';
      return null;
    }
  };

  return {
    isLoading,
    error,
    result,
    geocode,
    reverseGeocode
  };
}
