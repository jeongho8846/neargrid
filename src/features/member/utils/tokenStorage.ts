import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponseDto, Member } from '../types';
import { toMember } from '../mappers';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';
const USER_INFO = 'user_info';

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

  // ✅ 유저 정보 저장 (AuthResponseDto → Member 변환 후 저장)
  saveUserInfo: async (dto: AuthResponseDto) => {
    const member: Member = toMember(dto); // 변환
    await AsyncStorage.setItem(USER_INFO, JSON.stringify(member));
  },

  // ✅ 유저 정보 조회 (Member 타입 반환)
  getUserInfo: async (): Promise<Member | null> => {
    const str = await AsyncStorage.getItem(USER_INFO);
    return str ? (JSON.parse(str) as Member) : null;
  },

  // ✅ 전체 삭제 (로그아웃)
  clear: async () => {
    await AsyncStorage.multiRemove([ACCESS, REFRESH, USER_INFO]);
  },
};
