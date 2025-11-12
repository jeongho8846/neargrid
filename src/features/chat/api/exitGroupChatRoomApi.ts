import { apiChat } from '@/services/apiService';

/**
 * 🔹 그룹 채팅방 나가기
 * POST /chatRoom/exitGroupChatRoom
 */
export const exitGroupChatRoomApi = async (
  currentMemberId: string,
  chatRoomId: string,
) => {
  console.log('📡 [exitGroupChatRoomApi] 요청 시작');
  console.log('🔹 currentMemberId:', currentMemberId);
  console.log('🔹 chatRoomId:', chatRoomId);

  try {
    console.log('🚀 [exitGroupChatRoomApi] 요청 전송 중...');

    const response = await apiChat.post(
      '/chatRoom/exitGroupChatRoom',
      {}, // ✅ body 비움
      {
        params: {
          current_member_id: currentMemberId,
          chat_room_id: chatRoomId,
        },
      },
    );

    console.log('✅ [exitGroupChatRoomApi] 응답 수신');
    console.log('🔸 status:', response.status);
    console.log('🔸 data:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('❌ [exitGroupChatRoomApi] 요청 실패');
    console.error('🔹 message:', error?.message);
    console.error('🔹 response:', error?.response?.data);
    throw error;
  }
};
