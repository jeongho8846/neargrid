import { apiChat } from '@/services/apiService';
import {
  ChatRoom,
  ChatRoomResponseDto,
  mapChatRoomDto,
} from '../model/ChatRoomModel';

/**
 * 🔹 현재 멤버의 채팅방 목록 조회
 * GET /chatRoom/getCurrentMemberChatRooms?current_member_id={id}
 */
export const getCurrentMemberChatRoomsApi = async (
  currentMemberId: string,
): Promise<ChatRoom[]> => {
  console.log('📡 [getCurrentMemberChatRoomsApi] 요청 시작 (GET)');
  console.log('🔹 currentMemberId:', currentMemberId);

  try {
    const response = await apiChat.get<ChatRoomResponseDto[]>(
      '/chatRoom/getCurrentMemberChatRooms',
      {
        params: { current_member_id: currentMemberId },
      },
    );

    console.log('✅ [getCurrentMemberChatRoomsApi] 응답 수신');
    console.log('🔹 data length:', response.data?.length ?? 0);

    // 🔹 DTO → Domain Model 변환
    const rooms = response.data.map(dto =>
      mapChatRoomDto(dto, currentMemberId),
    );

    return rooms;
  } catch (error: any) {
    console.error('❌ [getCurrentMemberChatRoomsApi] 요청 실패');
    console.error('🔹 message:', error?.message);
    throw error;
  }
};
