import { apiContents } from '@/services/apiService';

/**
 * 🔹 특정 유저 차단하기
 * POST /member/blockMember
 */
export const blockMemberApi = async (
  currentMemberId: string,
  targetMemberId: string,
) => {
  console.log('📡 [blockMemberApi] 요청 시작');
  console.log('🔹 currentMemberId:', currentMemberId);
  console.log('🔹 targetMemberId:', targetMemberId);

  try {
    console.log('🚀 [blockMemberApi] 요청 전송 중...');
    console.log('🔹 apiContents 존재 여부:', !!apiContents);

    const response = await apiContents.post(
      '/member/blockMember',
      null, // ✅ body 없음
      {
        params: {
          current_member_id: currentMemberId,
          block_member_id: targetMemberId,
        },
      },
    );

    console.log('✅ [blockMemberApi] 응답 수신');
    console.log('🔸 status:', response.status);
    console.log('🔸 data:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('❌ [blockMemberApi] 요청 실패');
    console.error('🔹 message:', error?.message);
    console.error('🔹 response:', error?.response?.data ?? '(서버 응답 없음)');
    console.error('🔹 config.url:', error?.config?.url ?? '(URL 없음)');
    console.error(
      '🔹 config.params:',
      error?.config?.params ?? '(params 없음)',
    );
    throw error;
  } finally {
    console.log('🏁 [blockMemberApi] 요청 종료');
  }
};
