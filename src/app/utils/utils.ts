import { environment } from 'src/environments/environment';

export function domainName(url) {
  const search = /.+:\/\/([^\/]+)/;
  const match = search.exec(decodeURIComponent(url.replace(/\+/g, ' ')));
  return match == null ? null : match[1];
}

export function googleSheetId(googleSheetReference: string) {
  const matches = googleSheetReference.match('https:\\/\\/docs.google.com\\/spreadsheets\\/d\\/(.*?)($|\\/$|\\/.*|\\?.*)');
  return matches !== null ? matches[1] : googleSheetReference;
}

export function integer(min: number, max: number) {
  if (min > max) {
    throw new Error('Min cannot be greater than Max.');
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function floating(min: number, max: number, fixed: number) {
  const MAX_INT = 9007199254740992;
  const fixedPow = Math.pow(10, fixed);

  const num = integer(min * fixedPow, max * fixedPow);
  const num_fixed = (num / fixedPow).toFixed(fixed);

  return parseFloat(num_fixed);
}

export const _log = (message: string, level?: string) => {
  const levels = { ERROR: -1, INFO: 0, WARNING: 2, DEBUG: 3, TRACE: 4 };
  const sysLevel = environment.traceLevel || 'INFO';
  const msgLevel = level || 'INFO';
  const msgOutput = '-->[' + msgLevel + '] ' + message;
  if (levels[sysLevel] >= levels[msgLevel]) {
    if (msgLevel === 'ERROR') console.error(msgOutput);
    else console.log(msgOutput);
  }
};
export const logError = (message: string) => {
  _log(message, 'ERROR');
};
export const logInfo = (message: string) => {
  _log(message, 'INFO');
};
export const logWarning = (message: string) => {
  _log(message, 'WARNING');
};
export const logDebug = (message: string) => {
  _log(message, 'DEBUG');
};
export const logTrace = (message: string) => {
  _log(message, 'TRACE');
};
