import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CustomAxiosRequestConfig, ResultData } from './interface';
import axios from 'axios';
import { showFailToast, showNotify } from 'vant';
import useHttpLoading from '@/composables/useHttpLoading';
import { ResultEnum } from '@/enums/httpEnum';
import useUserStore from '@/stores/modules/user';

const { showLoading, hideLoading } = useHttpLoading();

const serviceConfig = {
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: ResultEnum.TIMEOUT as number
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
