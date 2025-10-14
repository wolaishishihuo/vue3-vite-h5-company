import { Lazyload } from 'vant';
import { createApp } from 'vue';
import App from '@/App.vue';
import directives from '@/directives/index';
import registerPlugins from '@/plugins/index';
import router from '@/router';

import pinia from '@/stores';

import 'vant/lib/index.css';
import '@jname/themes/variables';
import '@jname/components/style.css';
import '@jname/business/style.css';

import 'virtual:uno.css';
import '@/styles/app.less';
import '@/styles/var.less';
import '@/assets/iconfont/iconfont.css';
// Vant 桌面端适配
import '@vant/touch-emulator';
// 创建Vue应用实例
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(Lazyload);
app.use(directives);

// router 准备就绪后挂载应用
router.isReady().then(() => {
  registerPlugins().finally(() => {
    app.mount('#app');
  });
});
