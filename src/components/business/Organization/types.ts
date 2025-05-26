import type { Personnel } from '@/api/interface/personnel';

/**
 * 组织架构数据类型
 */
export interface Organization {
  id: number;
  dwh?: string;
  name: string;
  isParent?: boolean;
  children?: Organization[];
  checked?: boolean;
}

/**
 * 扩展人员类型
 */
export interface PersonnelItem extends Personnel {
  checked?: boolean;
  [key: string]: any;
}

/**
 * 组织架构和人员混合类型
 */
export type OrganizationPickerItem = Organization | PersonnelItem;

/**
 * 组织架构选择器属性
 */
export interface OrganizationPickerProps {
  /**
   * 自定义API函数
   */
  apiFn: (params: any) => Promise<any>;
  /**
   * 额外的查询参数
   */
  extra?: Record<string, any>;
  /**
   * 默认选中的人员
   */
  defaultSelected?: string[];
  /**
   * 是否支持多选
   */
  multiple?: boolean;
  /**
   * 最大选择数量
   */
  maxSelected?: number;
}

/**
 * 组织架构选择器事件
 */
export interface OrganizationPickerEmits {
  /**
   * 选择变更事件
   */
  (e: 'change', items: PersonnelItem[]): void;
  /**
   * 确认事件
   */
  (e: 'confirm', items: PersonnelItem[]): void;
  /**
   * 清空事件
   */
  (e: 'clear'): void;
  /**
   * 异常事件
   */
  (e: 'error', error: Error): void;
}

/**
 * 搜索参数类型
 */
export interface SearchParams {
  xm: string;
  [key: string]: any;
}
