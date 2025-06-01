<template>
  <!-- 自定义search组件 -->
  <div class="search-wrapper" :class="{ 'is-focused': isFocused }">
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
        v-if="searchValue"
        name="clear"
        class="clear-icon"
        @click="handleClear"
      />
      <van-icon
        name="search"
        class="search-icon-inner"
        @click="handleInnerSearch"
      />
    </div>
    <van-icon
      name="search"
      class="search-icon-outer"
      @click="handleSearch"
    />
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

const handleClear = () => {
  searchValue.value = '';
  emit('search', '');
  inputRef.value?.focus();
};

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
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 30px;
  padding: 15px;

  .search-input-container {
    position: relative;
    width: 100%;
    height: 86px;
    background-color: #f6f7f8;
    border-radius: 43px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    padding: 0 30px;
    transition: width 0.3s ease;

    .search-input {
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      padding-right: 40px;
      color: #333;

      &::placeholder {
        color: #999;
      }

      &:focus {
        outline: none;
      }
    }

    .clear-icon {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      cursor: pointer;
      z-index: 2;
    }

    .search-icon-inner {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      transition:
        opacity 0.3s,
        visibility 0.3s;
      cursor: pointer;
    }
  }

  .search-icon-outer {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) translateX(20px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    cursor: pointer;
  }

  &.is-focused {
    .search-input-container {
      width: calc(100% - 70px);

      .search-icon-inner {
        opacity: 0;
        visibility: hidden;
      }
    }

    .search-icon-outer {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(-20px) scale(1.5);
    }
  }
}
</style>
