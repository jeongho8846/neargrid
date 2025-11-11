import { apiMember } from '@/services/apiService';

export const getMemberPoint = async (memberId: string) => {
  console.log('📡 [getMemberPoint] 요청 시작');
  console.log('🔹 member_id:', memberId);

  try {
    console.log('🚀 [getMemberPoint] 요청 전송 중...');
    const response = await apiMember.get('/point/getPoint', {
      params: { member_id: memberId },
    });

    console.log('✅ [getMemberPoint] 응답 수신');
    console.log('🔸 status:', response.status);
    console.log('🔸 data:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('❌ [getMemberPoint] 요청 실패');
    console.error('🔹 message:', error?.message);
    console.error('🔹 response:', error?.response?.data);
    throw error;
  }
};
