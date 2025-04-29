<template>
  <div class="flex flex-col gap-[30px]">
    <Search />
    <van-cell title="选择器" is-link :inset="true" @click="showPickerPopup" />
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
    <van-picker
      title="标题"
      :columns="columns"
    />
    <van-cell title="地图功能" is-link :inset="true" @click="toMapExample" />
  </div>
</template>

<script setup lang='tsx'>
import { Picker } from 'vant';
import { popupManager } from '@/composables/usePopup';

defineOptions({
  name: 'Home'
});
const columns = ref([
  { text: '杭州', value: 'Hangzhou' },
  { text: '宁波', value: 'Ningbo' },
  { text: '温州', value: 'Wenzhou' },
  { text: '绍兴', value: 'Shaoxing' },
  { text: '湖州', value: 'Huzhou' }
]);

const showPickerPopup = () => {
  const popup = popupManager.open({
    position: 'bottom',
    content: () => (
      <Picker
        columns={columns.value}
        title="111"
        onConfirm={(value: any) => {
          console.log('选择的值:', value);
          popup.close();
        }}
        onCancel={() => popup.close()}
      />
    )
  });
};

const router = useRouter();
const toMapExample = () => {
  router.push('/mapExample');
};
</script>
