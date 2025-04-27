/**
 * 为Promise添加超时控制
 * @template T 返回类型
 * @param promise 原始Promise
 * @param ms 超时时间(毫秒)
 * @param errorMessage 超时错误信息
 * @returns 带超时控制的Promise
 */
export const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise
  ]);
};

/**
 * 加载外部脚本
 * @param src 脚本地址
 */
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = err => reject(err);
    document.head.appendChild(script);
  });
};
