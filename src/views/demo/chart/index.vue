<template>
  <div>
    <Chart :option="options" :style="{ height: '300px' }" />
  </div>
</template>

<script setup lang="ts">
const options = {
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    containLabel: true
  },
  legend: {
    data: ['个人', '平均', '贫困线'],
    bottom: 0,
    itemWidth: 12,
    itemHeight: 8,
    textStyle: {
      color: '#666',
      fontSize: 12
    }
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#EBEEF5'
      }
    },
    axisLabel: {
      color: '#909399',
      fontSize: 10
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#EBEEF5',
        type: 'dashed'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitNumber: 5,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#EBEEF5'
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#EBEEF5',
        type: 'dashed'
      }
    },
    axisLabel: {
      color: '#909399',
      fontSize: 10
    }
  },
  series: [
    {
      name: '个人',
      type: 'line',
      data: [150, 230, 224, 218, 135, 147, 260],
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#4080FF'
      },
      lineStyle: {
        color: '#4080FF',
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 128, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 128, 255, 0.1)' }
          ]
        }
      }
    },
    {
      name: '平均',
      type: 'line',
      data: [150, 230, 224, 218, 135, 147, 260],
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#73CAFF'
      },
      lineStyle: {
        color: '#73CAFF',
        width: 2
      }
    },
    {
      name: '贫困线',
      type: 'line',
      data: [150, 230, 224, 218, 135, 147, 260],
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#FF8282'
      },
      lineStyle: {
        color: '#FF8282',
        width: 2
      }
    }
  ]
};
</script>
