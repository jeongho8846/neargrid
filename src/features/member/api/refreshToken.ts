import { apiMember } from '@/services/apiService';
import { AuthResponseDto } from '../types';

let isRefreshing = false;

export const refreshTokenApi = async (
  refreshToken: string,
): Promise<AuthResponseDto> => {
  if (isRefreshing) {
    console.log('⚠️ refreshTokenApi 중복 실행 방지됨');
    throw new Error('중복 호출 방지');
  }

  isRefreshing = true;
  const now = new Date().toISOString();
  console.log('🕐 리플레쉬 요청 시각:', now);
  console.log('📦 보낼 refreshToken 값:', refreshToken);

  try {
    const res = await apiMember.post<AuthResponseDto>(
      '/member/refreshToken',
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );

    console.log('✅ 재발급 받은 데이터:', res.data);
    console.log('✅ 리플레쉬 완료 시간:', new Date().toISOString());

    return res.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.error('❌ 리프레시 토큰 만료됨 (409)');
      throw new Error('Refresh token expired');
    }
    console.error('❌ 리프레시 토큰 재발급 실패', error);
    throw error;
  } finally {
    isRefreshing = false;
  }
};
