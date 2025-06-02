<template>
  <div class="table-tree">
    <TableTree
      :columns="columns"
      :data="treeData"
      :tree-props="treeProps"
      node-key="id"
      default-expand-all
    />
  </div>
</template>

<script setup lang='ts'>
import { getAreaTree } from '@/api/modules/organization';
import type { TableColumn } from '@/components/core/TableTree/interface';

const columns: TableColumn[] = [
  {
    label: '姓名',
    prop: 'name',
    align: 'left'
  },
  {
    label: '年龄',
    prop: 'age'
  },
  {
    label: '操作',
    prop: 'operation'
  }
];

const treeProps = {
  children: 'children',
  label: 'name'
};

const treeData = ref<any[]>([]);
const getAreaTreeApi = async () => {
  const { data } = await getAreaTree();
  treeData.value = data as any[];
};
getAreaTreeApi();
</script>

<style scoped lang='less'>
.table-tree {
  width: 100%;
  height: 100%;
}
</style>
