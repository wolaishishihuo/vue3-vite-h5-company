<template>
  <!-- 自定义search组件 -->
  <div class="text-[30px] px-[30px] rounded-[43px] bg-white flex h-[86px] shadow-[0_0_10px_rgba(0,0,0,0.05)] items-center relative">
    <van-icon name="search" />
    <input v-model="searchValue" type="text" :placeholder="placeholder" class="text-[#333] ml-[10px] border-none bg-transparent flex-1 h-full placeholder:text-[#999]">
  </div>
</template>

<script setup lang='ts'>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入进行搜索!'
  }
});

const emit = defineEmits(['update:modelValue']);

const searchValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: string) {
    emit('update:modelValue', value);
  }
});
</script>
