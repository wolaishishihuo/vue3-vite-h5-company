declare namespace WxAPI {
  import type { LocationType, SelectEnterpriseContactMode, SelectEnterpriseContactType } from '@wecom/jssdk';

  // 接口定义区
  interface ConfigSignature {
    timestamp: string;
    nonceStr: string;
    signature: string;
  }

  interface WxInitOptions {
    maxRetries?: number;
    timeout?: number;
  }

  // 选择企业通讯录联系人
  interface ContactOptions {
    fromDepartmentId?: number;
    mode: SelectEnterpriseContactMode;
    type: SelectEnterpriseContactType[];
    selectedDepartmentIds?: string[];
    selectedUserIds?: string[];
    [key: string]: any;
  }

  // 打开企业会话
  interface ChatOptions {
    userIds?: string[];
    chatId?: string;
    [key: string]: any;
  }

  // 获取地理位置
  interface LocationOptions {
    type?: LocationType;
    [key: string]: any;
  }
}
