/**
 * 获取屏幕的宽度和高度
 * @returns 包含屏幕宽度和高度的对象
 */
export const getScreenSize = (): { width: number; height: number } => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
};
