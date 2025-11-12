import { useQuery } from '@tanstack/react-query';
import { getCurrentMemberChatRoomsApi } from '../api/getCurrentMemberChatRoomsApi';
import { chatKeys } from '../keys/chatKeys';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

/**
 * 🔹 GET /chatRoom/getCurrentMemberChatRooms
 * 현재 멤버의 채팅방 목록 조회 훅
 */
export const useGetCurrentMemberChatRooms = () => {
  const { member } = useCurrentMember();
  const memberId = member?.id;

  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: () => getCurrentMemberChatRoomsApi(memberId!),
    enabled: !!memberId,
    staleTime: 10 * 1000,
    gcTime: 5 * 60 * 1000, // ✅ v5에서는 cacheTime → gcTime
  });
};
