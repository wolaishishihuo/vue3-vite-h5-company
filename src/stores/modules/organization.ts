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

  const clearAll = () => {
    clearCheckPerson();
  };

  return {
    checkPersonList,
    setCheckPersonList,
    clearCheckPerson,
    clearAll

  };
});

export default useOrganizationStore;
