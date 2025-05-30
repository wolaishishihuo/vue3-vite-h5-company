import type { PersonnelItem } from '@/api/interface/organization';
import type { RouteState } from './useOrganizationRouteParams';
import type RefreshList from '@/components/RefreshList/index.vue';
import useOrganizationStore from '@/stores/modules/organization';

const useOrganizationActions = ({
  routeState,
  organizationCatch,
  refreshListRef,
  searchState
}: {
  routeState: RouteState;
  organizationCatch: Ref<Map<string, true>>;
  refreshListRef: Ref<InstanceType<typeof RefreshList>>;
  searchState: Ref<{
    xm: string;
    dwh: string;
  }>;
}) => {
  const router = useRouter();
  const organizationStore = useOrganizationStore();
  // 数据源
  const dataSource = computed(() => refreshListRef.value?.dataSource);

  // 已选择人数
  const selectedCount = computed(() => {
    if (!dataSource.value) return 0;
    return dataSource.value.filter((item: PersonnelItem) => item.checked).length || 0;
  });

  // 已选择人员
  const selectedItems = computed(() => {
    if (!dataSource.value) return [];
    return dataSource.value.filter(item => !item.isParent && item.checked);
  });

  // 处理下拉刷新事件
  const handleRefreshChange = ({ status, distance }: { status: string; distance: number }) => {
    if (status === 'pulling' && distance !== 100) {
      organizationCatch.value.clear();
    }
  };

  // 处理复选框变更事件
  const handleCheckChange = (item: PersonnelItem) => {
    const currentId = item.id;
    console.log('handleCheckChange', currentId, item);
    // 单选
    if (!routeState.multiple && item.checked) {
      dataSource.value.forEach((dataItem: PersonnelItem) => {
        if (dataItem.id !== currentId) {
          dataItem.checked = false;
        }
      });
    }

    // 检查是否超过最大选择数量
    if (routeState.maxSelected && selectedCount.value > routeState.maxSelected && item.checked) {
      item.checked = false;
    }
  };

  // 处理组织架构项点击事件
  const handleCellClick = (item: PersonnelItem) => {
    if (!item.isParent) return;
    router.push({
      path: '/organization',
      query: {
        dwh: item.dwh,
        depth: (routeState.depth + 1).toString()
      }
    });
  };

  const handleSearch = () => {
    if (!searchState.value.xm) {
      organizationCatch.value.clear();
    }
    refreshListRef.value?.onSearch();
  };

  const handleClear = () => {
    if (!dataSource.value) return;

    dataSource.value.forEach((item: PersonnelItem) => {
      item.checked = false;
    });

    organizationStore.clearCheckPerson();
  };

  return {
    selectedCount,
    selectedItems,
    handleRefreshChange,
    handleCheckChange,
    handleCellClick,
    handleSearch,
    handleClear
  };
};

export default useOrganizationActions;
