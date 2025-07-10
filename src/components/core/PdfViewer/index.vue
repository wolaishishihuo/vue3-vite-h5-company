<template>
  <div class="pdf-viewer-container bg-gray-50 flex-col wh-full">
    <VuePdfEmbed
      :source="pdfSrc"
    />
  </div>
</template>

<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed';

defineProps<{
  pdfSrc: string;
}>();
</script>
