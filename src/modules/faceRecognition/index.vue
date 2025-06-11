<template>
  <div class="face-recognition p-20px bg-gray-50 flex-col h-full items-center">
    <!-- 标题 -->
    <h1 class="text-28px text-primary font-bold mb-40px">
      人脸识别
    </h1>

    <!-- 摄像头区域 - 圆形设计 -->
    <div class="camera-container mb-40px rounded-full relative overflow-hidden wh-360">
      <div class="camera-placeholder bg-gray-100 flex-center abs-full" />

      <!-- 人脸识别扫描圆环 -->
      <div class="scan-frame border-2px border-primary rounded-full border-dashed abs-full" />
    </div>

    <!-- 识别状态区域 -->
    <div class="status-container mb-50px flex-col-center">
      <!-- 状态指示器 -->
      <div class="status-indicator mb-20px flex-center gap-10px">
        <div class="status-dot rounded-full bg-primary wh-16" />
        <span class="text-28px text-primary font-medium">识别中...</span>
      </div>

      <!-- 提示信息 -->
      <div class="tips-container text-center">
        <p class="text-28px text-gray-600 mb-15px">
          请将面部置于圆圈内
        </p>
        <p class="text-28px text-gray-400">
          保持光线充足，勿遮挡面部特征
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'FaceRecognition'
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
  animation: pulseAnimation 1.5s infinite;
  box-shadow: 0 0 10px rgba(64, 128, 255, 0.6);
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
</style>
