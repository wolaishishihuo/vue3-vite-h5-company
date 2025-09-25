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
