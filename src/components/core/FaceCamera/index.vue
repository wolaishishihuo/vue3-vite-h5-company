<template>
  <div class="fixed bottom-0 left-0 right-0 top-0 z-100 flex-col bg-black text-white">
    <!-- 标题 -->
    <div class="h-100px flex-center">
      <div class="text-32px font-medium">
        人脸采集
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="relative flex-1 overflow-hidden">
      <!-- 相机画面 -->
      <div class="abs-full">
        <!-- 视频元素 -->
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

        <!-- 取景框遮罩层 - 使用纯CSS实现 -->
        <div v-if="!imageSrc" class="camera-overlay abs-full flex-col-center bg-black/30">
          <!-- 透明的取景区域 -->
          <div class="viewfinder-container relative mb-120px">
            <!-- 辅助线 -->
            <div class="viewfinder-border">
              <div class="corner-tl" />
              <div class="corner-tr" />
              <div class="corner-bl" />
              <div class="corner-br" />
            </div>
          </div>

          <!-- 提示文字 -->
          <div class="absolute bottom-160px left-0 right-0 px-40px text-center text-28px">
            {{ promptText }}
          </div>
        </div>

        <!-- 拍照后预览 -->
        <div v-if="imageSrc" class="abs-full">
          <img :src="imageSrc" class="wh-full object-cover" alt="拍照预览">
        </div>

        <!-- Canvas (隐藏) -->
        <canvas ref="canvasRef" class="hidden" />
      </div>

      <!-- 加载提示 -->
      <div v-if="isLoading" class="abs-full z-10 flex-col-center bg-black/70">
        <van-loading color="#ffffff" size="48px" />
        <span class="mt-16px text-28px">相机初始化中...</span>
      </div>

      <!-- 错误提示 -->
      <div v-if="hasError" class="abs-full z-10 flex-col-center bg-black/70">
        <i class="i-svg:error mb-16px text-64px" />
        <span class="mx-40px text-center text-28px">{{ errorMessage }}</span>
        <van-button class="mt-32px" round size="large" type="primary" @click="retryCamera">
          重新尝试
        </van-button>
      </div>
    </div>

    <!-- 底部控制区 -->
    <div class="relative h-240px flex-center">
      <template v-if="!imageSrc">
        <div class="w-full flex-between px-64px">
          <!-- 取消按钮 -->
          <div class="flex-center cursor-pointer text-30px font-medium" @click="cancel">
            取消
          </div>

          <!-- 拍照按钮 -->
          <div class="h-140px w-140px flex-center cursor-pointer rounded-full bg-white/30 p-6px" @click="takePhoto">
            <div class="wh-full rounded-full bg-white shadow-lg" />
          </div>

          <!-- 空白占位 -->
          <div class="w-60px" />
        </div>
      </template>

      <template v-else>
        <!-- 拍照后的操作按钮 -->
        <div class="w-full flex-between px-64px">
          <van-button round type="default" size="large" class="w-240px text-28px" @click="retakePhoto">
            重拍
          </van-button>
          <van-button round type="primary" size="large" class="w-240px text-28px" @click="confirmPhoto">
            确认
          </van-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant';
import { useCamera } from '@/composables/useCamera';
import { dataURLtoFile } from '@/utils';

defineOptions({
  name: 'FaceCamera'
});

const props = defineProps({
  promptText: {
    type: String,
    default: '请将面部对准取景框'
  },
  quality: {
    type: Number,
    default: 0.8
  }
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'capture', photoData: string, photoFile: File): void;
}>();

const {
  videoRef,
  canvasRef,
  imageSrc,
  isLoading,
  hasError,
  errorMessage,
  capture,
  retake,
  initCamera,
  stopCamera
} = useCamera({
  quality: props.quality
});

// 拍照
const takePhoto = () => {
  const photoData = capture();
  if (!photoData) {
    showToast('拍照失败，请重试');
  }
};

// 重拍
const retakePhoto = () => {
  retake();
};

// 确认照片
const confirmPhoto = () => {
  if (imageSrc.value) {
    const photoFile = dataURLtoFile(imageSrc.value, 'face-photo.jpg');
    emit('capture', imageSrc.value, photoFile);
  }
};

// 取消操作
const cancel = () => {
  stopCamera();
  emit('cancel');
};

// 重试初始化相机
const retryCamera = async () => {
  stopCamera();
  await initCamera();
};
</script>

<style scoped lang="less">
.viewfinder-container {
  width: min(450px, 80vw);
  height: min(450px, 80vw);
  position: relative;
  background-color: transparent;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.viewfinder-border {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px dashed rgba(255, 255, 255, 0.5);
}

.corner-tl {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 40px;
  height: 40px;
  border-top: 4px solid white;
  border-left: 4px solid white;
  border-top-left-radius: 16px;
}

.corner-tr {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 40px;
  height: 40px;
  border-top: 4px solid white;
  border-right: 4px solid white;
  border-top-right-radius: 16px;
}

.corner-bl {
  position: absolute;
  bottom: -4px;
  left: -4px;
  width: 40px;
  height: 40px;
  border-bottom: 4px solid white;
  border-left: 4px solid white;
  border-bottom-left-radius: 16px;
}

.corner-br {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 40px;
  height: 40px;
  border-bottom: 4px solid white;
  border-right: 4px solid white;
  border-bottom-right-radius: 16px;
}
</style>
