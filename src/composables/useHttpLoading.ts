import { useDebounceFn } from '@vueuse/core';
import { closeToast, showLoadingToast } from 'vant';

const useHttpLoading = (options = {}) => {
  const config = {
    message: '加载中...',
    minTime: 300,
    debounceTime: 100,
    ...options
  };

  let loadingCount = 0;
  let loadingTimer = null;
  let loadingStartTime = 0;

  /**
   * 显示Loading
   */
  const showLoading = () => {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }

    loadingCount++;

    if (loadingCount === 1) {
      loadingStartTime = Date.now();
      showLoadingToast({
        message: config.message,
        forbidClick: true,
        duration: 0
      });
    }
  };

  /**
   * 立即隐藏Loading
   */
  const hideLoadingImmediate = () => {
    loadingCount = Math.max(0, loadingCount - 1);

    if (loadingCount === 0) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainTime = Math.max(0, config.minTime - elapsedTime);

      if (remainTime > 0) {
        loadingTimer = setTimeout(() => {
          closeToast();
          loadingTimer = null;
        }, remainTime);
      } else {
        closeToast();
      }
    }
  };

  const hideLoading = useDebounceFn(hideLoadingImmediate, config.debounceTime);

  return {
    showLoading,
    hideLoading
  };
};

export default useHttpLoading;
