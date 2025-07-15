<template>
  <div
    class="h-80px flex-between rounded-20 bg-white px-20px text-28px color-hex-34495e fw-600 transition-opacity-300 active-opacity-60"
    @click="onClick"
  >
    <span>{{ title }}</span>
    <van-icon name="arrow" color="#B6C3D2" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  path: string;
}

const props = defineProps<Props>();

const router = useRouter();
const onClick = () => {
  router.push(props.path);
};
</script>
