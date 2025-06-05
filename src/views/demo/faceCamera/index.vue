<template>
  <div class="face-camera-demo bg-secondary min-h-screen">
    <div class="p-32px pb-80px pt-60px">
      <!-- 页面标题 -->
      <h2 class="text-48px text-primary font-bold mb-60px text-center">
        人脸拍照功能
      </h2>

      <!-- 拍照结果预览 -->
      <div v-if="photoSrc" class="photo-result flex-col-center">
        <div class="photo-preview max-w-690px w-full relative">
          <img :src="photoSrc" class="rounded-16px w-full shadow-lg overflow-hidden">

          <div class="mt-48px flex-center gap-32px">
            <van-button
              type="danger"
              round
              plain
              size="large"
              class="text-32px h-80px w-240px"
              @click="clearPhoto"
            >
              删除照片
            </van-button>

            <van-button
              type="primary"
              round
              size="large"
              class="text-32px h-80px w-240px"
              @click="uploadPhoto"
            >
              上传照片
            </van-button>
          </div>
        </div>
      </div>

      <!-- 无照片时显示拍照按钮 -->
      <template v-else>
        <div
          class="camera-placeholder wh-300px mx-auto border-4px border-gray-300 rounded-16px border-dashed bg-white flex-col-center cursor-pointer transition-all duration-300 hover:(border-primary bg-primary/5)"
          @click="openCamera"
        >
          <i class="i-svg:camera text-80px text-gray-400 mb-32px" />
          <p class="text-32px text-gray-600">
            点击拍摄照片
          </p>
        </div>

        <div class="instructions mx-auto mt-64px p-40px rounded-16px bg-white max-w-690px shadow-sm">
          <h3 class="text-36px text-primary font-bold mb-32px flex-start">
            <i class="i-svg:info-circle text-40px mr-16px" />
            使用说明
          </h3>
          <ul class="text-30px text-gray-700 pl-40px">
            <li class="mb-16px">
              将面部放在取景框内，保持正面姿态
            </li>
            <li class="mb-16px">
              确保光线充足，避免强光直射或背光
            </li>
            <li class="mb-16px">
              请勿佩戴墨镜等遮挡面部的物品
            </li>
            <li class="mb-16px">
              拍摄时保持稳定，表情自然
            </li>
            <li class="mb-16px">
              点击圆形按钮拍照，可重拍或确认使用
            </li>
          </ul>

          <div class="text-28px text-gray-500 mt-40px pt-32px text-center border-t-2px border-gray-100">
            如遇到问题请联系技术支持
          </div>
        </div>
      </template>
    </div>

    <!-- 人脸拍照组件 -->
    <FaceCamera
      v-if="showCamera"
      @cancel="closeCamera"
      @capture="onCapture"
    />

    <!-- 上传中 -->
    <van-overlay :show="isUploading" z-index="1000">
      <div class="flex-col-center h-full">
        <van-loading size="72px" type="spinner" color="#1989fa" />
        <p class="text-32px text-white mt-32px">
          上传中...
        </p>
      </div>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import { showDialog, showToast } from 'vant';
import { ref } from 'vue';
import FaceCamera from '@/components/core/FaceCamera/index.vue';

defineOptions({
  name: 'FaceCameraDemo'
});

// 状态
const showCamera = ref(false);
const photoSrc = ref('');
const photoFile = ref<File | null>(null);
const isUploading = ref(false);

// 打开相机
const openCamera = () => {
  showCamera.value = true;
};

// 关闭相机
const closeCamera = () => {
  showCamera.value = false;
};

// 拍照完成
const onCapture = (imgSrc: string, file: File) => {
  photoSrc.value = imgSrc;
  photoFile.value = file;
  closeCamera();
};

// 清除照片
const clearPhoto = () => {
  showDialog({
    title: '确认删除',
    message: '是否确认删除当前照片？',
    showCancelButton: true
  }).then((action) => {
    if (action === 'confirm') {
      photoSrc.value = '';
      photoFile.value = null;
    }
  });
};

// 模拟上传照片
const uploadPhoto = async () => {
  if (!photoFile.value) {
    showToast('没有可上传的照片');
    return;
  }

  try {
    isUploading.value = true;

    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 1500));

    showToast({
      type: 'success',
      message: '照片上传成功',
      position: 'bottom'
    });

    // 实际项目中这里应该调用API上传照片
    /*
    const formData = new FormData();
    formData.append('file', photoFile.value);

    const res = await yourUploadApi(formData);
    if (res.code === 200) {
      showToast({
        type: 'success',
        message: '照片上传成功',
        position: 'bottom'
      });
    } else {
      throw new Error(res.message || '上传失败');
    }
    */
  } catch (error) {
    showToast({
      type: 'fail',
      message: error instanceof Error ? error.message : '上传失败',
      position: 'bottom'
    });
  } finally {
    isUploading.value = false;
  }
};
</script>
