import { createRouter, createWebHashHistory } from 'vue-router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import useRouteCacheStore from '@/stores/modules/routeCache';

import routes from './staticRouter';

NProgress.configure({ showSpinner: true, parent: '#app' });

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, left: 0, behavior: 'smooth' };
  }
});

router.beforeEach(async (to) => {
  NProgress.start();

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
