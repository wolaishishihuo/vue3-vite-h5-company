/**
 * SDK初始化基类
 * 提供基础的SDK加载和状态管理功能
 */
export abstract class BaseSDK {
  /** SDK是否已加载完成 */
  protected isLoaded: boolean = false;

  /** SDK是否正在加载中 */
  protected isLoading: boolean = false;

  /** 超时时间(毫秒) */
  protected timeout: number = 10000;

  /** 最大重试次数 */
  protected maxRetries: number = 3;

  /** 初始化重试计数 */
  protected retryCount: number = 0;

  /**
   * 初始化SDK
   * @param options 初始化选项
   * @returns Promise<boolean> 初始化是否成功
   */
  public async init(options: Record<string, any> = {}): Promise<boolean> {
    // 已初始化，直接返回
    if (this.isLoaded) {
      return true;
    }

    // 正在初始化中，等待初始化完成
    if (this.isLoading) {
      return await new Promise<boolean>((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.isLoaded) {
            clearInterval(checkLoaded);
            resolve(true);
          }
        }, 100);
      });
    }

    // 设置配置项
    if (options.timeout !== undefined) this.timeout = options.timeout;
    if (options.maxRetries !== undefined) this.maxRetries = options.maxRetries;

    // 开始加载
    this.isLoading = true;

    try {
      // 调用子类实现的加载方法
      await this.loadSDK(options);

      this.isLoaded = true;
      this.retryCount = 0;
      return true;
    } catch (error) {
      console.error(`SDK加载失败:`, error);

      // 实现重试机制
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`重试初始化SDK (${this.retryCount}/${this.maxRetries})`);
        return this.init(options);
      }

      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 加载SDK的具体实现
   * 由子类实现
   * @param options 加载选项
   */
  protected abstract loadSDK(options: Record<string, any>): Promise<any>;

  /**
   * 重置SDK状态
   */
  public reset(): void {
    this.isLoaded = false;
    this.isLoading = false;
    this.retryCount = 0;
  }

  /**
   * 获取SDK是否已初始化
   */
  public isInitialized(): boolean {
    return this.isLoaded;
  }

  /**
   * 获取SDK加载状态
   */
  public getLoadStatus(): { isLoaded: boolean; isLoading: boolean } {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading
    };
  }
}
