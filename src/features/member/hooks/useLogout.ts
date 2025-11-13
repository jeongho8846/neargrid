import AsyncStorage from '@react-native-async-storage/async-storage';
import { memberStorage } from '../utils/memberStorage';
import { signOutApi } from '../api/signOutApi';
import { useCurrentMember } from './useCurrentMember';
import { useAuthStore } from '@/common/state/authStore'; // ✅ 추가
import { unregisterFcmToken } from '@/services/notification/fcmTokenApi';

export const useLogout = () => {
  const { member } = useCurrentMember();
  const { setIsAuth } = useAuthStore();

  const logout = async () => {
    try {
      // 🔥 서버의 FCM 토큰 삭제(= 빈값으로 대체)
      if (member?.id) {
        try {
          await unregisterFcmToken(member.id);
          await signOutApi(member?.id);
          console.log('🗑️ 서버 FCM 토큰 제거 성공');
        } catch {
          console.log('⚠️ 서버 FCM 토큰 제거 실패');
        }
      }

      // 기존 로그아웃 그대로

      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await memberStorage.clearMember();

      setIsAuth(false);
      console.log('🧹 로그아웃 완료');
    } catch (e) {
      console.error('❌ 로그아웃 실패:', e);
    }
  };

  return { logout };
};
