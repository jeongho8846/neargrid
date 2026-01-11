import type { QueryClient } from '@tanstack/react-query';
import { ChatMessageResponseDto } from '../model/ChatMessageModel';
import {
  applyIncomingChatToRooms,
  appendIncomingChatToMessages,
  applyLastReadInfoToRooms,
} from './chatCacheUpdater';

type ChatAlarmType = 'CHAT_MESSAGE' | 'CHAT_MESSAGE_LAST_READ_INFO' | string;

type ChatLastReadInfoDto = {
  alarmType: 'CHAT_MESSAGE_LAST_READ_INFO';
  chatRoomId: string;
  unreadChatMessageCount?: number;
  lastReadChatMessageId?: string;
  memberId?: string;
};

type PrivateMessageDto = ChatMessageResponseDto | ChatLastReadInfoDto;

/**
 * private 채널로 들어온 메시지를 파싱/분기해서 캐시를 갱신하는 라우터
 */
export const createChatMessageRouter = ({
  queryClient,
  currentMemberId,
}: {
  queryClient: QueryClient;
  currentMemberId: string;
}) => {
  const handleChatMessage = (dto: ChatMessageResponseDto) => {
    applyIncomingChatToRooms(queryClient, currentMemberId, dto);
    appendIncomingChatToMessages(queryClient, currentMemberId, dto);
  };

  const handleLastReadInfo = (dto: ChatLastReadInfoDto) => {
    applyLastReadInfoToRooms(
      queryClient,
      dto.chatRoomId,
      dto.unreadChatMessageCount,
    );
  };

  const handlePrivateMessage = (raw: string) => {
    try {
      const data = JSON.parse(raw) as PrivateMessageDto;
      const alarmType = (data as { alarmType?: ChatAlarmType }).alarmType;
      if (!alarmType) return;

      switch (alarmType) {
        case 'CHAT_MESSAGE':
          handleChatMessage(data as ChatMessageResponseDto);
          break;
        case 'CHAT_MESSAGE_LAST_READ_INFO':
          handleLastReadInfo(data as ChatLastReadInfoDto);
          break;
        default:
          console.log('ℹ️ [ChatRouter] ignore alarmType:', alarmType);
      }
    } catch (e) {
      console.error('❌ [ChatRouter] parse error', e);
    }
  };

  return { handlePrivateMessage };
};
