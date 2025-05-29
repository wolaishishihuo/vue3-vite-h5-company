<template>
  <van-pull-refresh
    v-model="isLoading"
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
      v-model:loading="loading"
      :finished="finished"
      :immediate-check="false"
      :offset="50"
      finished-text="没有更多了"
      loading-text="加载中..."
      v-model:error="error"
      error-text="请求失败，点击重新加载"
      v-bind="$attrs"
      @load="onLoad"
    >
      <!-- 数据源插槽 item 的数据作为插槽传入 作为默认插槽显示内容 -->
      <template #default>
        <slot :data="dataSource || []" />
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
interface Item {
  // 具体的参数和类型 这里只做演示
  [key: string]: any;
}

// 定义一个泛型接口来描述 props 的结构
interface Props {
  extra?: Record<string, unknown>; // 表示任意结构的对象
  apiFn: (params: any) => Promise<any>; // 接口函数
  [key: string]: any; // 其他 props 属性
  pageNo?: number; // 分页参数
  pageSize?: number; // 分页参数
}

// 使用泛型来限制 extra 的类型
const props = withDefaults(defineProps<Props>(), {
  extra: () => ({}), // 设置一个空对象作为默认值
  pageNo: 1, // 默认值为 1
  pageSize: 20 // 默认值为 20
});

// 是否处于加载中状态 PullRefresh 下拉刷新
const isLoading = ref(false);
// 是否处于加载状态，加载过程中不触发 load 事件
const loading = ref(false);
// 是否已加载完成，加载完成后不再触发 load 事件
const finished = ref(false);
// 是否加载失败，加载失败后点击错误提示可以重新触发 load 事件
const error = ref(false);
// 分页相关参数 数据源
const pageNo = ref(props.pageNo);
const pageSize = ref(props.pageSize);
const dataSource = ref<Item>([]);

// 插槽数量
const slots = useSlots();
// 计算属性：过滤掉 'default' 插槽
const filteredSlots = computed(() => {
  return Object.keys(slots).filter(slot => slot !== 'default');
});
// console.log(filteredSlots, 'filteredSlots');

// 可变更的 额外参数
const extraParams = ref(props.extra);

// 封装 API 调用逻辑
const getList = async () => {
  loading.value = true;
  try {
    const response = await props.apiFn({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      // 合并额外参数
      ...extraParams.value
    });
    const { list, total } = response;
    // 判断是否还有下一页 如果没有 加载完毕 / 判断空数据和不够10条数据情况
    if (list.length < pageSize.value || total / pageSize.value <= pageNo.value || list.length >= total) {
      finished.value = true;
    }
    dataSource.value = pageNo.value === 1 ? response.list : dataSource.value.concat(response.list);
    // 如果还有下一页 页码+1
    pageNo.value++;
  } catch (error: any) {
    console.error('API Error:', error);
    finished.value = true;
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const onRefresh = async () => {
  pageNo.value = 1;
  dataSource.value = [];
  // 清空列表数据
  finished.value = false;
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};

const onLoad = async () => {
  if (isLoading.value) {
    dataSource.value = [];
    isLoading.value = false;
  }
  try {
    await getList();
  } finally {
    loading.value = false; // 确保在加载数据后关闭 loading 状态
  }
};

const onSearch = () => {
  pageNo.value = 1;
  dataSource.value = [];
  finished.value = false;
  onLoad();
};

const onReset = () => {
  extraParams.value = {};
  // 重置其他搜索参数
  onSearch();
};
// 初始化数据
onMounted(() => {
  getList();
});

watch(
  () => props.extra,
  (val) => {
    extraParams.value = val;
  },
  { deep: true }
);
// 抛出这些方法供外部使用
defineExpose({
  onRefresh,
  onLoad,
  onSearch,
  onReset
});
</script>
