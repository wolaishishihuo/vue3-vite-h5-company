/**
 * 输入框失去焦点时重置值
 * @param row 数据对象
 * @param prop 属性名
 * @param min 最小值
 * @param max 最大值
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
