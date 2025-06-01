<template>
  <van-pull-refresh
    v-model="state.isLoading"
    @refresh="onRefresh"
    pulling-text="下拉释放刷新"
    loosing-text="下拉释放刷新"
    loading-text="刷新中..."
    v-bind="$attrs"
  >
    <!-- 额外插槽 -->
    <template
      v-for="slot in filteredSlots"
      #[slot]
    >
      <slot :name="slot" />
    </template>
    <!-- 搜索自定义插槽 -->
    <div class="search-container">
      <slot name="search" />
    </div>
    <van-list
      v-model:loading="state.loading"
      :finished="state.finished"
      :immediate-check="false"
      :offset="50"
      finished-text="没有更多了"
      loading-text="加载中..."
      v-model:error="state.error"
      error-text="请求失败，点击重新加载"
      v-bind="$attrs"
      @load="onLoad"
    >
      <template #default>
        <slot :data="state.dataSource || []" />
      </template>
      <!-- 额外的插槽 -->
      <template
        v-for="slot in filteredSlots"
        #[slot]
      >
        <slot :name="slot" />
      </template>
    </van-list>
  </van-pull-refresh>
</template>

<script lang="ts" setup>
import useRefreshList from '@/composables/useRefreshList';

interface Props {
  extraParams?: Record<string, unknown>;
  apiFn: (params: any) => Promise<any>;
  immediate?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  extraParams: () => ({}),
  immediate: true
});

const slots = useSlots();
const filteredSlots = computed(() => Object.keys(slots).filter(slot => slot !== 'default'));

const { state, onRefresh, onLoad, onSearch, onReset } = useRefreshList({
  api: props.apiFn,
  extraParams: props.extraParams
});

onMounted(() => {
  props.immediate && onLoad();
});

defineExpose({
  onRefresh,
  onLoad,
  onSearch,
  onReset
});
</script>
