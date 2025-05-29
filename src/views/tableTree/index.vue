<template>
  <div class="table-tree">
    <TableTree :columns="columns" :header-cell-style="headerCellStyle" />
  </div>
</template>

<script setup lang='ts'>
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
</script>

<style scoped lang='less'>
.table-tree {
  width: 100%;
  height: 100%;
}
</style>
