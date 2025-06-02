import * as ww from '@wecom/jssdk';
import type { getLocation, openEnterpriseChat, selectEnterpriseContact, SelectEnterpriseContactMode, SelectEnterpriseContactType } from '@wecom/jssdk';
import wechatSDK from '@/plugins/weChat';

/**
 * 企业微信相关功能的组合式API
 */
export function useWechat() {
  const sdk = wechatSDK;

  return {
    // 联系人选择
    selectEnterpriseContact: async (options: Parameters<typeof selectEnterpriseContact>[0]): ReturnType<typeof ww.selectEnterpriseContact> => {
      await sdk.ensureInitialized();

      const mergedOptions = {
        fromDepartmentId: options.fromDepartmentId || 0,
        mode: (options.mode || 'multi') as SelectEnterpriseContactMode,
        type: (options.type || ['department', 'user']) as SelectEnterpriseContactType[],
        selectedDepartmentIds: options.selectedDepartmentIds || [],
        selectedUserIds: options.selectedUserIds || [],
        ...options
      };

      return ww.selectEnterpriseContact(mergedOptions);
    },

    // 打开企业会话
    openEnterpriseChat: async (options: Parameters<typeof openEnterpriseChat>[0]): ReturnType<typeof openEnterpriseChat> => {
      await sdk.ensureInitialized();

      if (!options.userIds && !options.chatId) {
        throw new Error('userIds或chatId至少需要提供一个');
      }

      return ww.openEnterpriseChat(options);
    },

    // 获取地理位置
    getLocation: async (options: Parameters<typeof getLocation>[0]): ReturnType<typeof getLocation> => {
      await sdk.ensureInitialized();

      return ww.getLocation(options);
    }

  };
}

export default useWechat;
