import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
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
