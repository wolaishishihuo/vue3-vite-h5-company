import { createApp, getCurrentInstance, h, ref } from 'vue';
import Popup from '@/components/Popup/index.vue';
import type { PopupProps } from 'vant';
import type { VNode } from 'vue';

export interface PopupOptions extends Partial<PopupProps> {
  title?: string;
  content?: string | (() => VNode);
  position?: 'top' | 'bottom' | 'right' | 'left';
  round?: boolean;
  closeable?: boolean;
  closeIcon?: string;
  closeOnClickOverlay?: boolean;
  [key: string]: any;
}

export interface PopupInstance {
  close: () => void;
  update: (newProps?: Record<string, any>) => void;
}

export function createPopup() {
  let currentInstance: PopupInstance | null = null;

  const popup = {
    create(options: PopupOptions): PopupInstance {
      // 创建前关闭已存在的弹窗
      if (currentInstance) {
        currentInstance.close();
        currentInstance = null;
      }

      const mergedOptions = { ...options };
      const context = getCurrentInstance()?.appContext;

      // 创建容器
      const container = document.createElement('div');
      document.body.appendChild(container);

      // 状态管理
      const visible = ref(true);
      const popupOptions = ref(mergedOptions || {});

      // 创建弹窗应用
      const popupApp = createApp({
        setup() {
          // 关闭处理
          const handleClose = () => {
            visible.value = false;
            setTimeout(() => {
              popupApp.unmount();
              container.remove();
              currentInstance = null;
            }, 300);
          };

          return () =>
            h(Popup, {
              ...popupOptions.value,
              'modelValue': visible.value,
              'onUpdate:modelValue': (val: boolean) => (visible.value = val),
              'onClose': () => handleClose()
            });
        }
      });

      // 继承上下文
      if (context) {
        popupApp._context = Object.assign({}, context);
      }

      // 挂载
      popupApp.mount(container);

      const instance = {
        /** 关闭弹窗 */
        close: () => {
          visible.value = false;
          setTimeout(() => {
            popupApp.unmount();
            container.remove();
            currentInstance = null;
          }, 300);
        },
        /** 更新弹窗 */
        update: (newProps?: Record<string, any>) => {
          popupOptions.value = { ...popupOptions.value, ...newProps };
        }
      };

      currentInstance = instance;
      return instance;
    },

    /** 弹窗-打开 */
    open(options: PopupOptions) {
      return this.create(options);
    }
  };

  return popup;
}

// 默认导出实例
export const PopupManager = createPopup();
