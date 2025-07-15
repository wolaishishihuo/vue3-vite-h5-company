<template>
  <div class="w-full flex items-center justify-around gap-20 overflow-x-auto whitespace-nowrap py-16px">
    <div
      v-for="item in tabs"
      :key="item.value"
      class="relative cursor-pointer pb-8px text-[28px] text-[#999] transition-all duration-300 ease-in-out"
      :class="[{ 'text-[#333]! text-[30px] font-500': modelValue === item.value }]"
      @click="handleClick(item.value)"
    >
      {{ item.text }}
      <span v-if="!!item.count" class="ml-4px">({{ item.count }})</span>
      <div
        class="absolute bottom-10px left-0 right-0 h-13px w-full rounded-7px bg-[#3875c6] opacity-0 transition-all duration-300 ease-in-out"
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
