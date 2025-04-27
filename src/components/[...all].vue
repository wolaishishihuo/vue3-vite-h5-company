<template>
  <div text="center gray-300">
    <van-icon name="warn-o" size="3em" />
    <div> Not found </div>

    <div class="mt-10">
      <button van-haptics-feedback btn m="3 t8" @click="onBack">
        Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

function onBack() {
  if (window.history.state.back)
    history.back();
  else
    router.replace('/');
}
</script>
