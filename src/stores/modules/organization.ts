import type { AreaItem } from '@/api/interface/organization.ts';
import type { PersonnelItem } from '@/components/business/Organization/types.ts';
import { defineStore } from 'pinia';

interface AreaCheckedInfo {
  areaId: string[];
  areaIds: string;
  areaNames: string;
}

const useOrganizationStore = defineStore('organization', () => {
  const checkPersonList = ref<PersonnelItem[]>([]);
  const areaList = ref<AreaItem[]>([]);
  const areaCheckedInfo = ref<AreaCheckedInfo>({
    areaId: [],
    areaIds: '',
    areaNames: ''
  });

  const setAreaList = (list: AreaItem[]) => {
    areaList.value = list;
    setAreaCheckedInfo({
      areaId: list.map(item => item.id.toString()),
      areaIds: list.map(item => item.id.toString()).join(','),
      areaNames: list.filter(item => item.parentId === '0').map(item => item.name).join(',')
    });
  };
  const setAreaCheckedInfo = (info: AreaCheckedInfo) => {
    areaCheckedInfo.value = info;
  };

  const setCheckPersonList = (personList: PersonnelItem[]) => {
    checkPersonList.value = personList;
  };

  const clearCheckPerson = () => {
    checkPersonList.value = [];
  };

  const clearAreaList = () => {
    areaList.value = [];
  };

  const clearAll = () => {
    clearCheckPerson();
    clearAreaList();
    setAreaCheckedInfo({
      areaId: [],
      areaIds: '',
      areaNames: ''
    });
  };

  return {
    checkPersonList,
    setCheckPersonList,
    clearCheckPerson,
    areaList,
    setAreaList,
    clearAreaList,
    clearAll,
    areaCheckedInfo,
    setAreaCheckedInfo
  };
});

export default useOrganizationStore;
