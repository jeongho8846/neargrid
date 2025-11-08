/* eslint-disable no-console */
const isDev = __DEV__; // RN 환경 자동 플래그

type LogLevel = 'log' | 'warn' | 'error' | 'info';

/**
 * ✅ 기본 출력 함수
 */
const print = (level: LogLevel, ...args: any[]) => {
  if (!isDev && level === 'log') return; // 릴리즈에선 일반 log 숨김

  const tag = `[${level.toUpperCase()}]`;
  const method = console[level] || console.log;
  method(tag, ...args);
};

/**
 * ✅ 그룹 출력 (시작~끝 묶어서 보기 좋게)
 */
export const logGroup = (title: string, fn: () => void) => {
  if (!isDev) return;
  console.groupCollapsed(`🧩 ${title}`);
  try {
    fn();
  } finally {
    console.groupEnd();
  }
};

/**
 * ✅ 주요 로그 함수
 */
export const logger = {
  log: (...args: any[]) => print('log', ...args),
  info: (...args: any[]) => print('info', ...args),
  warn: (...args: any[]) => print('warn', ...args),
  error: (...args: any[]) => print('error', ...args),
  group: logGroup,
};

/**
 * ✅ 사용 예시
 * logger.log('✅ Thread loaded', data);
 * logger.warn('⚠️ Token missing');
 * logger.error('❌ Network error', err);
 * logger.group('🔍 Feed Query', () => {
 *   logger.log('threads:', threads);
 *   logger.log('paging:', page);
 * });
 */
