import { useRafFn, useUserMedia } from '@vueuse/core';
import { onMounted, onUnmounted, ref, watch } from 'vue';

export function useFaceRecognition() {
  // 状态定义
  const videoRef = ref<HTMLVideoElement | null>(null);
  const recognitionStatus = ref<'idle' | 'loading' | 'scanning' | 'success' | 'failed'>('idle');
  const tipMessage = ref('请将面部置于圆圈内');

  // 新增：抓拍相关状态
  const capturedImages = ref<string[]>([]); // 存储抓拍的base64图片
  const retryCount = ref(0); // 重试次数
  const MAX_RETRY = 3; // 最大重试次数
  const lastCaptureTime = ref(0); // 上次抓拍时间
  const CAPTURE_INTERVAL = 1500; // 抓拍间隔(毫秒)
  const INITIAL_DELAY = 3000; // 初始延迟时间(毫秒)
  const isInitialDelay = ref(true); // 是否处于初始延迟中

  // 处理摄像头
  const { stream, start: startCamera, stop: stopCamera, isSupported } = useUserMedia({
    constraints: {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    },
    autoSwitch: false
  });

  // 视频就绪状态
  const isVideoReady = ref(false);

  // 监听视频流变化，设置到视频元素
  watch(stream, (newStream) => {
    if (newStream && videoRef.value) {
      console.log('设置视频流到视频元素');
      videoRef.value.srcObject = newStream;

      // 播放视频
      videoRef.value.play()
        .then(() => {
          console.log('视频开始播放');
          isVideoReady.value = true;

          // 如果处于扫描状态，开始处理
          if (recognitionStatus.value === 'scanning') {
            startProcessing();
          }
        })
        .catch((error) => {
          console.error('视频播放失败', error);
          recognitionStatus.value = 'failed';
          tipMessage.value = '无法访问摄像头，请检查权限设置';
        });
    }
  });

  // 新增：从视频中抓拍图像并转为base64
  const captureImage = (): string | null => {
    if (!videoRef.value || !isVideoReady.value) return null;

    const video = videoRef.value;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 绘制视频帧到canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 转换为base64
    try {
      const base64Image = canvas.toDataURL('image/jpeg');
      return base64Image;
    } catch (error) {
      console.error('图像转换失败:', error);
      return null;
    }
  };

  // 使用 RAF 进行视频处理
  const { pause: pauseProcessing, resume: resumeProcessing } = useRafFn(async () => {
    if (!isVideoReady.value || !videoRef.value) return;

    try {
      const now = Date.now();

      // 初始延迟处理
      if (isInitialDelay.value) {
        if (now - lastCaptureTime.value < INITIAL_DELAY) {
          // 在初始延迟期间更新提示信息
          const remainingSeconds = Math.ceil((INITIAL_DELAY - (now - lastCaptureTime.value)) / 1000);
          tipMessage.value = `请将面部对准摄像头，${remainingSeconds}秒后开始识别...`;
          return;
        } else {
          // 延迟结束
          isInitialDelay.value = false;
          tipMessage.value = '请保持面部在框内，正在识别...';
        }
      }

      // 检查是否需要抓拍(达到时间间隔)
      if (now - lastCaptureTime.value >= CAPTURE_INTERVAL) {
        lastCaptureTime.value = now;

        // 根据重试次数更新提示
        if (retryCount.value === 0) {
          tipMessage.value = '请保持面部在框内，正在识别...';
        } else if (retryCount.value === 1) {
          tipMessage.value = '请稍微调整位置，再次尝试识别...';
        } else if (retryCount.value === 2) {
          tipMessage.value = '最后一次尝试，请确保光线充足且面部正对摄像头...';
        }

        // 抓拍图像
        const capturedImage = captureImage();
        if (capturedImage) {
          capturedImages.value.push(capturedImage);
          console.log(`已抓拍第 ${retryCount.value + 1} 张图片`);

          // 模拟人脸识别处理 (实际项目中应替换为真实的识别逻辑)
          const isRecognized = simulateFaceRecognition(capturedImage);

          if (isRecognized) {
            recognitionStatus.value = 'success';
            tipMessage.value = '识别成功！';
            pauseProcessing();
          } else {
            retryCount.value++;

            // 超过最大重试次数
            if (retryCount.value >= MAX_RETRY) {
              recognitionStatus.value = 'failed';
              tipMessage.value = '验证不成功，请检查光线或摄像头位置后重试';
              pauseProcessing();
            }
          }
        }
      }
    } catch (error) {
      console.error('视频处理错误:', error);
    }
  }, { immediate: false });

  // 模拟人脸识别处理 (实际项目中应替换为真实的识别API)
  const simulateFaceRecognition = (_imageBase64: string): boolean => {
    // 这里仅作为示例，随机模拟识别成功或失败
    // 实际项目中应替换为调用真实的人脸识别API
    const randomSuccess = Math.random() > 0.6; // 40%的成功率用于测试
    return randomSuccess;
  };

  // 开始视频处理
  const startProcessing = () => {
    if (!isVideoReady.value) return;

    // 重置抓拍相关状态
    capturedImages.value = [];
    retryCount.value = 0;
    lastCaptureTime.value = Date.now(); // 记录开始时间用于初始延迟
    isInitialDelay.value = true; // 重置初始延迟状态

    recognitionStatus.value = 'scanning';
    tipMessage.value = '请将面部置于圆圈内，准备开始识别...';
    resumeProcessing();
  };

  // 开始摄像头处理流程
  const startFaceRecognition = async () => {
    // 重置状态
    recognitionStatus.value = 'loading';
    tipMessage.value = '正在启动摄像头...';

    // 检查摄像头可用性
    if (!isSupported.value) {
      recognitionStatus.value = 'failed';
      tipMessage.value = '摄像头不可用，请检查权限或设备连接';
      return;
    }

    // 启动摄像头
    console.log('启动摄像头');
    try {
      await startCamera();
      recognitionStatus.value = 'scanning';
      tipMessage.value = '请将面部置于圆圈内';
    } catch (error) {
      console.error('启动摄像头失败:', error);
      recognitionStatus.value = 'failed';
      tipMessage.value = '启动摄像头失败，请刷新页面重试或检查摄像头权限';
    }
  };

  // 停止处理
  const stopFaceRecognition = () => {
    pauseProcessing();
    stopCamera();

    // 重置状态
    isVideoReady.value = false;
    recognitionStatus.value = 'idle';
  };

  // 组件挂载时初始化
  onMounted(() => {
    // 初始化操作
    startFaceRecognition();
  });

  // 组件卸载时停止处理
  onUnmounted(() => {
    stopFaceRecognition();
  });

  return {
    videoRef,
    isVideoReady,
    recognitionStatus,
    startFaceRecognition,
    stopFaceRecognition,
    cameraSupported: isSupported,
    tipMessage,
    capturedImages, // 暴露抓拍的图片数组，方便外部使用
    retryCount
  };
}
