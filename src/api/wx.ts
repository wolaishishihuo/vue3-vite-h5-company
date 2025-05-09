import request from '@/http';

interface WxInfo {
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
}

export function getWxInfo(url: string) {
  return request.get<WxInfo>(`/api/wx/cp/getJsapiSignature?url=${encodeURIComponent(url)}`);
}
