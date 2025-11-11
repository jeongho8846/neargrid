import { useState } from 'react';
import { signIn } from '../api/signIn';
import { tokenStorage } from '../utils/tokenStorage';
import { toMember } from '../mappers';
import { memberStorage } from '../utils/memberStorage';
import { getCachedFcmToken } from '@/services/notification/fcmService';
import { registerFcmToken } from '@/services/notification/fcmTokenApi';
import { useAuthStore } from '@/common/state/authStore'; // ✅ 추가

export const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const { setIsAuth } = useAuthStore(); // ✅ 전역 Auth 상태 조작

  const signin = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 🔹 로그인 요청
      const { accessToken, refreshToken, ...dto } = await signIn(
        email,
        password,
      );

      // 🔹 토큰 저장
      await tokenStorage.saveTokens(accessToken, refreshToken);

      // 🔹 유저 정보 저장
      const member = toMember(dto);
      await memberStorage.saveMember(member);

      // ✅ 로그인 성공 시 전역 인증 상태 true
      setIsAuth(true);

      // ✅ FCM 토큰 등록
      const fcmToken = getCachedFcmToken();
      if (fcmToken) {
        console.log('🚀 로그인 후 FCM 토큰 서버 등록 시도');
        await registerFcmToken(member.id, fcmToken);
      } else {
        console.log('⚠️ FCM 토큰이 아직 없음 (initFCM 실행 안 됐거나 실패)');
      }

      return { success: true, member };
    } catch (err: any) {
      console.log('❌ 로그인 실패:', err?.response || err);
      setIsAuth(false); // 로그인 실패 시 명시적으로 false 설정
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { signin, loading };
};
