import { onMounted, onUnmounted, ref } from 'vue';

export interface CameraOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export function useCamera(defaultOptions: CameraOptions = {}) {
  const {
    width = 1280, // 更高的默认分辨率
    height = 720, // 更高的默认分辨率
    quality = 0.8 // 更高的默认图像质量
  } = defaultOptions;

  const videoRef = ref<HTMLVideoElement | null>(null);
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const imageSrc = ref<string>('');
  const isLoading = ref<boolean>(false);
  const hasError = ref<boolean>(false);
  const errorMessage = ref<string>('');
  const stream = ref<MediaStream | null>(null);

  // 检查浏览器兼容性
  const checkBrowserSupport = (): boolean => {
    if (!navigator.mediaDevices?.getUserMedia) {
      errorMessage.value = '您的浏览器不支持摄像头功能，请使用最新版Chrome或Safari浏览器';
      hasError.value = true;
      return false;
    }
    return true;
  };

  // 停止摄像头
  const stopCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop());
      stream.value = null;
    }
    if (videoRef.value) {
      videoRef.value.srcObject = null;
    }
  };

  // 初始化摄像头
  const initCamera = async (options?: CameraOptions) => {
    // 先停止可能存在的相机流
    stopCamera();

    if (!checkBrowserSupport()) return;

    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = '';

    try {
      // 合并选项
      const mergedOptions = {
        width: options?.width ?? width,
        height: options?.height ?? height,
        quality: options?.quality ?? quality
      };

      const constraints = {
        audio: false,
        video: {
          width: { ideal: mergedOptions.width },
          height: { ideal: mergedOptions.height }
        }
      };

      // 获取媒体流
      stream.value = await navigator.mediaDevices.getUserMedia(constraints);

      // 设置视频源
      if (videoRef.value) {
        videoRef.value.srcObject = stream.value;
        await videoRef.value.play().catch((err) => {
          // iOS Safari 可能需要用户交互才能播放视频，捕获可能的错误
          console.warn('视频播放失败', err);
          throw new Error('视频播放失败，可能需要用户交互');
        });
      }

      isLoading.value = false;
    } catch (err) {
      isLoading.value = false;
      hasError.value = true;

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage.value = '摄像头访问被拒绝，请在浏览器设置中允许访问摄像头';
        } else if (err.name === 'NotFoundError') {
          errorMessage.value = '找不到摄像头设备';
        } else if (err.name === 'NotReadableError' || err.name === 'AbortError') {
          errorMessage.value = '摄像头被其他应用占用，请关闭其他可能使用摄像头的应用';
        } else {
          errorMessage.value = `摄像头初始化失败: ${err.message}`;
        }
      } else {
        errorMessage.value = '摄像头初始化失败';
      }
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

  // 将Base64转为文件对象
  const dataURLtoFile = (dataURL: string, fileName = 'photo.jpg'): File => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
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
    capture,
    retake,
    dataURLtoFile,
    initCamera,
    stopCamera
  };
}
