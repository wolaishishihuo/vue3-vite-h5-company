export interface TableColumn {
  prop: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  class?: string;
  show?: () => boolean;
  render?: (row: any, column: TableColumn) => any; // 添加render函数支持
}

export interface TreeProps {
  label: string;
  children: string;
  [key: string]: any;
}

export interface TableTreeProps {
  columns: TableColumn[];
  data: any[];
  headerCellStyle?: Record<string, any>;
  rowCellStyle?: Record<string, any>;
  treeProps?: TreeProps;
  nodeKey?: string;
}
