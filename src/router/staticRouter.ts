import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/map',
    name: 'map',
    component: () => import('@/pages/MapPage.vue'),
    meta: {
      title: '腾讯地图示例',
      keepAlive: true
    }
  },
  {
    path: '/map-example',
    name: 'map-example',
    component: () => import('@/views/MapExample.vue'),
    meta: {
      title: '地图功能示例',
      keepAlive: true
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
