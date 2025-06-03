<template>
  <div class="rounded-8px bg-white w-full relative">
    <!-- 固定表头 -->
    <div class="text-28px text-primary leading-80px font-500 pl-42px bg-secondary flex h-80px top-0 sticky z-10" :style="headerCellStyle">
      <template v-for="column in columns" :key="column.prop">
        <div
          v-if="column.show?.() ?? true" class="flex-1" :class="[transformAlign(column.align), column.class ? column.class : '']"
          :style="column.width ? { flex: `0 0 ${column.width}px` } : {}"
        >
          {{ column.label }}
        </div>
      </template>
    </div>

    <!-- 可滚动的树形部分 -->
    <div class="overflow-y-auto">
      <el-tree
        ref="treeRef"
        :props="treeProps"
        :node-key="nodeKey"
        v-bind="$attrs"
      >
        <template #default="{ data: rowData }">
          <div class="text-28px flex w-full" :style="rowCellStyle">
            <template v-for="column in columns" :key="column.prop">
              <div
                v-if="column.show?.() ?? true" class="flex-1" :class="[transformAlign(column.align), column.class ? column.class : '']"
                :style="column.width ? { flex: `0 0 ${column.width}px` } : {}"
              >
                <component
                  :is="column.render"
                  v-if="column.render"
                  v-bind="rowData"
                />
                <template v-else>
                  {{ rowData?.[column.prop] }}
                </template>
              </div>
            </template>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang='ts'>
import type { ElTree } from 'element-plus';
import type { TableTreeProps } from './interface';

withDefaults(defineProps<TableTreeProps>(), {
  headerCellStyle: () => ({}),
  rowCellStyle: () => ({}),
  treeProps: () => ({
    label: 'name',
    children: 'children'
  }),
  nodeKey: () => 'id'
});

// 对齐方式处理
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

const treeRef = ref<InstanceType<typeof ElTree> | null>(null);

defineExpose({
  getTree: () => treeRef.value
});
</script>

<style scoped lang="less">
:deep(.el-tree) {
  .el-tree-node__content {
    height: 80px;
    padding-left: 42px;
  }
  .el-tree-node__expand-icon {
    font-size: 28px;
  }
  .el-tree-node {
    white-space: nowrap;
  }
}
</style>
