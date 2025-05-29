import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResultEnum } from '@/enums/httpEnum';
import type { CustomAxiosRequestConfig, ResultData } from './interface';
import { closeToast, showFailToast, showLoadingToast, showNotify } from 'vant';
import useUserStore from '@/stores/modules/user';

const serviceConfig = {
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: ResultEnum.TIMEOUT as number
};

// 添加请求计数器
let loadingCount = 0;
let loadingTimer: NodeJS.Timeout | null = null;
const MIN_LOADING_TIME = 300; // 最小loading显示时间(ms)
let loadingStartTime = 0;

// 显示Loading
const showLoading = () => {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }

  loadingCount++;

  if (loadingCount === 1) {
    loadingStartTime = Date.now();
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0 // 持续显示，直到请求结束
    });
  }
};

// 隐藏Loading
const hideLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);

  if (loadingCount === 0) {
    const elapsedTime = Date.now() - loadingStartTime;
    const remainTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

    // 如果loading显示时间不足最小时间，则延迟关闭
    if (remainTime > 0) {
      loadingTimer = setTimeout(() => {
        closeToast();
        loadingTimer = null;
      }, remainTime);
    } else {
      closeToast();
    }
  }
};

class HttpRequest {
  service: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到本地储存当中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const userStore = useUserStore();

        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `${userStore.token}`);
        }

        // 自定义Loading
        if (config.showLoading !== false) {
          showLoading();
        }

        return config;
      },
      this.errorHandler
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        // 清除Loading
        hideLoading();

        const { data } = response;

        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          showNotify({
            type: 'danger',
            message: data?.message || '请求错误!~'
          });
          return Promise.reject(data);
        }
        return data;
      },
      this.errorHandler
    );
  }

  errorHandler(error: AxiosError): Promise<any> {
    // 清除Loading
    hideLoading();

    showFailToast(error.message || 'Error');
    // 网络连接失败
    if (!window.navigator.onLine) {
      showFailToast(error.message || '网络出错，请检查网络连接');
    }
    return Promise.reject(error);
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, config: Partial<CustomAxiosRequestConfig> = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ...config });
  }

  post<T>(url: string, params?: object | string, config: Partial<CustomAxiosRequestConfig> = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, config);
  }

  put<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.put(url, params);
  }

  delete<T>(url: string, params?: any): Promise<ResultData<T>> {
    return this.service.delete(url, { params });
  }

  download(url: string, params?: object): Promise<BlobPart> {
    return this.service.post(url, params, { responseType: 'blob' });
  }
}
export default new HttpRequest(serviceConfig);
