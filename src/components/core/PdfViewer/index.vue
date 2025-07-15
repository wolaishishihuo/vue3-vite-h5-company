<template>
  <div class="pdf-viewer-container wh-full flex-col bg-gray-50">
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
