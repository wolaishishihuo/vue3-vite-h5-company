import type { RouteState } from './useOrganizationRouteParams';
import { getOrganizations, getOrganizationsSubNodes, getPersonnelList } from '@/api/modules/organization';

const useOrganizationApi = ({
  routeState
}: {
  routeState: RouteState;
}) => {
  const organizationCatch = ref(new Map<string, true>());

  const getOrganizationList = async (params: any) => {
    console.log(params, routeState.depth);

    if (params.xm) {
      return await getPersonnelBySearch(params);
    }

    // 获取顶级组织架构
    if (routeState.depth === 1) {
      return await getTopLevelOrganizations();
    }

    // 获取子组织架构和人员
    return await getSubOrganizationsAndPersonnel(params);
  };

  // 获取顶级组织架构
  const getTopLevelOrganizations = async () => {
    const { data } = await getOrganizations();

    return {
      data: {
        records: data,
        totalRow: data.length
      }
    };
  };

  // 根据搜索条件获取人员
  const getPersonnelBySearch = async (searchParams) => {
    const personRecords = await getPersonnelList(searchParams);

    return {
      data: {
        records: personRecords.data.list || [],
        totalRow: personRecords.data.total
      }
    };
  };

  // 获取子组织架构和人员
  const getSubOrganizationsAndPersonnel = async (params: any) => {
    let orgList = [];
    if (!organizationCatch.value.has(params.dwh)) {
      const { data } = await getOrganizationsSubNodes(params);
      orgList = data || [];
      organizationCatch.value.set(params.dwh, true);
    }

    const { data: personRecords } = await getPersonnelList(params);
    const personnelList = personRecords.list || [];

    return {
      data: {
        records: [...orgList, ...personnelList],
        totalRow: orgList.length + personRecords.total
      }
    };
  };

  return {
    organizationCatch,
    getOrganizationList
  };
};

export default useOrganizationApi;
