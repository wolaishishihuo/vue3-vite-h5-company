export const getImageUrl = (name: string) => {
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

  // 尝试从 assets 目录加载图片
  for (const ext of imageExtensions) {
    try {
      // 使用动态导入方式加载资源，这样在打包时会被正确处理
      const imgUrl = new URL(`../../assets/images/${name}.${ext}`, import.meta.url).href;
      return imgUrl;
    } catch (error) {
      console.log(`尝试加载 ${name}.${ext} 失败: ${error}`);
      continue;
    }
  }

  console.warn(`未找到图片: ${name}`);
  return '';
};
