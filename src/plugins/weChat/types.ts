import type { LocationType, SelectEnterpriseContactMode, SelectEnterpriseContactType } from '@wecom/jssdk';

// 接口定义区
export interface ConfigSignature {
  timestamp: string;
  nonceStr: string;
  signature: string;
}

export interface WxInitOptions {
  maxRetries?: number;
  timeout?: number;
}

// 选择企业通讯录联系人
export interface ContactOptions {
  fromDepartmentId?: number;
  mode: SelectEnterpriseContactMode;
  type: SelectEnterpriseContactType[];
  selectedDepartmentIds?: string[];
  selectedUserIds?: string[];
  [key: string]: any;
}

// 打开企业会话
export interface ChatOptions {
  userIds?: string[];
  chatId?: string;
  [key: string]: any;
}

// 获取地理位置
export interface LocationOptions {
  type?: LocationType;
  [key: string]: any;
}
