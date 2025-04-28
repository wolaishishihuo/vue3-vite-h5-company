import { getWxInfo } from '@/api/wx';
import { wxJsApiList } from '@/config/wx';
import * as ww from '@wecom/jssdk';
import { withTimeout } from '@/utils';

/**
 * 企业微信JSSDK核心类
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
  public async init(options: WxAPI.WxInitOptions = {}): Promise<void> {
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
        getConfigSignature: async (): Promise<WxAPI.ConfigSignature> => {
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
  public async ensureInitialized(): Promise<void> {
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
   * 获取当前超时设置
   */
  public getTimeout(): number {
    return this.timeout;
  }

  /**
   * 获取ww对象
   */
  public getWW() {
    return ww;
  }
}

// 导出类，让使用方可以直接导入类型
export { WechatSDK };
// 默认导出单例实例
export default WechatSDK.getInstance();
