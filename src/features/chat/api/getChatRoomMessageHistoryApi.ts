import { apiChat } from '@/services/apiService';
import {
  ChatMessageListResponseDto,
  mapChatMessageListDto,
  ChatMessage,
} from '../model/ChatMessageModel';

/**
 * 🔹 특정 채팅방의 메시지 히스토리 조회 (페이징 포함)
 * GET /chatRoom/getChatRoomMessageHistory
 * @param currentMemberId 현재 로그인한 멤버 ID
 * @param chatRoomId 채팅방 ID
 * @param pagingState 서버에서 내려주는 다음 페이지 토큰 (초기에는 '')
 */
export const getChatRoomMessageHistoryApi = async (
  currentMemberId: string,
  chatRoomId: string,
  pagingState: string = '',
): Promise<{ messages: ChatMessage[]; nextPagingState: string | null }> => {
  console.log('📡 [getChatRoomMessageHistoryApi] 요청 시작 (GET)');
  console.log('🔹 currentMemberId:', currentMemberId);
  console.log('🔹 chatRoomId:', chatRoomId);
  console.log('🔹 pagingState:', pagingState || '(초기 요청)');

  try {
    const response = await apiChat.get<ChatMessageListResponseDto>(
      '/chatRoom/getChatRoomMessageHistory',
      {
        params: {
          current_member_id: currentMemberId,
          chat_room_id: chatRoomId,
          paging_state: pagingState,
        },
      },
    );

    console.log('✅ [getChatRoomMessageHistoryApi] 응답 수신');
    console.log('🔹 nextPagingState:', response.data.nextPagingState ?? '없음');
    console.log(
      '🔹 message count:',
      response.data.chatMessageResponseDtos?.length ?? 0,
    );

    // 🔹 DTO → Domain Model 변환
    const { messages, nextPagingState } = mapChatMessageListDto(
      response.data,
      currentMemberId,
    );

    return { messages, nextPagingState };
  } catch (error: any) {
    console.error('❌ [getChatRoomMessageHistoryApi] 요청 실패');
    console.error('🔹 message:', error?.message);
    throw error;
  }
};
