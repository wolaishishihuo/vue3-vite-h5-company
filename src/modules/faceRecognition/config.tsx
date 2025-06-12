/**
 * 人脸识别状态枚举
 */
export enum RecognitionStatus {
  /** 初始状态 */
  IDLE = 'idle',
  /** 加载状态 */
  LOADING = 'loading',
  /** 扫描状态 */
  SCANNING = 'scanning',
  /** 成功状态 */
  SUCCESS = 'success',
  /** 失败状态 */
  FAILED = 'failed'
}

/**
 * 状态相关配置映射对象
 * 每个状态对应的提示信息、样式类和状态文本
 */
export const STATUS_CONFIG = {
  [RecognitionStatus.IDLE]: {
    tipMessage: '请将面部置于圆圈内',
    dotClass: 'bg-gray-400',
    textClass: 'text-gray-400',
    statusText: '准备就绪'
  },
  [RecognitionStatus.LOADING]: {
    tipMessage: '正在启动摄像头...',
    dotClass: 'bg-blue-400 pulse-animation',
    textClass: 'text-blue-400',
    statusText: '初始化中...'
  },
  [RecognitionStatus.SCANNING]: {
    tipMessage: '请保持面部在框内，正在识别...',
    dotClass: 'bg-primary pulse-animation',
    textClass: 'text-primary',
    statusText: '识别中...'
  },
  [RecognitionStatus.SUCCESS]: {
    tipMessage: '识别成功！',
    dotClass: 'bg-green-500',
    textClass: 'text-green-500',
    statusText: '识别成功'
  },
  [RecognitionStatus.FAILED]: {
    tipMessage: '验证不成功，请检查光线或摄像头位置后重试',
    dotClass: 'bg-red-500',
    textClass: 'text-red-500',
    statusText: '识别失败'
  }
};

/**
 * 全局配置常量
 */
export const CONFIG = {
  /** 抓拍间隔(毫秒) */
  CAPTURE_INTERVAL: 1500,

  /** 初始延迟时间(毫秒) */
  INITIAL_DELAY: 3000,

  /** 最大重试次数 */
  MAX_RETRY: 3,

  /** 视频约束 */
  VIDEO_CONSTRAINTS: {
    width: { ideal: 640 },
    height: { ideal: 480 }
  }
};
