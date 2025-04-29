<template>
  <van-popup
    v-bind="popupProps"
    v-model:show="visible"
    :position="position"
    :round="round"
    :closeable="closeable"
    :close-icon="closeIcon"
    :close-on-click-overlay="closeOnClickOverlay"
    @close="handleClose"
  >
    <slot>
      <template v-if="typeof props.content === 'string'">
        <p>{{ props.content }}</p>
      </template>
      <template v-if="typeof props.content === 'function'">
        <component :is="props?.content?.()" />
      </template>
    </slot>
  </van-popup>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { VNode } from 'vue';
import type { PopupProps } from 'vant';

interface Props extends Partial<PopupProps> {
  content?: string | (() => VNode);
  onCancel?: () => void;
}

defineOptions({ name: 'CecwPopup' });

const props = withDefaults(defineProps<Props>(), {
  position: 'center',
  round: true,
  closeable: false,
  closeIcon: 'cross',
  closeOnClickOverlay: true,
  overlay: true,
  transitionAppear: true,
  teleport: 'body'
});

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
});

const popupProps = computed(() => {
  const { content, onCancel, ...rest } = props;
  return rest;
});

const handleClose = () => {
  props.onCancel?.();
  visible.value = false;
};
</script>

<style lang="less" scoped>

</style>
