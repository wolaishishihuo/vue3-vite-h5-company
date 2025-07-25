import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type RequestError = AxiosError<{
  message?: string;
  result?: any;
  errorMessage?: string;
}>;

// 请求响应参数（不包含data）
export interface Result {
  status: string;
  message: string;
  success: boolean;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}
// 分页请求响应参数
export interface PageResult<T = any> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean; // 是否显示Loading
  showToast?: boolean; // 是否显示Toast
}
