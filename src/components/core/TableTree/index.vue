<template>
  <div class="rounded-8px bg-white w-full">
    <!-- 表头 -->
    <div class="text-28px text-primary font-500 leading-80px pl-42px bg-secondary flex h-80px" :style="headerCellStyle">
      <template v-for="column in columns" :key="column.prop">
        <div class="flex-1" v-if="column.show?.() ?? true" :class="[transformAlign(column.align), column.class ? column.class : '']">
          {{ column.label }}
        </div>
      </template>
    </div>
    <!-- 树形部分 -->
    <div>
      <el-tree
        :props="treeProps"
        :node-key="nodeKey"
        :data="data"
        v-bind="$attrs"
      >
        <template #default="{ data }">
          <div class="text-28px text-primary font-500 flex w-full" :style="rowCellStyle">
            <template v-for="column in columns" :key="column.prop">
              <div class="flex-1" v-if="column.show?.() ?? true" :class="[transformAlign(column.align), column.class ? column.class : '']">
                {{ data?.[column.prop] }}
              </div>
            </template>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps({
  columns: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  headerCellStyle: {
    type: Object as PropType<any>,
    default: () => {}
  },
  rowCellStyle: {
    type: Object as PropType<any>,
    default: () => {}
  },
  treeProps: {
    type: Object as PropType<any>,
    default: () => ({
      label: 'name',
      children: 'children'
    })
  },
  nodeKey: {
    type: String,
    default: 'id'
  }
});

const transformAlign = (align: string) => {
  switch (align) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
};
</script>

<style scoped lang="less">
:deep(.el-tree) {
  .el-tree-node__content {
    height: 80px;
    padding-left: 42px;
  }
}
</style>
