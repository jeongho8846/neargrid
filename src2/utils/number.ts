import i18n from '@/i18n';

/**
 * ✅ 숫자 단위 축약 (1000 → 1K)
 */
export const formatCompactNumber = (value: number): string => {
  const t = i18n.t.bind(i18n);

  if (value >= 1_000_000_000_000)
    return (
      (value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') +
      t('STR_NUMBER_T')
    );
  if (value >= 1_000_000_000)
    return (
      (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + t('STR_NUMBER_B')
    );
  if (value >= 1_000_000)
    return (
      (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + t('STR_NUMBER_M')
    );
  if (value >= 1_000)
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + t('STR_NUMBER_K');
  return value.toString();
};
/**
 * ✅ 통화 포맷 (₩, $, 등)
 */
export const formatCurrency = (value: number, currency: string = 'KRW') => {
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
    }).format(value);
  } catch {
    return `${value}`;
  }
};

/**
 * ✅ 퍼센트 포맷 (0.23 → 23%)
 */
export const formatPercent = (value: number, digits = 0) => {
  return `${(value * 100).toFixed(digits)}%`;
};
