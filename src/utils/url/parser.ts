/**
 * 解析URL中的所有参数
 * @param url 要解析的URL，默认为当前页面URL
 * @returns 包含所有参数的对象
 */
export function parseUrlParams(url = window.location.href): Record<string, string> {
  const result: Record<string, string> = {};

  try {
    // 处理查询参数部分
    const queryString = url.split('?')[1]?.split('#')[0];
    if (queryString) {
      new URLSearchParams(queryString).forEach((value, key) => {
        result[key] = value;
      });
    }

    // 处理哈希部分的参数
    const hashParts = url.split('#')[1];
    if (hashParts) {
      // 保存哈希路径
      const hashPath = hashParts.split('?')[0];
      if (hashPath) {
        result.hash = hashPath;
      }

      // 解析哈希后的查询参数
      const hashQuery = hashParts.includes('?') ? hashParts.split('?')[1] : '';
      if (hashQuery) {
        new URLSearchParams(hashQuery).forEach((value, key) => {
          result[key] = value;
        });
      }
    }
  } catch (error) {
    console.error('解析URL参数时出错:', error);
  }

  return result;
}
