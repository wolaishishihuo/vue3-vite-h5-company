import Compressor from 'compressorjs';
import { showToast } from 'vant';

// 自定义压缩选项接口
interface CompressOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  showToast?: boolean;
  // 可以添加更多 Compressorjs 支持的选项
  mimeType?: string;
  convertSize?: number;
  checkOrientation?: boolean;
  strict?: boolean;
}

export function useImageCompress() {
  // 压缩单个图片
  const compressImage = (file: File, options: CompressOptions = {}): Promise<File> => {
    const {
      quality = 0.8,
      maxWidth = 800,
      maxHeight = 800,
      showToast: shouldShowToast = false,
      ...otherOptions
    } = options;

    return new Promise((resolve) => {
      // 如果文件不是图片类型，直接返回原文件
      if (!file.type.startsWith('image/')) {
        return resolve(file);
      }

      // 记录原始文件大小(KB)
      const originalSize = file.size / 1024;

      new Compressor(file, {
        quality,
        maxWidth,
        maxHeight,
        ...otherOptions,
        success(result) {
          // 转换为File对象，保持原始文件名
          const compressedFile = new File([result], file.name, {
            type: result.type,
            lastModified: new Date().getTime()
          });

          // 记录压缩后的文件大小(KB)
          const compressedSize = compressedFile.size / 1024;

          // 计算压缩率
          const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

          // 只有当文件确实被压缩时才显示信息
          if (compressedSize < originalSize && shouldShowToast) {
            showToast({
              message: `压缩率: ${compressionRatio}%`,
              position: 'bottom'
            });
          }

          console.log(`图片压缩 - 原始: ${originalSize.toFixed(2)}KB, 压缩后: ${compressedSize.toFixed(2)}KB, 压缩率: ${compressionRatio}%`);

          resolve(compressedFile);
        },
        error(err) {
          console.error('图片压缩失败:', err);
          // 压缩失败时返回原始文件
          resolve(file);
        }
      });
    });
  };

  // 批量压缩多个图片
  const compressImages = (files: File[], options: CompressOptions = {}): Promise<File[]> => {
    return Promise.all(files.map(file => compressImage(file, options)));
  };

  return {
    compressImage,
    compressImages
  };
}
