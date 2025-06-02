import { getWxInfo } from '@/api/modules/common/wx';
import { wxJsApiList } from '@/config/wx';
import * as ww from '@wecom/jssdk';
import { isWxWork, withTimeout } from '@/utils';
import { BaseSDK } from '../base/BaseSDK';

/**
 * 企业微信JSSDK核心类
 * @see https://developer.work.weixin.qq.com/document/path/90514
 */
export class WechatSDK extends BaseSDK {
  /** JS API列表 */
  private jsApiList: string[] = wxJsApiList;

  constructor() {
    super();
  }

  /**
   * 加载SDK具体实现
   * @param options 加载选项
   * @returns Promise<void>
   */
  protected async loadSDK(): Promise<void> {
    // 检查环境
    if (!isWxWork()) {
      console.warn('当前环境不是企业微信或微信');
      return;
    }
    // 获取微信配置信息，带超时
    const { data } = await withTimeout(
      getWxInfo(window.location.href.split('#')[0]),
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

    console.log('微信SDK初始化成功');
  }

  /**
   * 确保SDK已初始化
   * @returns Promise
   */
  public async ensureInitialized(): Promise<void> {
    if (!this.isInitialized()) {
      await this.init();
    }
  }

  /**
   * 获取ww对象
   */
  public getWW() {
    return ww;
  }
}

// 创建默认实例，保持与单例模式使用方式兼容
const defaultInstance = new WechatSDK();
export default defaultInstance;
