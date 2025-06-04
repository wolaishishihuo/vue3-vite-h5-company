<template>
  <div class="py-16px flex gap-20 w-full whitespace-nowrap items-center justify-around overflow-x-auto">
    <div
      v-for="item in tabs"
      :key="item.value"
      class="text-[28px] text-[#999] pb-8px cursor-pointer transition-all duration-300 ease-in-out relative"
      :class="[{ 'text-[#333]! text-[30px] font-500': modelValue === item.value }]"
      @click="handleClick(item.value)"
    >
      {{ item.text }}
      <span v-if="!!item.count" class="ml-4px">({{ item.count }})</span>
      <div
        class="rounded-7px bg-[#3875c6] opacity-0 h-13px w-full transition-all duration-300 ease-in-out bottom-10px left-0 right-0 absolute"
        :class="{ 'opacity-23': modelValue === item.value }"
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
interface TabItem {
  text: string;
  value: string;
  count?: number;
}

defineProps({
  tabs: {
    type: Array as PropType<TabItem[]>,
    default: () => []
  }
});

const emit = defineEmits(['change']);
const modelValue = defineModel<string>('modelValue');
const handleClick = (value: string) => {
  modelValue.value = value;
  emit('change', value);
};
</script>
