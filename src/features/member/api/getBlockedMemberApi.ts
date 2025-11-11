import { apiContents } from '@/services/apiService';

/**
 * 🔹 차단된 유저 목록 조회
 * GET /member/getBlockedMember
 */
export const getBlockedMemberApi = async (currentMemberId: string) => {
  console.log('📡 [getBlockedMemberApi] 요청 시작');
  console.log('🔹 요청 경로: /member/getBlockedMember');
  console.log('🔹 요청 파라미터:', { current_member_id: currentMemberId });

  try {
    const response = await apiContents.get('/member/getBlockedMember', {
      params: { current_member_id: currentMemberId },
    });

    console.log('✅ [getBlockedMemberApi] 응답 수신');
    console.log('🔸 status:', response.status);
    console.log(
      '🔸 data length:',
      Array.isArray(response.data) ? response.data.length : 0,
    );
    console.log('🧾 data sample:', response.data?.[0] ?? '(empty)');

    return response.data;
  } catch (error: any) {
    console.error('❌ [getBlockedMemberApi] 요청 실패');
    console.error('🔹 error message:', error?.message);
    console.error(
      '🔹 error response:',
      error?.response?.data ?? '(no response data)',
    );
    throw error;
  } finally {
    console.log('🏁 [getBlockedMemberApi] 요청 완료');
  }
};
