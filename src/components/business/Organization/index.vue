<template>
  <div class="org-picker">
    <!-- 吸顶搜索区域 -->
    <div class="org-picker__search">
      <Search
        v-model="searchParams.xm"
        placeholder="请输入姓名"
        @search="handleSearch"
        clearable
      />
      <slot name="extra-search" />
    </div>

    <!-- 内容区域 -->
    <div class="org-picker__content">
      <RefreshList
        ref="refreshListRef"
        :api-fn="fetchData"
        :extra="searchParams"
        class="org-picker__refresh-list"
      >
        <template #default="{ data }">
          <TransitionGroup name="list" tag="div" class="org-picker__list">
            <template v-for="item in data" :key="item.id">
              <!-- 组织机构项 -->
              <Cell
                v-if="item.isParent"
                @click="handleCellClick(item as PersonnelItem)"
                class="org-picker__cell"
              >
                <div class="org-picker__cell-content">
                  <div class="org-picker__item-title">
                    <img src="@/assets/images/org.png" class="org-picker__item-icon">
                    {{ item.name }}
                  </div>
                  <van-icon name="arrow" class="org-picker__arrow-icon" />
                </div>
              </Cell>

              <!-- 人员项 -->
              <Cell v-else class="org-picker__cell">
                <div class="org-picker__cell-content">
                  <div class="org-picker__item-title">
                    <van-icon name="contact" class="org-picker__person-icon" />
                    {{ item.xm }}
                  </div>
                  <van-checkbox
                    v-model="item.checked"
                    @change="handleCheckChange(item as PersonnelItem)"
                  />
                </div>
              </Cell>
            </template>
          </TransitionGroup>
        </template>
      </RefreshList>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="!!selectedCount" class="org-picker__footer">
      <div class="org-picker__selected-count">
        {{ `已选择${selectedCount}人` }}
      </div>
      <div class="org-picker__actions">
        <slot name="footer-left" />
        <van-button @click="handleClear" size="small">
          清空
        </van-button>
        <van-button type="primary" @click="handleConfirm" size="small">
          确定
        </van-button>
        <slot name="footer-right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RefreshList from '@/components/RefreshList/index.vue';
import { useOrganizationPicker } from '@/composables/useOrganization.ts';
import type { OrganizationPickerEmits, OrganizationPickerProps, PersonnelItem } from './types.ts';

const props = withDefaults(defineProps<OrganizationPickerProps>(), {
  formPath: '',
  multiple: true,
  extra: () => ({}),
  defaultSelected: () => ([])
});

const emit = defineEmits<OrganizationPickerEmits>();

const refreshListRef = ref<InstanceType<typeof RefreshList>>();
const router = useRouter();
const route = useRoute();

// 使用组合式函数处理组织架构选择逻辑
const {
  searchParams,
  selectedItems,
  fetchData,
  handleCellClick,
  handleSearch,
  handleCheckChange,
  handleClear,
  handleConfirm,
  selectedCount,
  loadSelectedItems
} = useOrganizationPicker({
  props,
  emit,
  refreshListRef,
  router,
  route
});

// 初始化已选择的项目
onMounted(() => {
  if (props.defaultSelected && props.defaultSelected.length > 0) {
    loadSelectedItems(props.defaultSelected);
  }
});

// 监听外部变化
watch(() => props.defaultSelected, (newVal) => {
  if (newVal && newVal.length > 0) {
    loadSelectedItems(newVal);
  }
}, { deep: true });

watch(() => props.extra, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    handleSearch();
  }
}, { deep: true });

defineExpose({
  refresh: () => refreshListRef.value?.onRefresh(),
  search: handleSearch,
  clear: handleClear,
  confirm: handleConfirm,
  getSelectedItems: () => selectedItems.value,
  setSelectedItems: loadSelectedItems
});
</script>

<style lang="less" scoped>
// 组织架构选择器组件
.org-picker {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;

  // 搜索区域
  &__search {
    padding: 30px 30px 15px;
    background-color: white;
    z-index: 20;
    position: sticky;
    top: 0;
  }

  // 内容区域
  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 30px;
    margin-bottom: 100px; // 为底部操作栏留出空间
  }

  // 刷新列表
  &__refresh-list {
    width: 100%;
    overflow-y: auto;
    height: 100%;
  }

  // 列表容器
  &__list {
    padding-bottom: 20px;
  }

  // 单元格
  &__cell {
    transition: all 0.3s ease-in-out;

    &:active {
      background-color: #f5f5f5;
    }
  }

  // 单元格内容
  &__cell-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  // 项目标题
  &__item-title {
    font-size: 36px;
    color: #333;
    display: flex;
    align-items: center;
  }

  // 组织图标
  &__item-icon {
    margin-right: 10px;
    height: 36px;
    width: 36px;
  }

  // 人员图标
  &__person-icon {
    color: #666;
    margin-right: 10px;
  }

  // 箭头图标
  &__arrow-icon {
    color: #999;
  }

  // 底部栏
  &__footer {
    padding: 30px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    box-shadow: 0px 5px 38px 0px rgba(4, 0, 0, 0.1);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }

  // 已选择计数
  &__selected-count {
    font-size: 32px;
    color: #333;
  }

  // 操作按钮区
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }
}

// 列表动画效果
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-leave-to,
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>
