const useRefreshList = ({
  api,
  extraParams
}: {
  api: (params: any) => Promise<any>;
  extraParams?: Record<string, unknown>;
}) => {
  // 状态
  const state = reactive({
    dataSource: [],
    finished: false,
    isLoading: false,
    loading: false,
    error: false,
    pageable: {
      pageNum: 1,
      pageSize: 10,
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
      const { records, totalRow } = data;
      state.pageable.totalRow = totalRow;

      // 判断是否还有下一页
      const currentPageNum = state.pageable.pageNum;
      const noMoreData = records.length < state.pageable.pageSize || currentPageNum * state.pageable.pageSize >= totalRow;

      if (currentPageNum === 1) {
        state.dataSource = records;
      } else {
        state.dataSource = [...state.dataSource, ...records];
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
      state.loading = false;
    }
  };

  // 上拉加载
  const onLoad = async () => {
    if (state.loading) return;

    state.loading = true;
    try {
      await getList();
    } finally {
      // 只重置上拉加载状态
      state.loading = false;
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    if (state.isLoading) return;

    state.isLoading = true;
    state.pageable.pageNum = 1;
    state.dataSource = [];
    state.finished = false;
    state.error = false;

    try {
      await getList();
    } finally {
      state.isLoading = false;
    }
  };

  // 搜索
  const onSearch = (searchParams = {}) => {
    state.searchParam = searchParams;

    state.pageable.pageNum = 1;
    state.dataSource = [];
    state.finished = false;
    state.error = false;

    onLoad();
  };

  // 重置
  const onReset = () => {
    state.searchParam = {};

    state.pageable.pageNum = 1;
    state.dataSource = [];
    state.finished = false;
    state.error = false;

    onLoad();
  };

  return {
    state,
    onLoad,
    onRefresh,
    onSearch,
    onReset
  };
};

export default useRefreshList;
