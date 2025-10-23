import { apiChat } from '@/services/apiService';

export async function registerFcmToken(
  currentMemberId: string,
  token: string,
  platform: 'ANDROID' | 'IOS' = 'ANDROID',
) {
  const formData = new FormData();
  formData.append('current_member_id', currentMemberId);
  formData.append('platform', platform);
  formData.append('token', token);

  return apiChat.post('/fcmToken/registerToken', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
