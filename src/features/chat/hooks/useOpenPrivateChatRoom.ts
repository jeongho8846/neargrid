import { useNavigation } from '@react-navigation/native';
import { openPrivateChatRoomApi } from '../api/openPrivateChatRoomApi';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

/**
 * ✅ 1:1 채팅방 열기 훅
 * - 이미 방이 있으면 그 방으로 이동
 * - 없으면 새 방 생성 후 이동
 */
export const useOpenPrivateChatRoom = () => {
  const navigation = useNavigation<any>();
  const { member } = useCurrentMember();

  const openPrivateChat = async (invitedMemberId: string) => {
    if (!member?.id) {
      console.warn('[useOpenPrivateChatRoom] member.id 없음');
      return;
    }

    try {
      const data = await openPrivateChatRoomApi(member.id, invitedMemberId);
      const roomId = data?.chatRoomId;

      if (roomId) {
        console.log('룸으로 이동', roomId);
        navigation.navigate('ChatRoomScreen', { chatRoomId: roomId });
      } else {
        console.warn('[useOpenPrivateChatRoom] roomId 없음');
      }
    } catch (error) {
      console.error('[useOpenPrivateChatRoom] openPrivateChat 실패', error);
    }
  };

  return { openPrivateChat };
};
