<template>
  <div class="face-recognition h-full flex-col items-center bg-gray-50 p-20px">
    <!-- 标题 -->
    <h1 class="mb-40px text-28px text-primary font-bold">
      人脸识别
    </h1>

    <!-- 摄像头区域 - 圆形设计 -->
    <div class="camera-container relative mb-40px overflow-hidden rounded-full wh-360">
      <div class="camera-placeholder abs-full flex-center bg-gray-100">
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
        class="scan-frame abs-full border-2px border-primary rounded-full border-dashed"
        :class="recognitionStatus === RecognitionStatus.SCANNING ? 'scan-active' : ''"
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
        <p class="mb-15px text-28px text-gray-600">
          {{ tipMessage }}
        </p>
        <p class="text-28px text-gray-400">
          保持光线充足，勿遮挡面部特征
        </p>
      </div>
    </div>

    <!-- 错误重试按钮 -->
    <van-button
      v-if="recognitionStatus === RecognitionStatus.FAILED"
      type="primary"
      class="h-88px w-80% rounded-12px text-32px"
      @click="retry"
    >
      重新尝试
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { useFaceRecognition } from '@/modules/faceRecognition/composables/useFaceRecognition';
import { RecognitionStatus } from '@/modules/faceRecognition/config.tsx';

defineOptions({
  name: 'FaceRecognition'
});

const {
  videoRef,
  recognitionStatus,
  tipMessage,
  getStatusDotClass,
  getStatusTextClass,
  getStatusText,
  retry
} = useFaceRecognition();
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
