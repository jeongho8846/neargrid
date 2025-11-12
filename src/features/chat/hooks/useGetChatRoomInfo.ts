// 📄 src/features/chat/hooks/useFetchChatRoomInfo.ts
import { useQuery } from '@tanstack/react-query';
import { chatKeys } from '../keys/chatKeys';
import { fetchChatRoomInfo } from '../api/getChatRoomInfoApi';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

/**
 * ✅ 채팅방 정보 조회 훅
 * - GET /chatRoom/getChatRoomInfo
 * - React Query 캐싱 (room 단위)
 */
export const useFetchChatRoomInfo = (chatRoomId: string) => {
  const { member } = useCurrentMember();
  const currentMemberId = member?.id ?? '';

  return useQuery({
    queryKey: chatKeys.info(chatRoomId),
    queryFn: () => fetchChatRoomInfo(chatRoomId, currentMemberId),
    enabled: !!chatRoomId && !!currentMemberId,
    staleTime: 10 * 1000, // 10초 내 재요청 방지
    gcTime: 5 * 60 * 1000, // 5분 뒤 비활성 캐시 삭제
  });
};
