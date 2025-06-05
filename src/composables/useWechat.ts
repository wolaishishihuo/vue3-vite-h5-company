import type { chooseImage, getLocation, openEnterpriseChat, scanQRCode, selectEnterpriseContact } from '@wecom/jssdk';
import * as ww from '@wecom/jssdk';
import { SelectEnterpriseContactMode, SelectEnterpriseContactType, SizeType, SourceType } from '@wecom/jssdk';
import wechatSDK from '@/plugins/weChat';

/**
 * 企业微信相关功能的组合式API
 */
const useWechat = () => {
  const sdk = wechatSDK;

  return {
    // 联系人选择
    selectEnterpriseContact: async (options: Partial<Parameters<typeof selectEnterpriseContact>[0]>) => {
      await sdk.ensureInitialized();

      const mergedOptions = {
        fromDepartmentId: options.fromDepartmentId || 0,
        mode: options.mode || SelectEnterpriseContactMode.multi,
        type: options.type || [SelectEnterpriseContactType.department, SelectEnterpriseContactType.user],
        selectedDepartmentIds: options.selectedDepartmentIds || [],
        selectedUserIds: options.selectedUserIds || [],
        ...options
      };

      return ww.selectEnterpriseContact(mergedOptions);
    },

    // 打开企业会话
    openEnterpriseChat: async (options: Parameters<typeof openEnterpriseChat>[0]) => {
      await sdk.ensureInitialized();

      if (!options.userIds && !options.chatId) {
        throw new Error('userIds或chatId至少需要提供一个');
      }

      return ww.openEnterpriseChat(options);
    },

    // 获取地理位置
    getLocation: async (options: Parameters<typeof getLocation>[0]) => {
      await sdk.ensureInitialized();

      return ww.getLocation(options);
    },

    // 扫码
    scanQRCode: async (options: Parameters<typeof scanQRCode>[0]) => {
      await sdk.ensureInitialized();

      return ww.scanQRCode(options);
    },

    // 选择图片
    chooseImage: async (options: Parameters<typeof chooseImage>[0]) => {
      await sdk.ensureInitialized();
      const mergedOptions = {
        count: options.count || 1,
        sizeType: options.sizeType || [SizeType.compressed, SizeType.original],
        sourceType: options.sourceType || [SourceType.album, SourceType.camera],
        ...options
      };
      return ww.chooseImage(mergedOptions);
    }
  };
};

export default useWechat;
