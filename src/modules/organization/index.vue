<template>
  <div class="relative h-full flex-col bg-white">
    <!-- 吸顶搜索区域 -->
    <div class="sticky top-0 z-20 p-15">
      <Search
        v-model="searchState.xm"
        placeholder="请输入姓名"
        clearable
        @search="handleSearch"
      />
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto p-0_30">
      <RefreshList
        ref="refreshListRef"
        :api-fn="getOrganizationList"
        :extra-params="searchState"
        @change="handleRefreshChange"
      >
        <template #default="{ data }">
          <TransitionGroup name="list" tag="div" class="pb-20px">
            <template v-for="item in (data as PersonnelItem[])" :key="item.id">
              <!-- 组织机构项 -->
              <div
                v-if="item.isParent"
                class="border-b border-hex-e9e9e9 border-solid py-15 transition-all duration-300 ease-in-out active:bg-[#f5f5f5]"
                @click="handleCellClick(item as PersonnelItem)"
              >
                <div class="w-full flex-between">
                  <div class="flex-between text-36px text-[#333]">
                    <img src="@/assets/images/org.png" class="mr-15px wh-48">
                    {{ item.name }}
                  </div>
                  <van-icon name="arrow" class="text-gray" />
                </div>
              </div>

              <!-- 人员项 -->
              <div v-else class="border-b border-hex-e9e9e9 border-solid py-15 transition-all duration-300 ease-in-out active:bg-[#f5f5f5]">
                <div class="w-full flex-between">
                  <div class="flex-center text-36px text-[#333]">
                    <van-icon name="contact" class="mr-10px text-[#666]" />
                    {{ item.xm }}
                  </div>
                  <van-checkbox
                    v-model="item.checked"
                    @click="handleCheckChange(item as PersonnelItem)"
                  />
                </div>
              </div>
            </template>
          </TransitionGroup>
        </template>
      </RefreshList>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="!!selectedCount" class="flex-x-between fixed bottom-0 left-0 right-0 z-10 h-100px bg-white p-30px shadow-[0px_5px_38px_0px_rgba(4,0,0,0.1)]">
      <div class="text-32px text-[#333]">
        {{ `已选择${selectedCount}人` }}
      </div>
      <div class="flex justify-end gap-20px">
        <slot name="footer-left" />
        <van-button size="small" @click="handleClear">
          清空
        </van-button>
        <van-button type="primary" size="small" @click="handleConfirm">
          确定
        </van-button>
        <slot name="footer-right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PersonnelItem } from '@/api/interface/organization';
import RefreshList from '@/components/core/RefreshList/index.vue';
import useOrganizationStore from '@/stores/modules/organization';
import { useOrganizationActions, useOrganizationApi, useOrganizationRouteParams, useOrganizationState } from './composables';

const refreshListRef = ref<InstanceType<typeof RefreshList>>();
const organizationStore = useOrganizationStore();

const { routeState } = useOrganizationRouteParams();
const { searchState } = useOrganizationState();

const { getOrganizationList, organizationCatch } = useOrganizationApi({
  routeState
});

const { selectedCount, selectedItems, handleRefreshChange, handleCheckChange, handleCellClick, handleSearch, handleClear } = useOrganizationActions({
  routeState,
  organizationCatch,
  refreshListRef,
  searchState
});

const handleConfirm = async () => {
  organizationStore.setCheckPersonList(selectedItems.value as PersonnelItem[]);
};
</script>

<style lang="less" scoped>
/* 列表动画效果 */
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
