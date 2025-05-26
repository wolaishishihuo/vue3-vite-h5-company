import path from 'node:path';
import { viteVConsole } from 'vite-plugin-vconsole';

export const createViteVConsole = (viteEnv: ViteEnv) => {
  return viteVConsole({
    entry: [path.resolve('src/main.ts')],
    enabled: viteEnv.VITE_APP_VCONSOLE === 'true',
    config: {
      maxLogNumber: 1000,
      theme: 'light'
    }
  });
};
