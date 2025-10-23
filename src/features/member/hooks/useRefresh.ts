// src/features/member/hooks/useRefresh.ts
import { useState, useCallback } from 'react';
import { refreshTokenApi } from '../api/refreshToken';
import { tokenStorage } from '../utils/tokenStorage';
import { toMember } from '../mappers';
import { memberStorage } from '../utils/memberStorage';

export const useRefresh = () => {
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (): Promise<{ success: boolean }> => {
    setLoading(true);
    try {
      const { refreshToken } = await tokenStorage.getTokens();
      if (!refreshToken) return { success: false };

      const dto = await refreshTokenApi(refreshToken);
      await tokenStorage.saveTokens(dto.accessToken, dto.refreshToken);
      const member = toMember(dto);
      await memberStorage.saveMember(member);
      return { success: true };
    } catch (e) {
      console.log('❌ 자동 로그인 실패:', e);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []); // ✅ useCallback으로 고정

  return { refresh, loading };
};
