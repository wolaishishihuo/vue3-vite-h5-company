/**
 * 全局类型定义
 */

declare namespace WxAPI {
  /**
   * 微信配置签名
   */
  interface ConfigSignature {
    timestamp: string | number;
    nonceStr: string;
    signature: string;
  }
}

/**
 * 腾讯地图全局对象
 */
interface Window {
  TMap: any;
}
