import type { PageResult, ResultData } from '@/http/interface';

const useRefreshList = <T extends object>({
  api,
  extraParams = {}
}: {
  api: (params: any) => Promise<ResultData<PageResult<T>>>;
  extraParams?: Record<string, unknown>;
  immediate?: boolean;
}) => {
  const dataSource = ref<T[]>([]);
  // 状态
  const state = reactive({
    finished: false,
    isLoading: false,
    loading: false,
    error: false,
    pageable: {
      pageNum: 1,
      pageSize: 20,
      totalRow: 0
    },
    // 总参数(包含分页和查询参数)
    totalParam: {},
    searchParam: {}
  });

  // 初始参数
  const initialExtraParams = { ...extraParams };

  // 分页参数
  const pageParam = computed(() => ({
    pageNum: state.pageable.pageNum,
    pageSize: state.pageable.pageSize
  }));

  // 获取列表数据
  const getList = async () => {
    try {
      state.totalParam = {};
      Object.assign(state.totalParam, initialExtraParams, state.searchParam, pageParam.value);

      const { data } = await api(state.totalParam);
      const { records, total } = data;
      state.pageable.totalRow = total;

      // 判断是否还有下一页
      const currentPageNum = state.pageable.pageNum;
      const noMoreData = records.length < state.pageable.pageSize || currentPageNum * state.pageable.pageSize >= total;

      if (currentPageNum === 1) {
        dataSource.value = records;
      } else {
        dataSource.value = [...dataSource.value, ...records] as T[];
      }

      // 设置完成状态
      state.finished = noMoreData;

      // 页码递增准备下次请求
      state.pageable.pageNum++;

      // 清除错误状态
      state.error = false;
    } catch (err: any) {
      console.error('API Error:', err);
      state.finished = true;
      state.error = true;
    } finally {
      // 完成后重置loading状态
      state.loading = false;
    }
  };

  // 上拉加载
  const onLoad = async () => {
    if (state.isLoading) {
      dataSource.value = [];
      state.isLoading = false;
    }

    try {
      await getList();
    } finally {
      state.loading = false;
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    state.pageable.pageNum = 1;
    dataSource.value = [];
    state.finished = false;
    state.error = false;
    state.loading = true;
    onLoad();
  };

  // 搜索
  const onSearch = (searchParams = {}) => {
    state.searchParam = searchParams;

    state.pageable.pageNum = 1;
    dataSource.value = [];
    state.finished = false;
    state.error = false;

    onLoad();
  };

  // 重置
  const onReset = () => {
    onSearch({});
  };

  watch(
    () => extraParams,
    (val) => {
      Object.assign(initialExtraParams, val || {});
    },
    { deep: true }
  );

  return {
    dataSource,
    state,
    onLoad,
    onRefresh,
    onSearch,
    onReset
  };
};

export default useRefreshList;
