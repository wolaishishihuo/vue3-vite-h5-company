import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useRouteCacheStore from '@/stores/modules/routeCache';
import routes from './staticRouter';
import { useRouteTransition } from '@/composables/useRouteTransition';
import { popupManager } from '@/composables/usePopup';

NProgress.configure({ showSpinner: true, parent: '#app' });
const mode = import.meta.env.VITE_ROUTER_MODE;

// 创建过渡动画管理实例
const { waitForTransition, startTransition } = useRouteTransition();

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};

const router = createRouter({
  history: routerMode[mode](),
  routes,
  async scrollBehavior(to, _from, savedPosition) {
    await nextTick();

    // 开始过渡动画
    startTransition();

    if (savedPosition) {
      await waitForTransition();

      const height = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (savedPosition.top <= height) {
        return savedPosition;
      }
    }

    if (to.hash) {
      await waitForTransition();
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }

    return { top: 0, left: 0, behavior: 'smooth' };
  }
});

router.beforeEach(async (to) => {
  NProgress.start();
  // 关闭所有弹窗
  popupManager.closeAll();

  // 设置页面标题
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : 'Default Title';
  document.title = pageTitle;

  // 添加路由缓存
  const routeCacheStore = useRouteCacheStore();
  routeCacheStore.addRoute(to);
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
