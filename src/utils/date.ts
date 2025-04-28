// 这样导入需要配置tsconfig.json
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * 格式化日期时间字符串
 * @param dateString 日期时间字符串
 * @param format 日期格式，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期时间字符串，如果解析失败则返回 null
 */
export function formatDate(dateString: string, format: string = 'YYYY-MM-DD'): string | null {
  // 使用 day.js 解析日期时间字符串
  const parsedDate = dayjs(dateString);
  // 如果解析失败，返回 null
  if (!parsedDate.isValid()) {
    return null;
  }
  // 返回格式化后的日期时间字符串
  return parsedDate.format(format);
}

/**
 * 获取近七天的日期
 * @param format 日期格式，默认为 'YYYY-MM-DD'
 * @returns 近七天的日期数组
 */
export function getLastSevenDays(format: string = 'YYYY-MM-DD'): string[] {
  const dates: string[] = [];
  const today = dayjs();

  for (let i = 0; i < 7; i++) {
    const date = today.subtract(i, 'day');
    dates.push(date.format(format));
  }

  return dates;
}

/**
 * 判断日期是否属于当前月、上个月或下个月
 * @param dateString 日期字符串
 * @returns 返回 'current' 表示当前月，'previous' 表示上个月，'next' 表示下个月，'other' 表示其他月份
 */
export function getMonthRelation(dateString: string): 'current' | 'previous' | 'next' | 'other' {
  const date = dayjs(dateString);
  const currentMonth = dayjs().month();
  const previousMonth = dayjs().subtract(1, 'month').month();
  const nextMonth = dayjs().add(1, 'month').month();

  const dateMonth = date.month();

  if (dateMonth === currentMonth) {
    return 'current';
  } else if (dateMonth === previousMonth) {
    return 'previous';
  } else if (dateMonth === nextMonth) {
    return 'next';
  } else {
    return 'other';
  }
}

/**
 * 传入一个时间戳或时间格式的字符串，返回包含年月日的对象
 * @param dateInput 时间格式或时间戳
 * @param inputFormat 输入日期格式（可选）
 * @returns 包含年月日的对象
 */
export function parseDateToObject(
  dateInput: string | number,
  inputFormat?: string
): {
    year: number;
    month: number;
    day: number;
  } {
  let date: dayjs.Dayjs;

  if (typeof dateInput === 'number') {
    // 如果是时间戳
    date = dayjs(dateInput);
  } else {
    // 如果是日期字符串
    date = dayjs(dateInput, inputFormat);
  }

  if (!date.isValid()) {
    throw new Error('Invalid date format');
  }

  return {
    year: date.year(),
    month: date.month() + 1, // 月份从 0 开始，需要加 1
    day: date.date()
  };
}

/**
 * 计算两个日期之间的时间差，返回相隔多少年、多少月、多少天
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 包含年、月、天的对象
 */
export function dateDiff(startDate: string, endDate: string): { years: number; months: number; days: number } {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    throw new Error('Invalid date format');
  }

  const diffInDays = end.diff(start, 'day');
  const duration = dayjs.duration(diffInDays, 'day');

  const years = duration.years();
  const months = duration.months();
  const days = duration.days();

  return { years, months, days };
}

/**
 * 检查开始时间是否超过结束时间
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 如果开始时间在结束时间之前，返回 true，否则返回 false
 */
export function isValidTimeRange(startDate: string, endDate: string): boolean {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    throw new Error('Invalid date format');
  }

  return start.isBefore(end);
}

/**
 * 将日期格式转换为兼容 iOS 的格式，并在转换过程中确保年月日小于两位数的前面补0
 * @param dateString 日期字符串
 * @param inputFormat 输入日期格式 默认 'YYYY-MM-DD'
 * @param outputFormat 输出日期格式 默认 'YYYY/MM/DD'
 * @returns 转换后的日期字符串 例如：console.log('2023-10-01'); // 输出：2023/10/01
 */
export function iosDateFormat(
  dateString: string,
  inputFormat: string = 'YYYY-MM-DD',
  outputFormat: string = 'YYYY/MM/DD'
): string {
  const date = dayjs(dateString, inputFormat);

  if (!date.isValid()) {
    throw new Error('Invalid date format');
  }

  return date.format(outputFormat);
}
