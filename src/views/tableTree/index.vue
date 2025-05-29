<template>
  <div class="table-tree">
    <TableTree
      :columns="columns"
      :header-cell-style="headerCellStyle"
      :data="treeData"
      :tree-props="treeProps"
      node-key="id"
      default-expand-all
    />
  </div>
</template>

<script setup lang='ts'>
import { getAreaTree } from '@/api/modules/organization';

const columns = ref([
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
]);
const headerCellStyle = ref({});
const treeProps = ref({
  children: 'children',
  label: 'name'
});

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
