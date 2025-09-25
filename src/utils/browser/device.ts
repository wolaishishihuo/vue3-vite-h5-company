// 判断设备类型
export const isIOS = (): boolean => {
  const u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};

// 判断是否在企业微信环境中
export const isWxWork = (): boolean => {
  return navigator.userAgent.toLowerCase().includes('wxwork');
};

// 判断是否是移动端
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
