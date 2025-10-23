import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';

export const tokenStorage = {
  // ✅ 토큰 저장
  saveTokens: async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.multiSet([
      [ACCESS, accessToken],
      [REFRESH, refreshToken],
    ]);
  },

  // ✅ 토큰 조회
  getTokens: async () => {
    const [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet([
      ACCESS,
      REFRESH,
    ]);
    return { accessToken, refreshToken };
  },

  // ✅ 전체 삭제 (로그아웃)
  clear: async () => {
    await AsyncStorage.multiRemove([ACCESS, REFRESH]);
  },
};
