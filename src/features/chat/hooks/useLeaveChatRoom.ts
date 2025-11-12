import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { exitPrivateChatRoomApi } from '../api/exitPrivateChatRoomApi';
import { exitGroupChatRoomApi } from '../api/exitGroupChatRoomApi';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { chatKeys } from '../keys/chatKeys';

/**
 * ✅ 채팅방 나가기 훅
 * - PRIVATE / GROUP 자동 분기
 * - 채팅룸 목록 캐시에서 해당 방 제거
 * - ChatListScreen으로 이동
 */
export const useLeaveChatRoom = () => {
  const [loading, setLoading] = useState(false);
  const { member } = useCurrentMember();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const leaveRoom = async (
    chatRoomId: string,
    chatRoomType: 'PRIVATE' | 'GROUP',
  ) => {
    if (!member?.id) return;

    try {
      setLoading(true);

      // ✅ API 분기
      if (chatRoomType === 'PRIVATE') {
        await exitPrivateChatRoomApi(member.id, chatRoomId);
      } else {
        await exitGroupChatRoomApi(member.id, chatRoomId);
      }

      console.log(`✅ [useLeaveChatRoom] ${chatRoomType} 방 나가기 완료`);

      // ✅ 캐시에서 해당 방 제거
      queryClient.setQueryData(chatKeys.rooms(), (prev: any) => {
        if (!prev) return prev;
        return prev.filter((room: any) => room.id !== chatRoomId);
      });

      // ✅ 채팅방 목록으로 이동
      navigation.navigate('ChatListScreen' as never);
    } catch (error) {
      console.error('❌ [useLeaveChatRoom] 방 나가기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return { leaveRoom, loading };
};
