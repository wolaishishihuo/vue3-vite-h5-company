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
