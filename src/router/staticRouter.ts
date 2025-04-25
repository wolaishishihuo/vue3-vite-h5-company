import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/pages/[...all].vue'),
    meta: {
      title: '404'
    }
  }
];

export default routes;
