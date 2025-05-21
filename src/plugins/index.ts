import { TencentMap } from './tencentMap';
import weChatSDK from './weChat';

//  注册腾讯地图和微信api插件
const registerPlugins = async () => {
  await Promise.all([
    TencentMap.init(),
    weChatSDK.init()
  ]);
};

export default registerPlugins;
