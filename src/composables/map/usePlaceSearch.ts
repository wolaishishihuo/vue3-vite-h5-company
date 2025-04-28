import { ref } from 'vue';
import { TencentMap } from '@/plugins/tencentMap';

export function usePlaceSearch() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchResults = ref<any[]>([]);
  const totalCount = ref(0);

  /**
   * 搜索地点
   * @param keyword 关键词
   * @param options 搜索选项
   */
  const searchPlaces = async (keyword: string, options?: {
    region?: string;
    pageIndex?: number;
    pageSize?: number;
    boundary?: string;
    orderby?: string;
    filter?: string;
  }): Promise<any[]> => {
    if (!keyword) {
      error.value = '搜索关键词不能为空';
      return [];
    }

    isLoading.value = true;
    error.value = null;
    searchResults.value = [];

    try {
      const TMapSDK = TencentMap.getTMapSDK();
      const searchService = new TMapSDK.service.Search();

      return new Promise((resolve, reject) => {
        searchService.search({
          keyword,
          region: options?.region || '',
          page_index: options?.pageIndex || 1,
          page_size: options?.pageSize || 20,
          boundary: options?.boundary,
          orderby: options?.orderby,
          filter: options?.filter,
          success: (res: any) => {
            if (res.status === 0 && res.data) {
              searchResults.value = res.data || [];
              totalCount.value = res.count || 0;
              resolve(searchResults.value);
            } else {
              error.value = '未找到相关地点';
              resolve([]);
            }
          },
          error: (err: any) => {
            error.value = err.message || '地点搜索失败';
            reject(err);
          },
          complete: () => {
            isLoading.value = false;
          }
        });
      });
    } catch (err: any) {
      isLoading.value = false;
      error.value = err.message || '地点搜索服务初始化失败';
      return [];
    }
  };

  return {
    isLoading,
    error,
    searchResults,
    totalCount,
    searchPlaces
  };
}
