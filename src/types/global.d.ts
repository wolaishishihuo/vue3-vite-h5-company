/* Vite */
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
  VITE_USER_NODE_ENV: 'development' | 'production' | 'test';
  VITE_GLOB_APP_TITLE: string;
  VITE_PORT: number;
  VITE_OPEN: boolean;
  VITE_REPORT: boolean;
  VITE_ROUTER_MODE: 'hash' | 'history';
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none';
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_DROP_CONSOLE: boolean;
  VITE_PWA: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_API_URL: string;
  VITE_PROXY: [string, string][];
  VITE_BUILD_SOURCEMAP: boolean;
  VITE_APP_VCONSOLE: string;
}
