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
