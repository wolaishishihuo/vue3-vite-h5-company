<template>
  <div class="flex flex-col gap-[30px]">
    <Search />
    <!-- <van-cell title="URL 跳转" is-link :inset="true" @click="showPopup" /> -->
    <van-cell title="选择器" is-link :inset="true" @click="showPickerPopup" />
    <!-- <van-cell title="日期选择" is-link :inset="true" @click="showDatePickerPopup" /> -->
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
    <!-- <van-picker
      title="标题"
      :columns="columns"
    /> -->
  </div>
</template>

<script setup lang='tsx'>
import { PopupManager } from '@/composables/usePopup';
import { ref } from 'vue';
import { Picker } from 'vant';
import 'vant/es/picker/style';

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

// const showPopup = () => {
//   PopupManager.open({
//     content: '这是一个弹窗示例',
//     position: 'bottom',
//     closeable: true,
//     closeIcon: 'cross',
//     closeOnClickOverlay: true,
//     teleport: 'body'
//   });
// };

const showPickerPopup = () => {
  const popup = PopupManager.open({
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

// const showDatePickerPopup = () => {
//   const popup = PopupManager.open({
//     title: '选择日期',
//     position: 'bottom',
//     closeable: true,
//     closeIcon: 'cross',
//     closeOnClickOverlay: true,
//     teleport: 'body',
//     content: () => {
//       const DatePicker = defineAsyncComponent(() => import('vant/es/date-picker'));
//       return h(DatePicker, {
//         type: 'date',
//         onConfirm: (value: any) => {
//           console.log('选择的日期:', value);
//           popup.close();
//         },
//         onCancel: () => popup.close()
//       });
//     }
//   });
// };
</script>
