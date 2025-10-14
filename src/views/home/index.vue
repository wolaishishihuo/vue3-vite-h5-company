<template>
  <div class="flex-col gap-20px p-20px">
    <JTabs v-model="activeTab" :tab-options="tabs" />

    <JButton @click="showPopup = true">
      选择组织架构
    </JButton>
    <JOrganization
      v-model="showPopup"
      :api-config="apiConfig"
      :multiple="isMultiSelect"
      :popup-title="popupTitle"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import type { OrganizationApiConfig, OrganizationPersonnelItem } from '@jname/business';
import { JOrganization } from '@jname/business';
import { JTabs } from '@jname/components';

const activeTab = ref('1');
const tabs = ref([
  {
    label: '标签1',
    value: '1'
  }
]);
const showPopup = ref(false);
const popupTitle = ref('选择组织架构');
const isMultiSelect = ref(false);
const apiConfig = ref<OrganizationApiConfig>({

});
const handleConfirm = (data: OrganizationPersonnelItem[]) => {
  console.log(data);
};
const handleCancel = () => {
  showPopup.value = false;
};
</script>
