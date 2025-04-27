import { getWxInfo } from '@/api/wx';
import { wxJsApiList } from '@/config/wx';
import * as ww from '@wecom/jssdk';
import type { ChatOptions, ConfigSignature, ContactOptions, LocationOptions, WxInitOptions } from './types';
import type { SelectEnterpriseContactMode, SelectEnterpriseContactType } from '@wecom/jssdk';
import { withTimeout } from '@/utils';

/**
 * 企业微信JSSDK封装类
 * @see https://developer.work.weixin.qq.com/document/path/90514
 */
class WechatSDK {
  /** 单例实例 */
  private static instance: WechatSDK;

  /** JS API列表 */
  private jsApiList: string[] = wxJsApiList;

  /** SDK是否已初始化 */
  private initialized: boolean = false;

  /** 当前正在进行的初始化Promise */
  private initializationPromise: Promise<void> | null = null;

  /** 初始化重试计数 */
  private retryCount: number = 0;

  /** 最大重试次数 */
  private maxRetries: number = 3;

  /** 超时时间(毫秒) */
  private timeout: number = 10000;

  /** 环境信息 */
  private env: {
    isWxWork: boolean;
    isWechat: boolean;
  };

  private constructor() {
    // 初始化环境信息
    const ua = navigator.userAgent.toLowerCase();
    this.env = {
      isWxWork: ua.includes('wxwork'),
      isWechat: ua.includes('micromessenger')
    };
  }

  /**
   * 获取单例实例
   * @returns WechatSDK实例
   */
  public static getInstance(): WechatSDK {
    if (!WechatSDK.instance) {
      WechatSDK.instance = new WechatSDK();
    }
    return WechatSDK.instance;
  }

  /**
   * 获取环境信息
   * @returns 环境信息对象
   */
  public getEnvironment() {
    return { ...this.env };
  }

  /**
   * 是否在企业微信或微信环境中
   * @returns 是否在企业微信或微信环境中
   */
  public isInWeChatEnvironment(): boolean {
    return this.env.isWxWork || this.env.isWechat;
  }

  /**
   * 初始化SDK
   * @param options 初始化选项
   * @returns Promise
   */
  public async init(options: WxInitOptions = {}): Promise<void> {
    // 已初始化，直接返回
    if (this.initialized) {
      return Promise.resolve();
    }

    // 正在初始化中，返回当前Promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // 应用配置选项
    if (options.maxRetries !== undefined) this.maxRetries = options.maxRetries;
    if (options.timeout !== undefined) this.timeout = options.timeout;

    // 检查环境
    if (!this.isInWeChatEnvironment()) {
      console.warn('当前环境不是企业微信或微信');
      return;
    }

    // 初始化SDK
    this.initializationPromise = this.executeInitialization();

    try {
      await this.initializationPromise;
      this.initialized = true;
    } catch (error) {
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * 执行SDK初始化流程
   * @returns Promise
   */
  private async executeInitialization(): Promise<void> {
    try {
      // 获取微信配置信息，带超时
      const { data } = await withTimeout(
        getWxInfo(window.location.href),
        this.timeout,
        `获取微信配置信息超时(${this.timeout}ms)`
      );

      // 注册SDK
      ww.register({
        corpId: data.appId,
        jsApiList: this.jsApiList,
        getConfigSignature: async (): Promise<ConfigSignature> => {
          return {
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature
          };
        }
      });

      // 重置重试计数
      this.retryCount = 0;
      console.log('微信SDK初始化成功');
    } catch (error) {
      console.error('微信SDK初始化失败:', error);

      // 实现重试机制
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`重试初始化微信SDK (${this.retryCount}/${this.maxRetries})`);
        return this.executeInitialization();
      }

      throw error;
    }
  }

  /**
   * 确保SDK已初始化
   * @returns Promise
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  /**
   * 重置SDK状态
   * 可用于在配置变更或需要重新初始化时调用
   */
  public reset(): void {
    this.initialized = false;
    this.initializationPromise = null;
    this.retryCount = 0;
  }

  /**
   * 获取当前SDK是否已初始化
   * @returns SDK是否已初始化
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 选择企业通讯录联系人
   * @param options 配置选项
   * @returns Promise
   */
  public async selectEnterpriseContact(options: Partial<ContactOptions> = {}): Promise<any> {
    await this.ensureInitialized();

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
      this.timeout,
      `选择企业通讯录联系人操作超时(${this.timeout}ms)`
    );
  }

  /**
   * 打开企业会话
   * @param options 配置选项
   * @returns Promise
   */
  public async openEnterpriseChat(options: ChatOptions): Promise<any> {
    await this.ensureInitialized();

    if (!options.userIds && !options.chatId) {
      throw new Error('userIds或chatId至少需要提供一个');
    }

    return withTimeout(
      ww.openEnterpriseChat(options),
      this.timeout,
      `打开企业会话操作超时(${this.timeout}ms)`
    );
  }

  /**
   * 获取地理位置
   * @param options 配置选项
   * @returns Promise
   */
  public async getLocation(options: LocationOptions = {}): Promise<any> {
    await this.ensureInitialized();

    return withTimeout(
      ww.getLocation(options),
      this.timeout,
      `获取位置信息操作超时(${this.timeout}ms)`
    );
  }

  /**
   * 获取原始ww对象，用于直接调用其他API
   * @returns ww对象
   */
  public async getWW() {
    await this.ensureInitialized();
    return ww;
  }
}

/**
 * 导出企业微信SDK单例实例
 */
export default WechatSDK.getInstance();
