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
