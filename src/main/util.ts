/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

export const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
export const isProduction = process.env.NODE_ENV === 'production';

export const isDarwin = process.platform === 'darwin';
export const isWin32 = process.platform === 'win32';
export const isLinux = process.platform === 'linux';

export let resolveHtmlPath: (htmlFileName: string) => string;
if (isDebug) {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}
