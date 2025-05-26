<template>
  <!-- 自定义search组件 -->
  <div class="search-component" :class="{ 'is-focused': isFocused }">
    <div class="search-input-container">
      <input
        v-model="searchValue"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        :class="{ 'has-value': searchValue }"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="inputRef"
      >
      <van-icon
        name="search"
        class="search-icon-inner"
        @click="handleInnerSearch"
      />
    </div>

    <div class="search-icon-outer">
      <van-icon
        name="search"
        @click="handleSearch"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
defineOptions({
  name: 'SearchComponent'
});

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

const emit = defineEmits(['update:modelValue', 'search']);
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const searchValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: string) {
    emit('update:modelValue', value);
  }
});

const handleSearch = () => {
  emit('search', searchValue.value);
  inputRef.value?.focus();
};

const handleInnerSearch = () => {
  inputRef.value?.focus();
  setTimeout(() => {
    handleSearch();
  }, 10);
};

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  if (!searchValue.value) {
    isFocused.value = false;
  }
};
</script>

<style lang="less" scoped>
.search-component {
  display: flex;
  align-items: center;
  font-size: 30px;

  &.is-focused {
    .search-input-container {
      .search-input {
        padding-right: 0;
        margin-left: 0;
      }

      .search-icon-inner {
        opacity: 0;
        visibility: hidden;
        transform: translateX(20px);
      }
    }

    .search-icon-outer {
      opacity: 1;
      visibility: visible;
      transform: translateX(0) scale(1.5);
    }
  }

  .search-input-container {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
    height: 86px;
    padding: 0 30px;
    background-color: #f6f7f8;
    border-radius: 43px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

    .search-input {
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      transition: all 0.3s ease-in-out;
      padding-right: 40px;
      margin-left: 10px;

      &::placeholder {
        color: #999;
      }

      &.has-value {
        color: #333;
      }

      &:not(.has-value) {
        color: #666;
      }
    }

    .search-icon-inner {
      position: absolute;
      right: 30px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }
  }

  .search-icon-outer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    transition: all 0.3s ease-in-out;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-20px) scale(0.9);
  }
}
</style>
