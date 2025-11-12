import { apiChat } from '@/services/apiService';

/**
 * ✅ 1:1 채팅방 열기 (기존 방이 있으면 그대로 반환)
 * @param currentMemberId - 현재 로그인한 내 ID
 * @param invitedMemberId - 상대방(프로필) ID
 * @returns { roomId: string; isNew: boolean }
 */
export const openPrivateChatRoomApi = async (
  currentMemberId: string,
  invitedMemberId: string,
) => {
  try {
    console.log('📡 [openPrivateChatRoomApi] 요청 시작');
    console.log('🔹 current_member_id:', currentMemberId);
    console.log('🔹 invited_member_id:', invitedMemberId);

    const response = await apiChat.post('/chatRoom/openPrivateChatRoom', null, {
      params: {
        current_member_id: currentMemberId,
        invited_member_id: invitedMemberId,
      },
    });

    console.log('✅ [openPrivateChatRoomApi] 응답 수신');
    console.log('🔸 data:', response.data);

    return response.data;
  } catch (error) {
    console.error('❌ [openPrivateChatRoomApi] 요청 실패', error);
    throw error;
  }
};
