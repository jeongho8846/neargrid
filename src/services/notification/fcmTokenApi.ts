// src/services/notification/fcmTokenApi.ts
import { apiChat } from '@/services/apiService';

export type Platform = 'ANDROID' | 'IOS';

/**
 * FCM 토큰 등록
 * @param currentMemberId 로그인된 회원 ID
 * @param token FCM 토큰
 * @param platform 플랫폼 구분 (기본 'ANDROID')
 */
export async function registerFcmToken(
  currentMemberId: string,
  token: string,
  platform: Platform = 'ANDROID'
) {
  console.log('==============================');
  console.log('🚀 [registerFcmToken] 시작');
  console.log('🔹 currentMemberId:', currentMemberId);
  console.log('🔹 token:', token);
  console.log('🔹 platform:', platform);

  const formData = new FormData();
  formData.append('current_member_id', currentMemberId);
  formData.append('platform', platform);
  formData.append('token', token);

  try {
    const res = await apiChat.post('/fcmToken/registerToken', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ [registerFcmToken] 서버 응답:', res.data);
    console.log('==============================');
    return res;
  } catch (err: any) {
    console.error('❌ [registerFcmToken] 실패:', err?.response || err);
    console.log('==============================');
    throw err;
  }
}

/**
 * FCM 토큰 삭제
 * @param currentMemberId 로그인된 회원 ID
 * @param platform 플랫폼 구분 (기본 'ANDROID')
 */
export async function unregisterFcmToken(
  currentMemberId: string,
  platform: Platform = 'ANDROID'
) {
  console.log('==============================');
  console.log('🛑 [unregisterFcmToken] 시작');
  console.log('🔹 currentMemberId:', currentMemberId);
  console.log('🔹 platform:', platform);

  const formData = new FormData();
  formData.append('current_member_id', currentMemberId);
  formData.append('platform', platform);
  formData.append('token', ''); // 서버에서 삭제 처리용 빈값

  try {
    const res = await apiChat.post('/fcmToken/registerToken', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ [unregisterFcmToken] 서버 응답:', res.data);
    console.log('==============================');
    return res;
  } catch (err: any) {
    console.error('❌ [unregisterFcmToken] 실패:', err?.response || err);
    console.log('==============================');
    throw err;
  }
}
