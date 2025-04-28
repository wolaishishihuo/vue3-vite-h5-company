import * as ww from '@wecom/jssdk';
import type { SelectEnterpriseContactMode, SelectEnterpriseContactType } from '@wecom/jssdk';
import { withTimeout } from '@/utils';
import wechatSDK from '@/plugins/weChat';

/**
 * 企业微信相关功能的组合式API
 */
export function useWechat() {
  const sdk = wechatSDK;

  return {
    // 初始化
    init: (options?: WxAPI.WxInitOptions) => sdk.init(options),
    reset: () => sdk.reset(),
    isInitialized: () => sdk.isInitialized(),
    getEnvironment: () => sdk.getEnvironment(),
    isInWeChatEnvironment: () => sdk.isInWeChatEnvironment(),

    // 联系人选择
    selectEnterpriseContact: async (options: Partial<WxAPI.ContactOptions> = {}): Promise<any> => {
      await sdk.ensureInitialized();

      const mergedOptions = {
        fromDepartmentId: options.fromDepartmentId || 0,
        mode: (options.mode || 'multi') as SelectEnterpriseContactMode,
        type: (options.type || ['department', 'user']) as SelectEnterpriseContactType[],
        selectedDepartmentIds: options.selectedDepartmentIds || [],
        selectedUserIds: options.selectedUserIds || [],
        ...options
      };

      return withTimeout(
        ww.selectEnterpriseContact(mergedOptions),
        sdk.getTimeout(),
        `选择企业通讯录联系人操作超时(${sdk.getTimeout()}ms)`
      );
    },

    // 打开企业会话
    openEnterpriseChat: async (options: WxAPI.ChatOptions): Promise<any> => {
      await sdk.ensureInitialized();

      if (!options.userIds && !options.chatId) {
        throw new Error('userIds或chatId至少需要提供一个');
      }

      return withTimeout(
        ww.openEnterpriseChat(options),
        sdk.getTimeout(),
        `打开企业会话操作超时(${sdk.getTimeout()}ms)`
      );
    },

    // 获取地理位置
    getLocation: async (options: WxAPI.LocationOptions = {}): Promise<any> => {
      await sdk.ensureInitialized();

      return withTimeout(
        ww.getLocation(options),
        sdk.getTimeout(),
        `获取位置信息操作超时(${sdk.getTimeout()}ms)`
      );
    },

    // 获取原始ww对象
    getWW: async () => {
      await sdk.ensureInitialized();
      return sdk.getWW();
    }
  };
}

export const wxApi = useWechat();
export default useWechat;
