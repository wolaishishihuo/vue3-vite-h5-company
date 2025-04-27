import { getWxInfo } from '@/api/ wx';
import { wxJsApiList } from '@/config/wx';
import * as ww from '@wecom/jssdk';

// https://developer.work.weixin.qq.com/document/path/90514
class WechatSDK {
  private static instance: WechatSDK;
  private jsApiList: string[] = wxJsApiList;
  private initialized: boolean = false;

  public static getInstance(): WechatSDK {
    if (!WechatSDK.instance) {
      WechatSDK.instance = new WechatSDK();
      WechatSDK.instance.init().catch((err) => {
        console.error('微信SDK初始化失败:', err);
      });
    }
    return WechatSDK.instance;
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      const { data } = await getWxInfo(window.location.href);
      ww.register({
        corpId: data.appId,
        jsApiList: this.jsApiList,
        getConfigSignature
      });

      async function getConfigSignature() {
        return {
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature
        };
      }

      this.initialized = true;
      console.log('微信SDK初始化成功');
    } catch (error) {
      console.error('微信SDK初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取当前SDK是否已初始化
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 选择企业通讯录联系人
   * @param options 配置选项
   * @returns Promise
   */
  public async selectEnterpriseContact(options: any = {}): Promise<any> {
    if (!this.initialized) {
      await this.init();
    }

    return ww.invoke('selectEnterpriseContact', {
      fromDepartmentId: options.fromDepartmentId || 0, // 默认从根部门开始
      mode: options.mode || 'multi', // 多选模式
      type: options.type || ['department', 'user'], // 可选部门和用户
      selectedDepartmentIds: options.selectedDepartmentIds || [], // 已选部门ID列表
      selectedUserIds: options.selectedUserIds || [], // 已选用户ID列表
      ...options
    });
  }

  /**
   * 打开企业会话
   * @param options 配置选项
   * @returns Promise
   */
  public async openEnterpriseChat(options: any): Promise<any> {
    if (!this.initialized) {
      await this.init();
    }

    if (!options.userIds && !options.chatId) {
      throw new Error('userIds或chatId至少需要提供一个');
    }

    return ww.invoke('openEnterpriseChat', options);
  }

  /**
   * 获取原始ww对象，用于直接调用其他API
   * @returns ww对象
   */
  public getWW() {
    return ww;
  }
}

// 导出单例实例，实例创建时会自动初始化SDK
export default WechatSDK.getInstance();
