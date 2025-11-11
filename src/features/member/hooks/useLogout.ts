import AsyncStorage from '@react-native-async-storage/async-storage';
import { memberStorage } from '../utils/memberStorage';
import { signOutApi } from '../api/signOutApi';
import { useCurrentMember } from './useCurrentMember';
import { useAuthStore } from '@/common/state/authStore'; // ✅ 추가

export const useLogout = () => {
  const { member } = useCurrentMember();
  const { setIsAuth } = useAuthStore();

  const logout = async () => {
    try {
      if (member?.id) {
        try {
          await signOutApi(member.id);
          console.log('✅ 서버 로그아웃 성공');
        } catch {
          console.warn('⚠️ 서버 로그아웃 실패, 로컬 세션만 정리');
        }
      }

      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await memberStorage.clearMember();

      console.log('🧹 로컬 세션 정리 완료');
      setIsAuth(false); // ✅ RootNavigator에서 AuthStack으로 전환
    } catch (err) {
      console.error('❌ 로그아웃 실패:', err);
    }
  };

  return { logout };
};
