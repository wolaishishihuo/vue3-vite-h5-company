import NProgress from 'nprogress';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { popupManager } from '@/composables/usePopup';
import useRouteCacheStore from '@/stores/modules/routeCache';
import routes from './staticRouter';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: true, parent: '#app' });
const mode = import.meta.env.VITE_ROUTER_MODE;

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};

const router = createRouter({
  history: routerMode[mode](),
  routes,
  async scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      if (savedPosition.top <= height) {
        return savedPosition;
      }
    }

    if (to.hash) {
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

  // 获取用户信息和缓存路由
  // const userStore = useUserStore();
  // if (!userStore.token) {
  //   await userStore.userInit();
  // }
  // 添加路由缓存
  const routeCacheStore = useRouteCacheStore();
  routeCacheStore.addRoute(to);
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
