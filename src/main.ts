import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import pinia from '@/stores';
import 'virtual:uno.css';
import '@/styles/app.less';
import '@/styles/var.less';
import '@/styles/vant.less';
import '@/assets/iconfont/iconfont.css';
// Vant 桌面端适配
import '@vant/touch-emulator';
import registerPlugins from './plugins';

// 创建Vue应用实例
const app = createApp(App);

app.use(router);
app.use(pinia);

// router 准备就绪后挂载应用
router.isReady().then(() => {
  registerPlugins().finally(() => {
    app.mount('#app');
  });
});
