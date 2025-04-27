import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ResultEnum } from '@/enums/httpEnum';
import type { ResultData } from './types';
import { useUserStore } from '@/stores/modules/user';
import { showNotify } from 'vant';

const serviceConfig = {
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: ResultEnum.TIMEOUT as number
  // 跨域时候允许携带凭证
  // withCredentials: true
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
      (config: InternalAxiosRequestConfig) => {
        const userStore = useUserStore();

        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('x-access-token', userStore.accessToken);
          config.headers.set('Authorization', `Bearer ${userStore.accessToken}`);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;

        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          showNotify({
            type: 'danger',
            message: data?.msg || '请求错误!~'
          });
          return Promise.reject(data);
        }
        return data;
      },
      async (error: AxiosError) => {
        if (error.message.includes('timeout')) {
          showNotify({
            type: 'danger',
            message: '请求超时！请您稍后重试!'
          });
        }
        if (error.message.includes('Network Error')) {
          showNotify({
            type: 'danger',
            message: '网络错误！请您稍后重试!'
          });
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.get(url, { params });
  }

  post<T>(url: string, params?: object | string): Promise<ResultData<T>> {
    return this.service.post(url, params);
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
