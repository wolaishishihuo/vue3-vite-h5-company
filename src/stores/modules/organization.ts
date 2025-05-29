import type { PersonnelItem } from '@/api/interface/organization';
import { defineStore } from 'pinia';

const useOrganizationStore = defineStore('organization', () => {
  const checkPersonList = ref<PersonnelItem[]>([]);

  const setCheckPersonList = (personList: PersonnelItem[]) => {
    checkPersonList.value = personList;
  };

  const clearCheckPerson = () => {
    checkPersonList.value = [];
  };

  return {
    checkPersonList,
    setCheckPersonList,
    clearCheckPerson

  };
});

export default useOrganizationStore;
