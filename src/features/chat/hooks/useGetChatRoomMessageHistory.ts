import { useInfiniteQuery } from '@tanstack/react-query';
import { getChatRoomMessageHistoryApi } from '../api/getChatRoomMessageHistoryApi';
import { chatKeys } from '../keys/chatKeys';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import type { ChatMessage } from '../model/ChatMessageModel';

/**
 * 🔹 GET /chatRoom/getChatRoomMessageHistory
 * 특정 채팅방 메시지 히스토리 조회 훅 (Infinite Query)
 */
export const useGetChatRoomMessageHistory = (chatRoomId: string) => {
  const { member } = useCurrentMember();
  const memberId = member?.id;

  return useInfiniteQuery({
    queryKey: chatKeys.messages(chatRoomId),
    queryFn: ({ pageParam }) =>
      getChatRoomMessageHistoryApi(
        memberId!,
        chatRoomId,
        (pageParam as string) || '',
      ),
    getNextPageParam: lastPage =>
      lastPage.nextPagingState ? lastPage.nextPagingState : undefined,
    initialPageParam: '', // ✅ v5 필수 옵션
    enabled: !!memberId && !!chatRoomId,
    staleTime: 10 * 1000, //신선시간 10초
    gcTime: 5 * 60 * 1000, // 5분 후 삭제
  });
};
