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

/**
 * 输入框失去焦点时重置值
 * @param row 数据对象
 * @param prop 属性名
 * @param min 最小值
 * @param max 最大值
 * @returns 重置后的值
 */

export const inputBlurResetVal = (row: any, prop: string, min: string | number, max: string | number) => {
  // 确保 min 和 max 是数字类型
  const minNum = Number(min);
  const maxNum = Number(max);

  if (Number.isNaN(minNum) || Number.isNaN(maxNum)) {
    throw new TypeError('min 或 max 不是有效的数字');
  }

  if (typeof row === 'object' && row !== null) {
    // 确保 row[prop] 是数字类型
    const propValue = Number(row[prop]);

    if (Number.isNaN(propValue)) {
      row[prop] = minNum;
    } else if (propValue < minNum) {
      row[prop] = minNum;
    } else if (propValue > maxNum) {
      row[prop] = maxNum;
    } else {
      row[prop] = propValue;
    }
  } else {
    throw new Error('传进来的参数 row 不是一个对象');
  }
};

/**
 * 脱敏函数
 * @param input 输入的字符串或数字
 * @param frontChars 前面保留的字符数
 * @param backChars 后面保留的字符数
 * @param maskChar 脱敏字符，默认为 '*'
 * @returns 脱敏后的字符串
 */

export const desensitize = (
  input: string | number,
  frontChars: number,
  backChars: number,
  maskChar: string = '*'
): string => {
  // 将输入转换为字符串
  const inputStr = input.toString();
  const inputLength = inputStr.length;
  // 检查参数是否合法
  if (frontChars < 0 || backChars < 0 || frontChars + backChars >= inputLength) {
    throw new Error('参数不合法，前面和后面保留的字符数之和不能大于或等于输入字符串的长度');
  }
  // 计算需要脱敏的字符数
  const maskLength = inputLength - frontChars - backChars;
  // 生成脱敏字符串
  const maskedPart = maskChar.repeat(maskLength);
  // 拼接结果
  const result = inputStr.slice(0, frontChars) + maskedPart + inputStr.slice(-backChars);
  return result;
};

/**
 * 数组对象去重，依据某个属性（默认是 id）
 * @param array 输入的数组对象
 * @param key 去重依据的属性，默认为 'id'
 * @returns 去重后的数组对象
 */
export const uniqueArrayByKey = <T>(array: T[], key: keyof T = 'id' as keyof T): T[] => {
  const keyMap = new Set();
  return array.filter((item) => {
    const value = item[key];
    return keyMap.has(value) ? false : keyMap.add(value);
  });
};

/**
 * 获取屏幕的宽度和高度
 * @returns 包含屏幕宽度和高度的对象
 */
export const getScreenSize = (): { width: number; height: number } => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
};

/**
 * 排序函数
 * @param arr 需要排序的数组
 * @param order 排序顺序：'asc' 表示升序，'desc' 表示降序
 * @returns 排序后的数组 console.log(sortArray(numbers, 'asc')) 优先数字 时间 其次字符串 others
 */
export const sortArray = <T>(arr: T[], order: 'asc' | 'desc' = 'asc'): T[] => {
  return arr.sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
      // 数字排序
      return order === 'asc' ? a - b : b - a;
    } else if (a instanceof Date && b instanceof Date) {
      // 时间排序
      return order === 'asc' ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
    } else {
      // 其他类型的排序（默认按字符串排序）
      const strA = String(a);
      const strB = String(b);
      return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    }
  });
};

/**
 * 深拷贝函数
 * @param obj 要拷贝的对象
 * @param hash 用于存储已克隆对象的 WeakMap 处理循环引用的问题
 * @returns 拷贝后的新对象
 */
export function deepClone<T>(obj: T, hash = new WeakMap()): T {
  // 处理 null 和 undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理已经克隆过的对象
  if (hash.has(obj)) {
    return hash.get(obj) as T;
  }

  // 创建新的对象或数组
  let cloneObj: any;
  if (Array.isArray(obj)) {
    cloneObj = [] as any[];
  } else if (obj instanceof Date) {
    cloneObj = new Date(obj);
  } else if (obj instanceof RegExp) {
    cloneObj = new RegExp(obj);
  } else if (obj instanceof Map) {
    cloneObj = new Map();
  } else if (obj instanceof Set) {
    cloneObj = new Set();
  } else if (typeof obj === 'function') {
    cloneObj = obj; // 函数通常是不可变的，直接返回
  } else {
    cloneObj = {} as { [key: string]: any };
  }

  // 存储已克隆的对象
  hash.set(obj as object, cloneObj);

  // 遍历对象或数组
  Object.keys(obj).forEach((key) => {
    cloneObj[key] = deepClone((obj as any)[key], hash);
  });

  // 特殊类型处理
  if (obj instanceof Map) {
    obj.forEach((value, key) => {
      cloneObj.set(key, deepClone(value, hash));
    });
  } else if (obj instanceof Set) {
    obj.forEach((value) => {
      cloneObj.add(deepClone(value, hash));
    });
  }

  return cloneObj as T;
}

/**
 * 将树形结构转换为扁平数组
 * @param tree 树形结构数组
 * @param childrenKey 子节点的属性名，默认为 'children'
 * @param parentKey 父节点引用的属性名，如果提供则会添加该属性
 * @param hasChildrenKey 标识是否有子节点的属性名，默认为 'hasChildren'
 * @returns 扁平化后的数组
 */
export const treeToArray = (
  tree: Record<string, any>[],
  childrenKey: string = 'children',
  parentKey?: string,
  hasChildrenKey: string = 'hasChildren'
): Record<string, any>[] => {
  const result: Record<string, any>[] = [];
  const stack: Array<{ node: Record<string, any>; parent?: Record<string, any> }> = tree.map(node => ({
    node,
    parent: undefined
  }));

  while (stack.length > 0) {
    // 非空断言因为 while 判断保证了数组非空
    const { node, parent } = stack.pop()!;

    // 创建节点副本，避免修改原始数据
    const copy: Record<string, any> = { ...node };

    // 如果需要保留父节点引用
    if (parentKey && parent) {
      copy[parentKey] = parent;
    }

    // 判断是否有子节点并设置标识
    const hasChildren = Array.isArray(node[childrenKey]) && node[childrenKey].length > 0;
    // 始终添加是否有子节点的标识
    copy[hasChildrenKey] = hasChildren;

    // 处理子节点
    if (hasChildren) {
      // 将子节点加入栈中，以便处理
      for (let i = node[childrenKey].length - 1; i >= 0; i--) {
        stack.push({
          node: node[childrenKey][i],
          parent: node
        });
      }
    }

    // 移除子节点属性，保持数组元素扁平
    delete copy[childrenKey];

    result.push(copy);
  }

  return result;
};

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

/**
 * 将Base64转为文件对象
 * @param dataURL 要转换的Base64字符串
 * @param fileName 文件名，默认为 'photo.jpg'
 * @returns 转换后的File对象
 */
export const dataURLtoFile = (dataURL: string, fileName = 'photo.jpg'): File => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};
