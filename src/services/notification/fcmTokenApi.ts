// src/services/notification/fcmTokenApi.ts
import { apiChat } from '@/services/apiService';

export async function registerFcmToken(
  currentMemberId: string,
  token: string,
  platform: 'ANDROID' | 'IOS' = 'ANDROID',
) {
  try {
    console.log('==============================');
    console.log('🚀 [registerFcmToken] 시작');
    console.log('🔹 currentMemberId:', currentMemberId);
    console.log('🔹 token:', token);
    console.log('🔹 platform:', platform);

    const formData = new FormData();
    formData.append('current_member_id', currentMemberId);
    formData.append('platform', platform);
    formData.append('token', token);

    console.log('🧩 FormData 내용:', {
      current_member_id: currentMemberId,
      platform,
      token,
    });

    const res = await apiChat.post('/fcmToken/registerToken', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ [registerFcmToken] 서버 응답:', res.data);
    console.log('==============================');
    return res;
  } catch (err) {
    console.log('❌ [registerFcmToken] 실패:', err?.response || err);
    console.log('==============================');
    throw err;
  }
}

export async function unregisterFcmToken(currentMemberId: string) {
  const formData = new FormData();
  formData.append('current_member_id', currentMemberId);
  formData.append('platform', 'ANDROID');
  formData.append('token', ''); // 🔥 빈값 보내서 서버 DB 비우기

  return apiChat.post('/fcmToken/registerToken', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
