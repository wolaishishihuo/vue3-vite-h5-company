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
