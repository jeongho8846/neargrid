// 📄 src/features/chat/api/fetchChatRoomInfo.ts
import { apiChat, apiContents } from '@/services/apiService';
import { mapChatRoomDto, ChatRoom } from '../model/ChatRoomModel';
import { useQuery } from '@tanstack/react-query';
import { chatKeys } from '../keys/chatKeys';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

/**
 * ✅ 채팅방 기본 정보 조회
 * GET /chatRoom/getChatRoomInfo?current_member_id={id}&chat_room_id={id}
 */
export const fetchChatRoomInfo = async (
  chatRoomId: string,
  currentMemberId: string,
): Promise<ChatRoom> => {
  console.log('📡 [fetchChatRoomInfo] 요청 시작:', {
    chatRoomId,
    currentMemberId,
  });

  const res = await apiChat.get('/chatRoom/getChatRoomInfo', {
    params: {
      current_member_id: currentMemberId,
      chat_room_id: chatRoomId,
    },
  });

  console.log('✅ [fetchChatRoomInfo] 응답 수신:', res.data);

  // DTO → Domain 변환
  return mapChatRoomDto(res.data, currentMemberId);
};

/**
 * ✅ React Query 훅
 */
export const useFetchChatRoomInfo = (chatRoomId: string) => {
  const { member } = useCurrentMember();
  const currentMemberId = member?.id ?? '';

  return useQuery({
    queryKey: chatKeys.info(chatRoomId),
    queryFn: () => fetchChatRoomInfo(chatRoomId, currentMemberId),
    enabled: !!chatRoomId && !!currentMemberId,
    staleTime: 10 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
