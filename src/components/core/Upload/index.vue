<template>
  <van-uploader
    v-model="fileList"
    :max-count="maxCount"
    :accept="accept"
    :multiple="multiple"
    :max-size="maxSize"
    :before-read="beforeRead"
    @delete="handleDelete"
    v-bind="$attrs"
  >
    <template #preview-cover="{ file }">
      <div class="preview-cover">
        {{ file.name }}
      </div>
    </template>
  </van-uploader>
</template>

<script setup lang="ts">
import { useImageCompress } from '@/composables/useImageCompress';
import type { UploaderBeforeRead } from 'vant'; // 导入 UploaderBeforeRead 类型

interface FileItem {
  name: string;
  url: string;
  size: number;
}

interface Props {
  modelValue?: FileItem[];
  maxCount?: number;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  compressOptions?: {
    quality?: number; // 压缩质量
    maxWidth?: number; // 压缩最大宽度
    maxHeight?: number; // 压缩最大高度
    showToast?: boolean; // 是否显示压缩结果提示
  };
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  maxCount: 1,
  accept: 'image/*',
  multiple: true,
  maxSize: 1024 * 1024 * 1, // 默认最大文件大小为1MB
  compressOptions: () => ({
    quality: 0.8,
    maxWidth: 800,
    maxHeight: 800,
    showToast: false
  })
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: FileItem[]): void;
  (e: 'delete', file: File, detail: { file: File }): void;
}>();

const fileList = ref<FileItem[]>(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    fileList.value = newValue;
  }
);
// 图片压缩
const { compressImage, compressImages } = useImageCompress();

const beforeRead: UploaderBeforeRead = async (fileOrFiles) => {
  try {
    if (Array.isArray(fileOrFiles)) {
      // 多文件处理
      return await compressImages(fileOrFiles, props.compressOptions);
    } else {
      // 单文件处理
      return await compressImage(fileOrFiles, props.compressOptions);
    }
  } catch (error) {
    console.error('图片压缩失败:', error);
    // 压缩失败时返回原始文件
    return fileOrFiles;
  }
};

const handleDelete = (file: File) => {
  fileList.value = fileList.value.filter((item: any) => item.file !== file);
  emit('update:modelValue', fileList.value); // 更新父组件的值
};
</script>

<style lang="less" scoped>
.preview-cover {
  position: absolute;
  bottom: 0;
  padding: 4px;
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: #fff;
  background: rgb(0 0 0 / 30%);
  box-sizing: border-box;
}
</style>
