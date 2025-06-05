import request from '@/http';

interface WxInfo {
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
}

/**
 * 获取企业微信JS-SDK配置信息
 * @param url 当前页面完整URL（不包含hash部分）
 * @returns 包含签名等信息的响应
 */
export function getWxInfo(url: string) {
  const encodedUrl = encodeURIComponent(url);
  return request.get<WxInfo>(`/wx/cp/getJsapiSignature?url=${encodedUrl}`);
}
