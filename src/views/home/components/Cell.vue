<template>
  <div
    @click="onClick"
    class="text-28px color-hex-34495e fw-600 px-20px rounded-20 bg-white flex-between h-80px transition-opacity-300 active-opacity-60"
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
