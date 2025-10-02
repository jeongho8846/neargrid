import { decode as atob } from 'base-64';

/**
 * JWT 디코딩 (payload만 반환)
 * @param token string
 */
export const decodeJwt = (token: string): any | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return decoded; // { exp, iat, ... }
  } catch (e) {
    console.error('❌ JWT decode 실패:', e);
    return null;
  }
};

/**
 * JWT 만료 여부 체크
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
};

/**
 * JWT 남은 시간(초)
 */
export const getTokenRemainingTime = (token: string): number => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return 0;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now;
};
