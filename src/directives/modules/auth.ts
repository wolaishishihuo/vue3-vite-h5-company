import type { Directive } from 'vue';
import { isArray } from 'lodash-es';
import useUserStore from '@/stores/modules/user';
/**
 * @name 权限指令
 * @description 和权限判断函数 checkPermission 功能类似
 */
const auth: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding;
    const userStore = useUserStore();
    if (isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = userStore.userInfo.roles.some(role => permissionRoles.includes(role));
      hasPermission || el.parentNode?.removeChild(el);
    } else {
      throw new Error(`参数必须是一个数组且长度大于 0，参考：v-permission="['admin', 'editor']"`);
    }
  }
};

export default auth;
