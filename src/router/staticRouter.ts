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
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: '我的'
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
    path: '/demo/aspectRatio',
    name: 'aspectRatio',
    component: () => import('@/views/demo/aspectRatio/index.vue'),
    meta: {
      title: '宽高比示例'
    }
  },
  {
    path: '/demo/tableTree',
    name: 'tableTree',
    component: () => import('@/views/demo/tableTree/index.vue'),
    meta: {
      title: '表格树'
    }
  },
  {
    path: '/demo/locationButton',
    name: 'locationButton',
    component: () => import('@/views/demo/locationButton/index.vue'),
    meta: {
      title: '定位按钮'
    }
  },
  {
    path: '/demo/faceCamera',
    name: 'FaceCameraDemo',
    component: () => import('@/views/demo/faceCamera/index.vue'),
    meta: {
      title: '人脸拍照Demo'
    }
  },
  {
    path: '/organization',
    name: 'organization',
    component: () => import('@/modules/organization/index.vue'),
    meta: {
      title: '人员组织'
    }
  },
  {
    path: '/demo/faceRecognition',
    name: 'faceRecognition',
    component: () => import('@/modules/faceRecognition/index.vue'),
    meta: {
      title: '人脸识别'
    }
  },
  {
    path: '/demo/chart',
    name: 'chart',
    component: () => import('@/views/demo/chart/index.vue'),
    meta: {
      title: '图表'
    }
  },
  {
    path: '/demo/pdf',
    name: 'pdf',
    component: () => import('@/views/demo/pdf/index.vue'),
    meta: {
      title: 'PDF'
    }
  }
];

export default [...routes, ...demoRoutes];
