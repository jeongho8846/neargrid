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

/**
 * 방 목록 캐시에서 마지막 메시지/미읽음 갱신
 */
export const applyIncomingChatToRooms = (
  queryClient: QueryClient,
  dto: ChatMessageResponseDto,
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

      return {
        ...room,
        lastMessage,
        // 서버가 내려준 미읽음 카운트를 그대로 반영
        unreadCount:
          typeof dto.unreadChatMessageCount === 'number'
            ? dto.unreadChatMessageCount
            : room.unreadCount ?? 0,
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
 * 읽음 정보 알림으로 방 목록 unread 갱신
 */
export const applyLastReadInfoToRooms = (
  queryClient: QueryClient,
  chatRoomId: string,
) => {
  // unread 갱신을 현재는 수행하지 않음
  queryClient.setQueryData<ChatRoom[]>(chatKeys.rooms(), prev => prev);
};
