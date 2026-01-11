import type { QueryClient, InfiniteData } from '@tanstack/react-query';
import { chatKeys } from '../keys/chatKeys';
import {
  ChatMessage,
  ChatMessageResponseDto,
  mapChatMessageDto,
} from '../model/ChatMessageModel';
import { ChatRoom } from '../model/ChatRoomModel';

type MessagesPage = {
  messages: ChatMessage[];
  nextPagingState: string | null;
};

export type ChatLastReadInfoDto = {
  alarmType: 'CHAT_MESSAGE_LAST_READ_INFO';
  chatRoomId: string;
  unreadChatMessageCount?: number;
  lastReadChatMessageId?: string;
  memberId?: string;
  lastReadDateTime?: string | null;
  activeNow?: boolean;
};

/**
 * 방 목록 캐시에서 마지막 메시지/미읽음 갱신
 */
export const applyIncomingChatToRooms = (
  queryClient: QueryClient,
  dto: ChatMessageResponseDto,
  currentMemberId: string,
) => {
  queryClient.setQueryData<ChatRoom[]>(chatKeys.rooms(), prev => {
    if (!prev) return prev;
    return prev.map(room => {
      if (room.id !== dto.chatRoomId) return room;

      const lastMessage = {
        id: dto.id,
        senderId: dto.memberId,
        message: dto.message,
        messageType: dto.messageType,
        createdAt: dto.createDateTime,
      };

      // 🔸 방 목록의 unreadCount는 "내가 읽지 않은 메시지 수"만 관리
      const prevUnreadCount = room.unreadCount ?? 0;
      const isFromMe = dto.memberId === currentMemberId;
      const unreadCount = isFromMe ? prevUnreadCount : prevUnreadCount + 1;

      return {
        ...room,
        lastMessage,
        unreadCount,
        updatedAt: lastMessage.createdAt || room.updatedAt || null,
      };
    });
  });
};

/**
 * 특정 방 메시지 무한쿼리 캐시에 새 메시지 prepend
 */
export const appendIncomingChatToMessages = (
  queryClient: QueryClient,
  currentMemberId: string,
  dto: ChatMessageResponseDto,
) => {
  queryClient.setQueryData<InfiniteData<MessagesPage> | undefined>(
    chatKeys.messages(dto.chatRoomId),
    prev => {
      if (!prev) return prev;

      const mapped = mapChatMessageDto(dto, currentMemberId);
      const [firstPage, ...rest] = prev.pages ?? [];
      if (!firstPage) return prev;

      // 같은 checkReceiveId(또는 동일 id)를 가진 낙관 메시지가 있으면 교체
      const filtered =
        firstPage.messages?.filter(m => {
          // 낙관 메시지 교체는 내가 보낸 메시지일 때만 수행
          if (mapped.isMine) {
            if (m.checkReceiveId && mapped.checkReceiveId) {
              if (m.checkReceiveId === mapped.checkReceiveId) return false;
            }
            if (!mapped.checkReceiveId && m.id === mapped.id) return false;
          }
          return true;
        }) ?? [];

      return {
        ...prev,
        pages: [
          {
            ...firstPage,
            messages: [mapped, ...filtered],
          },
          ...rest,
        ],
      };
    },
  );
};

/**
 * 읽음 정보 알림은 현재 별도 처리하지 않음 (메시지 unread는 API/메시지 DTO 기반 렌더)
 */
export const applyLastReadInfoToRooms = (
  queryClient: QueryClient,
  _dto: ChatLastReadInfoDto,
) => {
  queryClient.setQueryData<ChatRoom[]>(chatKeys.rooms(), prev => prev);
};
