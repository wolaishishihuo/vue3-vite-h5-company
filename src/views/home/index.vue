<template>
  <div class="flex flex-col gap-[30px]">
    <Search />
    <van-cell title="URL 跳转" is-link :inset="true" />
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
  </div>
</template>

<script setup lang='ts'>
defineOptions({
  name: 'Home'
});
</script>
