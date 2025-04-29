import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/mapExample',
    name: 'mapExample',
    component: () => import('@/views/mapDemo/mapExample.vue'),
    meta: {
      title: '地图功能示例'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/components/[...all].vue'),
    meta: {
      title: '404'
    }
  }

];
export default routes;
