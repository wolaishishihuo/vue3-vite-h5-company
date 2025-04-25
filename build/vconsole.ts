import path from 'node:path';
import process from 'node:process';
import { loadEnv } from 'vite';
import { viteVConsole } from 'vite-plugin-vconsole';

export function createViteVConsole(mode: string) {
  const env = loadEnv(mode, process.cwd());
  return viteVConsole({
    entry: [path.resolve('src/main.ts')],
    enabled: env.VITE_APP_VCONSOLE === 'true',
    config: {
      maxLogNumber: 1000,
      theme: 'light'
    }
  });
}
