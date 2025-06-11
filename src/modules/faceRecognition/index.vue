<template>
  <div class="face-recognition p-20px bg-gray-50 flex-col h-full items-center">
    <!-- 标题 -->
    <h1 class="text-28px text-primary font-bold mb-40px">
      人脸识别
    </h1>

    <!-- 摄像头区域 - 圆形设计 -->
    <div class="camera-container mb-40px rounded-full relative overflow-hidden wh-360">
      <div class="camera-placeholder bg-gray-100 flex-center abs-full">
        <video
          ref="videoRef"
          class="wh-full object-cover"
          webkit-playsinline="true"
          x-webkit-airplay="true"
          playsinline="true"
          x5-video-player-type="h5"
          x5-video-orientation="portrait"
          x5-playsinline="true"
          autoplay
        />
      </div>

      <!-- 人脸识别扫描圆环 -->
      <div
        class="scan-frame border-2px border-primary rounded-full border-dashed abs-full"
        :class="recognitionStatus === 'scanning' ? 'scan-active' : ''"
      />
    </div>

    <!-- 识别状态区域 -->
    <div class="status-container mb-50px flex-col-center">
      <!-- 状态指示器 -->
      <div class="status-indicator mb-20px flex-center gap-10px">
        <div
          class="status-dot rounded-full wh-16"
          :class="getStatusDotClass"
        />
        <span
          class="text-28px font-medium"
          :class="getStatusTextClass"
        >
          {{ getStatusText }}
        </span>
      </div>

      <!-- 提示信息 -->
      <div class="tips-container text-center">
        <p class="text-28px text-gray-600 mb-15px">
          {{ tipMessage }}
        </p>
        <p class="text-28px text-gray-400">
          保持光线充足，勿遮挡面部特征
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFaceRecognition } from './composables/useFaceRecognition';

defineOptions({
  name: 'FaceRecognition'
});

const { videoRef, recognitionStatus, tipMessage } = useFaceRecognition();

// 根据识别状态获取对应文本
const getStatusText = computed(() => {
  switch (recognitionStatus.value) {
    case 'idle':
      return '准备就绪';
    case 'loading':
      return '初始化中...';
    case 'scanning':
      return '识别中...';
    case 'success':
      return '识别成功';
    case 'failed':
      return '识别失败';
    default:
      return '准备就绪';
  }
});

// 根据识别状态获取状态点样式
const getStatusDotClass = computed(() => {
  switch (recognitionStatus.value) {
    case 'idle':
      return 'bg-gray-400';
    case 'loading':
      return 'bg-blue-400 pulse-animation';
    case 'scanning':
      return 'bg-primary pulse-animation';
    case 'success':
      return 'bg-green-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
});

// 根据识别状态获取文本样式
const getStatusTextClass = computed(() => {
  switch (recognitionStatus.value) {
    case 'idle':
      return 'text-gray-400';
    case 'loading':
      return 'text-blue-400';
    case 'scanning':
      return 'text-primary';
    case 'success':
      return 'text-green-500';
    case 'failed':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
});
</script>

<style scoped lang="less">
.face-recognition {
  background: linear-gradient(135deg, rgba(240, 245, 255, 0.9), rgba(230, 240, 255, 1));
}

.camera-container {
  box-shadow: 0 15px 30px rgba(0, 100, 255, 0.1);
  border: 4px solid rgba(255, 255, 255, 0.8);
}

.status-dot {
  box-shadow: 0 0 10px rgba(64, 128, 255, 0.6);
  &.pulse-animation {
    animation: pulseAnimation 1.5s infinite;
  }
}

@keyframes pulseAnimation {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.scan-active {
  animation: scanAnimation 1s infinite;
}

@keyframes scanAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
