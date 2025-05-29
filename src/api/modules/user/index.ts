import request from '@/http';
import type { IdentityType, UserInfo } from '@/api/interface/user';

// 微信登录
export const loginApi = (code: string) => {
  return request.post<{ accessToken: string }>(`/auth/login/${code}`);
};

// 身份中台登录
export const loginFromSft = (code: string) => {
  return request.post<{ accessToken: string }>(`/auth/loginFromSft/${code}`);
};

/**
 * 获取用户信息
 * @returns
 */
export const getUserInfoApi = () => {
  return request.get<UserInfo>('/user/getUserInfo');
};

/**
 * 获取用户身份类型
 * @returns
 */
export const getIdentityTypeApi = (params: {
  isAdmin: '0' | '1';
}) => {
  return request.get<IdentityType[]>('/user/getIdentityType', params);
};
