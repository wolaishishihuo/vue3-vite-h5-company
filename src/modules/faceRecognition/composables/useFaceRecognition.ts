import { useRafFn, useUserMedia } from '@vueuse/core';
import { CONFIG, RecognitionStatus, STATUS_CONFIG } from '../config.tsx';

/**
 * 人脸识别逻辑复合函数
 * 提供人脸识别的核心功能，包括摄像头控制、图像处理和状态管理
 * @returns 人脸识别相关的状态和方法
 */
export function useFaceRecognition() {
  // 基础状态
  const videoRef = ref<HTMLVideoElement | null>(null);
  const recognitionStatus = ref<RecognitionStatus>(RecognitionStatus.IDLE);
  const tipMessage = ref(STATUS_CONFIG[RecognitionStatus.IDLE].tipMessage);

  // 复合状态计算属性
  const statusConfig = computed(() => STATUS_CONFIG[recognitionStatus.value]);
  const getStatusDotClass = computed(() => statusConfig.value.dotClass);
  const getStatusTextClass = computed(() => statusConfig.value.textClass);
  const getStatusText = computed(() => statusConfig.value.statusText);

  // 处理状态
  const capturedImages = ref<string[]>([]);
  const retryCount = ref(0);
  const lastCaptureTime = ref(0);
  const isInitialDelay = ref(true);
  const isVideoReady = ref(false);
  const error = ref<Error | null>(null);

  // 离屏Canvas - 只创建一次，提高性能
  const offscreenCanvas = shallowRef<HTMLCanvasElement | null>(null);

  // 摄像头处理
  const { stream, start: startCamera, stop: stopCamera, isSupported } = useUserMedia({
    constraints: {
      video: CONFIG.VIDEO_CONSTRAINTS
    },
    autoSwitch: false
  });

  // 监听视频流变化
  watch(stream, (newStream) => {
    if (!newStream || !videoRef.value) return;

    // 设置视频流
    videoRef.value.srcObject = newStream;

    // 播放视频
    videoRef.value.play()
      .then(() => {
        isVideoReady.value = true;

        // 初始化离屏Canvas
        initOffscreenCanvas();

        // 如果处于扫描状态，开始处理
        if (recognitionStatus.value === RecognitionStatus.SCANNING) {
          startProcessing();
        }
      })
      .catch((err) => {
        error.value = err;
        handleError('视频播放失败', err);
      });
  });

  /**
   * 初始化离屏Canvas
   * 创建一个可重用的canvas元素，避免频繁创建
   */
  const initOffscreenCanvas = () => {
    if (!videoRef.value || offscreenCanvas.value) return;

    offscreenCanvas.value = document.createElement('canvas');
    offscreenCanvas.value.width = videoRef.value.videoWidth || 640;
    offscreenCanvas.value.height = videoRef.value.videoHeight || 480;
  };

  /**
   * 从视频中抓拍图像
   * 将当前视频帧转换为base64格式的图像
   * @returns base64格式的图像或null
   */
  const captureImage = (): string | null => {
    if (!videoRef.value || !isVideoReady.value || !offscreenCanvas.value) return null;

    const video = videoRef.value;
    const canvas = offscreenCanvas.value;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // 更新Canvas尺寸以匹配视频
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // 绘制视频帧到canvas
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg');
    } catch (err) {
      handleError('图像转换失败', err);
      return null;
    }
  };

  /**
   * 统一错误处理
   * @param message 错误信息
   * @param err 错误对象
   */
  const handleError = (message: string, err: unknown) => {
    console.error(`${message}:`, err);
    error.value = err instanceof Error ? err : new Error(String(err));
    recognitionStatus.value = RecognitionStatus.FAILED;
    tipMessage.value = `${message}，请重试`;
  };

  // 视频处理RAF
  const { pause: pauseProcessing, resume: resumeProcessing } = useRafFn(async () => {
    if (!isVideoReady.value || !videoRef.value) return;

    try {
      const now = Date.now();

      // 初始延迟处理
      if (isInitialDelay.value) {
        if (now - lastCaptureTime.value < CONFIG.INITIAL_DELAY) {
          const remainingSeconds = Math.ceil((CONFIG.INITIAL_DELAY - (now - lastCaptureTime.value)) / 1000);
          tipMessage.value = `请将面部对准摄像头，${remainingSeconds}秒后开始识别...`;
          return;
        }

        isInitialDelay.value = false;
        tipMessage.value = STATUS_CONFIG[RecognitionStatus.SCANNING].tipMessage;
      }

      // 检查是否需要抓拍
      if (now - lastCaptureTime.value >= CONFIG.CAPTURE_INTERVAL) {
        lastCaptureTime.value = now;
        updateTipByRetryCount();

        const capturedImage = captureImage();
        if (!capturedImage) return;

        capturedImages.value.push(capturedImage);

        // 处理识别结果
        const isRecognized = await processFaceRecognition(capturedImage);
        handleRecognitionResult(isRecognized);
      }
    } catch (err) {
      handleError('视频处理错误', err);
    }
  }, { immediate: false });

  /**
   * 根据重试次数更新提示信息
   */
  const updateTipByRetryCount = () => {
    if (retryCount.value === 0) {
      tipMessage.value = '请保持面部在框内，正在识别...';
    } else if (retryCount.value === 1) {
      tipMessage.value = '请稍微调整位置，再次尝试识别...';
    } else if (retryCount.value === 2) {
      tipMessage.value = '最后一次尝试，请确保光线充足且面部正对摄像头...';
    }
  };

  /**
   * 处理识别结果
   * @param isRecognized 是否识别成功
   */
  const handleRecognitionResult = (isRecognized: boolean) => {
    if (isRecognized) {
      recognitionStatus.value = RecognitionStatus.SUCCESS;
      tipMessage.value = STATUS_CONFIG[RecognitionStatus.SUCCESS].tipMessage;
      pauseProcessing();
    } else {
      retryCount.value++;

      if (retryCount.value >= CONFIG.MAX_RETRY) {
        recognitionStatus.value = RecognitionStatus.FAILED;
        tipMessage.value = STATUS_CONFIG[RecognitionStatus.FAILED].tipMessage;
        pauseProcessing();
      }
    }
  };

  /**
   * 模拟人脸识别处理
   * 实际项目中应替换为真实的人脸识别API调用
   * @param _imageBase64 图像数据（实际未使用）
   * @returns Promise<boolean> 识别结果
   */
  const processFaceRecognition = async (_imageBase64: string): Promise<boolean> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        // 随机模拟识别成功或失败
        const randomSuccess = Math.random() > 0.6; // 40%的成功率用于测试
        resolve(randomSuccess);
      }, 300); // 模拟网络延迟
    });
  };

  /**
   * 开始视频处理
   * 初始化状态并开始识别流程
   */
  const startProcessing = () => {
    if (!isVideoReady.value) return;

    // 重置状态
    capturedImages.value = [];
    retryCount.value = 0;
    lastCaptureTime.value = Date.now();
    isInitialDelay.value = true;
    error.value = null;

    recognitionStatus.value = RecognitionStatus.SCANNING;
    tipMessage.value = '请将面部置于圆圈内，准备开始识别...';
    resumeProcessing();
  };

  /**
   * 开始人脸识别
   * 初始化摄像头并开始识别流程
   */
  const startFaceRecognition = async () => {
    // 重置状态
    recognitionStatus.value = RecognitionStatus.LOADING;
    tipMessage.value = STATUS_CONFIG[RecognitionStatus.LOADING].tipMessage;
    error.value = null;

    // 检查摄像头可用性
    if (!isSupported.value) {
      recognitionStatus.value = RecognitionStatus.FAILED;
      tipMessage.value = '摄像头不可用，请检查权限或设备连接';
      return;
    }

    // 启动摄像头
    try {
      await startCamera();
      recognitionStatus.value = RecognitionStatus.SCANNING;
      tipMessage.value = STATUS_CONFIG[RecognitionStatus.SCANNING].tipMessage;
    } catch (err) {
      handleError('启动摄像头失败', err);
    }
  };

  /**
   * 停止人脸识别
   * 清理资源并重置状态
   */
  const stopFaceRecognition = () => {
    pauseProcessing();
    stopCamera();
    isVideoReady.value = false;
    recognitionStatus.value = RecognitionStatus.IDLE;
  };

  /**
   * 重试识别
   * 当识别失败时可调用此方法重新开始
   */
  const retry = () => {
    if (recognitionStatus.value === RecognitionStatus.FAILED) {
      startFaceRecognition();
    }
  };

  // 组件挂载时初始化
  onMounted(() => {
    startFaceRecognition();
  });

  // 组件卸载时停止处理
  onUnmounted(() => {
    stopFaceRecognition();

    // 清理离屏Canvas
    offscreenCanvas.value = null;
  });

  return {
    // 基础状态与引用
    videoRef,
    isVideoReady,
    recognitionStatus,
    tipMessage,
    error,

    // 计算属性
    getStatusDotClass,
    getStatusTextClass,
    getStatusText,

    // 处理结果
    capturedImages,
    retryCount,

    // 操作方法
    startFaceRecognition,
    stopFaceRecognition,
    retry

  };
}
