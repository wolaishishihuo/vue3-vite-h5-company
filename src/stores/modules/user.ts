import type { UserInfo } from '@/api/interface/user';
import { defineStore } from 'pinia';
import { getUserInfoApi, loginApi, loginFromSft } from '@/api/modules/user/index';
import { parseUrlParams } from '@/utils';

const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    xgh: '',
    xm: '',
    avatar: '',
    roles: [],
    permissions: [],
    identityType: []
  });

  const token = ref<string>('');

  const userInit = async () => {
    await login();
    getUserInfo();
  };

  const getUserInfo = async () => {
    const { data } = await getUserInfoApi();
    Object.assign(userInfo.value, data);
  };

  const login = async () => {
    const isDev = import.meta.env.VITE_USER_NODE_ENV === 'development';
    const urlParams = parseUrlParams();

    const loginParams = isDev
      ? { code: import.meta.env.VITE_LOGIN_CODE, state: import.meta.env.VITE_LOGIN_CODE }
      : { code: urlParams.code, state: urlParams.state };

    const res = loginParams.state
      ? await loginApi(loginParams.code)
      : await loginFromSft(loginParams.code);

    token.value = res.data.accessToken;
  };

  return {
    userInfo,
    token,
    userInit,
    login
  };
}, {
  persist: {
    storage: sessionStorage,
    pick: ['userInfo', 'token']
  }
});

export default useUserStore;
