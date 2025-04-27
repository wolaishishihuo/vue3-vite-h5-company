<!--
 * @Descripttion: 上传组件 最简调用 <Upload v-model="files" />
 * @version:
 * @Author: lhl
 * @Date: 2024-09-05 10:08:11
 * @LastEditors: lhl
 * @LastEditTime: 2024-09-05 23:09:31
-->
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
import type { UploaderBeforeRead } from 'vant'; // 导入 UploaderBeforeRead 类型
import { showToast } from 'vant';

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
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  maxCount: 1,
  accept: 'image/*',
  multiple: true,
  maxSize: 1024 * 1024 * 1 // 默认最大文件大小为1MB
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

const beforeRead: UploaderBeforeRead = (fileOrFiles) => {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  for (const file of files) {
    if (file.size > props.maxSize) {
      showToast(`文件 ${file.name} 大小超过限制 ${props.maxSize / 1024 / 1024}MB`);
      return false; // 阻止文件上传
    }
  }
  return true; // 允许文件上传
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
