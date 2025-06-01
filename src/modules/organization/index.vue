<template>
  <div class="bg-white flex-col h-full relative">
    <!-- 吸顶搜索区域 -->
    <div class="p-15 top-0 sticky z-20">
      <Search
        v-model="searchState.xm"
        placeholder="请输入姓名"
        @search="handleSearch"
        clearable
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
            <template v-for="item in data" :key="item.id">
              <!-- 组织机构项 -->
              <div
                v-if="item.isParent"
                @click="handleCellClick(item as PersonnelItem)"
                class="py-15 border-b border-hex-e9e9e9 border-solid transition-all duration-300 ease-in-out active:bg-[#f5f5f5]"
              >
                <div class="flex-between w-full">
                  <div class="text-36px text-[#333] flex-between">
                    <img src="@/assets/images/org.png" class="mr-15px wh-48">
                    {{ item.name }}
                  </div>
                  <van-icon name="arrow" class="text-gray" />
                </div>
              </div>

              <!-- 人员项 -->
              <div v-else class="py-15 border-b border-hex-e9e9e9 border-solid transition-all duration-300 ease-in-out active:bg-[#f5f5f5]">
                <div class="flex-between w-full">
                  <div class="text-36px text-[#333] flex-center">
                    <van-icon name="contact" class="text-[#666] mr-10px" />
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
    <div v-if="!!selectedCount" class="flex-x-between p-30px bg-white h-100px shadow-[0px_5px_38px_0px_rgba(4,0,0,0.1)] bottom-0 left-0 right-0 fixed z-10">
      <div class="text-32px text-[#333]">
        {{ `已选择${selectedCount}人` }}
      </div>
      <div class="flex gap-20px justify-end">
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
import RefreshList from '@/components/core/RefreshList/index.vue';
import useOrganizationApi from './composables/useOrganizationApi';
import useOrganizationActions from './composables/useOrganizationActions';
import useOrganizationState from './composables/useOrganizationState';
import useOrganizationRouteParams from './composables/useOrganizationRouteParams';
import type { PersonnelItem } from '@/api/interface/organization';
import useOrganizationStore from '@/stores/modules/organization';

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
