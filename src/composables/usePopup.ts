import type { PopupProps } from 'vant';
import Popup from '@/components/core/Popup/index.vue';

// 错误处理函数
const handleError = (error: Error, context: string) => {
  // 这里可以添加用户友好的错误提示
  // 这里可以添加错误上报逻辑
  console.error(`Popup Error in ${context}:`, error);
};

export interface PopupOptions extends Partial<PopupProps> {
  title?: string;
  content?: string | (() => VNode);
  position?: 'top' | 'bottom' | 'right' | 'left';
  round?: boolean;
  closeable?: boolean;
  closeIcon?: string;
  closeOnClickOverlay?: boolean;
  style?: Record<string, string | number>;
  class?: string | string[];
  teleport?: string | HTMLElement;
  onOpen?: () => void;
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  customProps?: Record<string, unknown>;
}

export interface PopupInstance {
  close: () => void;
  update: (newProps?: Partial<PopupOptions>) => void;
  id: string;
}

const createPopup = () => {
  let currentInstance: PopupInstance | null = null;

  const popup = {
    create(options: PopupOptions): PopupInstance | null {
      try {
        // 创建前关闭已存在的弹窗
        if (currentInstance) {
          currentInstance.close();
          currentInstance = null;
        }

        const mergedOptions = { ...options };

        const context = getCurrentInstance()?.appContext;

        // 创建容器
        const container = document.createElement('div');
        try {
          document.body.appendChild(container);
        } catch (error) {
          handleError(error as Error, 'DOM操作');
          return null;
        }

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
                try {
                  popupApp.unmount();
                  container.remove();
                  currentInstance = null;
                } catch (error) {
                  handleError(error as Error, '弹窗关闭');
                }
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
        try {
          popupApp.mount(container);
        } catch (error) {
          handleError(error as Error, 'Vue实例挂载');
          container.remove();
          return null;
        }

        const instance: PopupInstance = {
          id: `popup-${Date.now()}`,
          close: () => {
            visible.value = false;
            setTimeout(() => {
              try {
                popupApp.unmount();
                container.remove();
                currentInstance = null;
              } catch (error) {
                handleError(error as Error, '实例关闭');
              }
            }, 300);
          },
          update: (newProps?: Partial<PopupOptions>) => {
            if (newProps) {
              popupOptions.value = { ...popupOptions.value, ...newProps };
            }
          }
        };

        currentInstance = instance;
        return instance;
      } catch (error) {
        handleError(error as Error, '弹窗创建');
        return null;
      }
    },

    open(options: PopupOptions) {
      return this.create(options);
    }
  };

  return popup;
};

// 默认导出实例
export const popupManager = createPopup();
