<template>
  <div ref="chartDom" />
</template>

<script setup lang="ts">
import type { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';
import { addListener, removeListener } from 'resize-detector';

const props = defineProps({
  option: Object
});

const chartDom = ref<HTMLDivElement>();
let chart: ECharts | null = null;

function resizeChart() {
  chart?.resize();
}

const resize = debounce(resizeChart, 300);

function disposeChart() {
  if (chartDom.value)
    removeListener(chartDom.value, resize);

  chart?.dispose();
  chart = null;
}

function initChart() {
  disposeChart();
  if (chartDom.value) {
    // init echarts
    chart = echarts.init(chartDom.value);
    chart.setOption(props.option);
    addListener(chartDom.value, resize);
  }
}

onMounted(() => {
  watch(() => props.option, () => {
    chart?.setOption(props.option);
  }, {
    deep: true,
    flush: 'post'
  });

  initChart();
});

onUnmounted(() => {
  disposeChart();
});
</script>
