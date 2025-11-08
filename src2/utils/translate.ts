import i18n from '@/i18n';

/**
 * ✅ 안전한 번역 헬퍼
 */
export const t = (key: string, vars?: Record<string, any>): string => {
  if (!key) return '';
  try {
    return i18n.t(key, vars);
  } catch {
    return key;
  }
};

/**
 * ✅ 번역 + 변수 치환 조합
 * @example formatT('thread.like', { count: 3 }) → "좋아요 3개"
 */
export const formatT = (key: string, vars?: Record<string, any>) => {
  const text = t(key, vars);
  return text.replace(/\{\{(\w+)\}\}/g, (_, v) => vars?.[v] ?? '');
};

/**
 * ✅ 언어 변경
 */
export const changeLanguage = (lang: 'ko' | 'en') => {
  i18n.changeLanguage(lang);
};

/**
 * ✅ 현재 언어 조회
 */
export const currentLanguage = (): string => i18n.language;
