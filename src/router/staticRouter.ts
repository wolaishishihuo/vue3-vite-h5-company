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
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/components/[...all].vue'),
    meta: {
      title: '404'
    }
  }

];

const demoRoutes = [
  {
    path: '/demo/tableTree',
    name: 'tableTree',
    component: () => import('@/views/demo/tableTree/index.vue'),
    meta: {
      title: '表格树'
    }
  }
];

export default [...routes, ...demoRoutes];
