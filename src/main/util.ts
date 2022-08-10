/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

export const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
export const isProduction = process.env.NODE_ENV === 'production';

export const isDarwin = process.platform === 'darwin';
export const isWin32 = process.platform === 'win32';
export const isLinux = process.platform === 'linux';

export const isMAS = process.mas ?? false;

export function resolveHtmlPath(htmlFileName: string) {
  if (isDebug) {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}
