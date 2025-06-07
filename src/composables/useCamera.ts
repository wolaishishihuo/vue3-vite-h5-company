import { useUserMedia } from '@vueuse/core';
import { onMounted, onUnmounted, ref, watch } from 'vue';

export interface CameraOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export function useCamera(defaultOptions: CameraOptions = {}) {
  const {
    width = 1280,
    height = 720,
    quality = 0.8
  } = defaultOptions;

  const videoRef = ref<HTMLVideoElement | null>(null);
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const imageSrc = ref<string>('');
  const isLoading = ref<boolean>(false);
  const hasError = ref<boolean>(false);
  const errorMessage = ref<string>('');

  // https://github.com/vueuse/vueuse/blob/main/packages/core/useUserMedia/index.ts
  const {
    stream,
    isSupported,
    start: startMedia,
    stop: stopMedia
  } = useUserMedia({
    constraints: {
      video: {
        width: { ideal: width },
        height: { ideal: height }
      },
      audio: false
    },
    autoSwitch: false // 不自动启动，由我们控制启动时机
  });

  // 监听流的变化，自动设置到视频元素上
  watch(stream, (newStream) => {
    if (newStream && videoRef.value) {
      videoRef.value.srcObject = newStream;
      videoRef.value.play().catch((err) => {
        console.warn('视频播放失败', err);
        handleCameraError(err);
      });
    }
  });

  // 停止摄像头
  const stopCamera = () => {
    stopMedia();
  };

  // 处理摄像头错误
  const handleCameraError = (err: unknown) => {
    isLoading.value = false;
    hasError.value = true;

    if (!(err instanceof Error)) {
      errorMessage.value = '摄像头初始化失败';
      return;
    }

    const errorMap: Record<string, string> = {
      NotAllowedError: '摄像头访问被拒绝，请在浏览器设置中允许访问摄像头',
      PermissionDeniedError: '摄像头访问被拒绝，请在浏览器设置中允许访问摄像头',
      NotFoundError: '找不到摄像头设备',
      NotReadableError: '摄像头被其他应用占用，请关闭其他可能使用摄像头的应用',
      AbortError: '摄像头被其他应用占用，请关闭其他可能使用摄像头的应用'
    };

    errorMessage.value = errorMap[err.name] || `摄像头初始化失败: ${err.message}`;
  };

  // 初始化摄像头
  const initCamera = async () => {
    // 重置状态
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = '';

    // 检查浏览器支持
    if (!isSupported.value) {
      errorMessage.value = '您的浏览器不支持摄像头功能，请使用最新版Chrome或Safari浏览器';
      hasError.value = true;
      isLoading.value = false;
      return;
    }

    try {
      // 停止现有摄像头并启动新的
      stopCamera();

      // 启动媒体流（这是异步操作）
      const mediaStream = await startMedia();

      // 如果没有获取到流，抛出错误
      if (!mediaStream) {
        throw new Error('无法获取摄像头流');
      }

      isLoading.value = false;
    } catch (err) {
      handleCameraError(err);
    }
  };

  // 拍照
  const capture = () => {
    if (!videoRef.value || !canvasRef.value) return null;

    const video = videoRef.value;
    const canvas = canvasRef.value;
    const context = canvas.getContext('2d');
    if (!context) return null;

    // 设置画布尺寸为视频尺寸
    const videoWidth = video.videoWidth || width;
    const videoHeight = video.videoHeight || height;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    context.save();
    context.scale(-1, 1); // 水平翻转
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    // 生成图片并保存
    imageSrc.value = canvas.toDataURL('image/jpeg', quality);
    return imageSrc.value;
  };

  // 重新拍照
  const retake = () => {
    imageSrc.value = '';
  };

  onMounted(() => {
    initCamera();
  });

  onUnmounted(() => {
    stopCamera();
  });

  return {
    videoRef,
    canvasRef,
    imageSrc,
    isLoading,
    hasError,
    errorMessage,
    stream,
    isSupported,
    capture,
    retake,
    initCamera,
    stopCamera
  };
}
