<template>
  <VanNavBar
    :title="title"
    :fixed="true"
    placeholder clickable
    :left-arrow="!showLeftArrow"
    @click-left="onBack"
  />
</template>

<script setup lang="ts">
import { routeWhiteList } from '@/config/routes';

const route = useRoute();
const router = useRouter();

function onBack() {
  if (window.history.state.back)
    history.back();
  else
    router.replace('/');
}

const title = computed(() => {
  if (!route.meta)
    return '';

  return route.meta.title as string || '';
});

const showLeftArrow = computed(() => route.name && routeWhiteList.includes(route.name as string));
</script>
