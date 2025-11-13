// src/features/member/hooks/useSignin.ts
import { useState } from 'react';
import { signIn } from '../api/signIn';
import { tokenStorage } from '../utils/tokenStorage';
import { toMember } from '../mappers';
import { memberStorage } from '../utils/memberStorage';
import { getCachedFcmToken } from '@/services/notification/fcmService';
import { registerFcmToken } from '@/services/notification/fcmTokenApi';
import { useAuthStore } from '@/common/state/authStore';

export const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const { setIsAuth } = useAuthStore();

  const signin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken, refreshToken, ...dto } = await signIn(
        email,
        password,
      );

      await tokenStorage.saveTokens(accessToken, refreshToken);

      const member = toMember(dto);
      await memberStorage.saveMember(member);

      setIsAuth(true);

      // 🔥 로그인 후 서버에 토큰 등록
      const fcmToken = getCachedFcmToken();
      if (fcmToken) {
        console.log('🚀 로그인 후 FCM 토큰 서버 등록 시도');
        await registerFcmToken(member.id, fcmToken);
      } else {
        console.log('⚠️ FCM 토큰 없음 (initFCM 아직 실행 안됨)');
      }

      return { success: true, member };
    } catch (err) {
      console.log('❌ 로그인 실패:', err);
      setIsAuth(false);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { signin, loading };
};
