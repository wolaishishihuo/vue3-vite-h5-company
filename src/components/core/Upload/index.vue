<template>
  <van-uploader
    v-model="fileList"
    :max-count="maxCount"
    :accept="accept"
    :multiple="multiple"
    :before-read="beforeRead"
    :preview-image="showPreview"
    v-bind="$attrs"
    @delete="handleDelete"
  >
    <!-- default插槽：自定义上传按钮 -->
    <template v-if="$slots.default" #default="slotProps">
      <slot name="default" v-bind="slotProps || {}" />
    </template>

    <template #preview-cover="{ file }">
      <div class="preview-cover">
        {{ file?.name }}
      </div>
    </template>
  </van-uploader>
</template>

<script setup lang="ts">
import type { UploaderBeforeRead } from 'vant';
import { useImageCompress } from '@/composables/useImageCompress';

interface FileItem {
  name: string;
  url: string;
  size: number;
  file: File;
}

interface Props {
  modelValue?: FileItem[];
  maxCount?: number;
  accept?: string;
  multiple?: boolean;
  showPreview?: boolean;
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
  multiple: false,
  showPreview: true,
  compressOptions: () => ({
    quality: 0.8, // 提高默认压缩质量，保证图片清晰度
    maxWidth: 800, // 适合移动端的图片宽度
    maxHeight: 800, // 适合移动端的图片高度
    showToast: false // 默认不显示压缩提示
  })
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: FileItem[]): void;
  (e: 'delete', file: File, detail: { file: File }): void;
}>();

const fileList = ref<FileItem[]>(props.modelValue);

// 图片压缩
const { compressImage, compressImages } = useImageCompress();

watch(
  () => props.modelValue,
  (newValue) => {
    fileList.value = newValue;
  }
);

// 文件上传前的处理
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
:deep(.van-uploader__wrapper) {
  width: 100%;
  height: 100%;
  .van-uploader__preview {
    margin: 0;
    width: 100%;
    height: 100%;
    margin-bottom: 30px;
  }
  .van-uploader__preview-image,
  .van-uploader__upload {
    width: 100%;
    height: 100%;
    margin: 0;
  }
}
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
