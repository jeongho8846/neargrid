import { useState } from 'react';
import { refreshTokenApi } from '../api/refreshToken';
import { tokenStorage } from '../utils/tokenStorage';
import { toMember } from '../mappers';
import { Member } from '../types';

export const useRefresh = () => {
  const [loading, setLoading] = useState(false);

  const refresh = async (): Promise<{ success: boolean; member?: Member }> => {
    setLoading(true);
    try {
      const { refreshToken, accessToken } = await tokenStorage.getTokens();
      if (!refreshToken) {
        console.log('❌ refreshToken 없음 → 로그인 필요');
        return { success: false };
      }

      // ✅ API 호출
      const dto = await refreshTokenApi(refreshToken);

      // ✅ 토큰 / 유저정보 저장
      await tokenStorage.saveTokens(dto.accessToken, dto.refreshToken);
      await tokenStorage.saveUserInfo(dto);

      const member = toMember(dto);
      return { success: true, member };
    } catch (e) {
      console.log('❌ 자동 로그인 실패:', e);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { refresh, loading };
};
