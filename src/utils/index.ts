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
