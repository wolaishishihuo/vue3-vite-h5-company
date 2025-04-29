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

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

// 引入需要初始化的SDK和服务
import weChatSDK from '@/plugins/weChat';
import { TencentMap } from '@/plugins/tencentMap';

/**
 * 异步初始化各种SDK和服务
 * 即使某个SDK初始化失败也不会影响整个应用的启动
 */
async function bootstrap() {
  try {
    // 初始化微信SDK
    await weChatSDK.init().catch((err) => {
      console.warn('微信SDK初始化失败，但应用将继续运行:', err);
    });

    // 初始化腾讯地图SDK
    await TencentMap.init().catch((error) => {
      console.error('腾讯地图SDK初始化出错', error);
    });

    // 可以在这里添加其他需要初始化的服务...
    console.log('所有SDK和服务初始化完成');
  } catch (error) {
    console.error('初始化过程中出现错误，但应用将继续运行:', error);
  }
}

// 创建Vue应用实例
const app = createApp(App);

app.use(router);
app.use(pinia);

// 等待初始化完成后再挂载
bootstrap().then(() => {
  // 挂载应用
  app.mount('#app');
}).catch((error) => {
  console.error('初始化出错，继续挂载应用:', error);
  app.mount('#app');
});
