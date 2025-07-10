import { NEED_PLUGINS } from '@/constants';
import TencentMapSDK from './tencentMap';
import weChatSDK from './weChat';

//  注册腾讯地图和微信api插件
const registerPlugins = async () => {
  if (!NEED_PLUGINS) {
    return Promise.resolve();
  }
  await Promise.all([
    TencentMapSDK.init(),
    weChatSDK.init()
  ]);
};

export default registerPlugins;
