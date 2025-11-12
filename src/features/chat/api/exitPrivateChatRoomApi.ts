import { apiChat } from '@/services/apiService';

/**
 * 🔹 1:1 채팅방 나가기
 * POST /chatRoom/exitPrivateChatRoom
 */
export const exitPrivateChatRoomApi = async (
  currentMemberId: string,
  chatRoomId: string,
) => {
  console.log('📡 [exitPrivateChatRoomApi] 요청 시작');
  console.log('🔹 currentMemberId:', currentMemberId);
  console.log('🔹 chatRoomId:', chatRoomId);

  try {
    console.log('🚀 [exitPrivateChatRoomApi] 요청 전송 중...');

    const response = await apiChat.post(
      '/chatRoom/exitPrivateChatRoom',
      {}, // ✅ body 비움
      {
        params: {
          current_member_id: currentMemberId,
          chat_room_id: chatRoomId,
        },
      },
    );

    console.log('✅ [exitPrivateChatRoomApi] 응답 수신');
    console.log('🔸 status:', response.status);
    console.log('🔸 data:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('❌ [exitPrivateChatRoomApi] 요청 실패');
    console.error('🔹 message:', error?.message);
    console.error('🔹 response:', error?.response?.data);
    throw error;
  }
};
