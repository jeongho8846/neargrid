import { useState, useCallback } from 'react';
import { refreshTokenApi } from '../api/refreshToken';
import { tokenStorage } from '../utils/tokenStorage';
import { toMember } from '../mappers';
import { memberStorage } from '../utils/memberStorage';
import { getCachedFcmToken } from '@/services/notification/fcmService';
import { registerFcmToken } from '@/services/notification/fcmTokenApi';

export const useRefresh = () => {
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (): Promise<{ success: boolean }> => {
    setLoading(true);
    try {
      const { refreshToken } = await tokenStorage.getTokens();
      if (!refreshToken) return { success: false };

      const dto = await refreshTokenApi(refreshToken);

      // 🔹 토큰/멤버 갱신
      await tokenStorage.saveTokens(dto.accessToken, dto.refreshToken);
      const member = toMember(dto);
      await memberStorage.saveMember(member);

      // ✅ 자동 로그인 성공 시 FCM 토큰 서버 등록
      const fcmToken = getCachedFcmToken();
      if (fcmToken) {
        console.log('🚀 자동 로그인 후 FCM 토큰 서버 등록 시도');
        await registerFcmToken(member.id, fcmToken);
      } else {
        console.log('⚠️ FCM 토큰이 아직 없음 (initFCM 미실행 또는 실패)');
      }

      return { success: true };
    } catch (e) {
      console.log('❌ 자동 로그인 실패:', e);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return { refresh, loading };
};
