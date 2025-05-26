import { computed, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import type { OrganizationPickerProps, PersonnelItem, SearchParams } from '@/components/business/Organization/types';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import type RefreshList from '@/components/RefreshList/index.vue';
import useOrganizationStore from '@/stores/modules/organization.ts';

interface UseOrganizationPickerOptions {
  props: OrganizationPickerProps;
  emit: any;
  refreshListRef: Ref<InstanceType<typeof RefreshList>>;
  router: Router;
  route: RouteLocationNormalizedLoaded;
}

export function useOrganizationPicker(options: UseOrganizationPickerOptions) {
  const { props, emit, refreshListRef, router, route } = options;
  const organizationStore = useOrganizationStore();
  // 搜索参数
  const searchParams = reactive<SearchParams>({
    xm: '',
    ...props.extra
  });

  // 选中的项目
  const selectedItems = ref<PersonnelItem[]>([]);

  // 已选择人数
  const selectedCount = computed(() => {
    if (!refreshListRef.value?.dataSource) return 0;
    return refreshListRef.value.dataSource.filter((item: PersonnelItem) => item.checked).length || 0;
  });

  /**
   * 获取组织架构和人员列表数据
   * 直接调用外部传入的 apiFn 函数
   */
  const fetchData = async (queryParams: SearchParams) => {
    try {
      // 合并查询参数
      const params = {
        ...queryParams,
        ...searchParams
      };

      // 调用外部传入的API函数
      const result = await props.apiFn(params);

      // 处理返回的数据，添加选中状态
      if (result.data && result.data.records) {
        result.data.records = result.data.records.map((item: PersonnelItem) => ({
          ...item,
          checked: !!selectedItems.value.find(selected => selected.id === item.id)
        }));
      }

      return result;
    } catch (error) {
      console.error('获取数据失败', error);
      emit('error', error);
      return {
        data: {
          records: [],
          totalRow: 0
        }
      };
    }
  };

  /**
   * 处理搜索事件
   */
  const handleSearch = () => {
    if (refreshListRef.value) {
      refreshListRef.value.onSearch();
    }
  };

  /**
   * 处理Cell点击事件
   */
  const handleCellClick = (item: PersonnelItem) => {
    if (!item.isParent) return;

    // 更新路由
    router.push({
      path: route.query.path as string,
      query: {
        ...route.query,
        dwh: item.dwh || item.id,
        fromPath: route.query.fromPath
      }
    });
  };

  /**
   * 处理复选框变更事件
   */
  const handleCheckChange = (item: PersonnelItem) => {
    if (!props.multiple && item.checked) {
      // 单选模式下，取消其他选择
      refreshListRef.value?.dataSource.forEach((dataItem: PersonnelItem) => {
        if (dataItem.id !== item.id) {
          dataItem.checked = false;
        }
      });
    }

    // 检查是否超过最大选择数量
    if (props.maxSelected && selectedCount.value > props.maxSelected && item.checked) {
      item.checked = false;
      return;
    }

    // 更新选中项目列表
    updateSelectedItems();

    // 触发变更事件
    emit('change', selectedItems.value);
  };

  /**
   * 更新选中的项目
   */
  const updateSelectedItems = () => {
    if (!refreshListRef.value?.dataSource) return;

    organizationStore.clearCheckPerson();

    selectedItems.value = refreshListRef.value.dataSource
      .filter((item: PersonnelItem) => !item.isParent && item.checked)
      .map((item: PersonnelItem) => ({
        ...item,
        checked: true
      }));

    organizationStore.setCheckPersonList(selectedItems.value);
  };

  /**
   * 加载已选择的项目
   */
  const loadSelectedItems = (items: string[]) => {
    // selectedItems.value = [...items];

    // 更新数据源中的选中状态
    if (refreshListRef.value?.dataSource) {
      refreshListRef.value.dataSource.forEach((item: PersonnelItem) => {
        if (!item.isParent) {
          item.checked = !!items.find(selected => selected === item.id);
        }
      });
    }
  };

  /**
   * 清空选择
   */
  const handleClear = () => {
    if (refreshListRef.value?.dataSource) {
      refreshListRef.value.dataSource.forEach((item: PersonnelItem) => {
        item.checked = false;
      });
      selectedItems.value = [];
    }

    organizationStore.clearCheckPerson();

    emit('clear');
  };

  /**
   * 确认选择
   */
  const handleConfirm = async () => {
    updateSelectedItems();
    await emit('confirm', selectedItems.value);
  };

  return {
    searchParams,
    selectedItems,
    selectedCount,
    fetchData,
    handleSearch,
    handleCellClick,
    handleCheckChange,
    handleClear,
    handleConfirm,
    loadSelectedItems,
    updateSelectedItems
  };
}
