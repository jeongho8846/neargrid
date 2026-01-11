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
  currentMemberId: string,
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

      const isMine = dto.memberId === currentMemberId;
      const unreadFromServer = dto.unreadChatMessageCount;
      const unreadCount = isMine
        ? room.unreadCount // 내가 보낸 메시지는 미읽음 증가 없음
        : typeof unreadFromServer === 'number'
          ? unreadFromServer
          : room.unreadCount + 1;

      return {
        ...room,
        lastMessage,
        unreadCount,
        updatedAt: lastMessage.createdAt,
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

      return {
        ...prev,
        pages: [
          {
            ...firstPage,
            messages: [mapped, ...(firstPage.messages ?? [])],
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
  unreadChatMessageCount?: number,
) => {
  if (typeof unreadChatMessageCount !== 'number') return;

  queryClient.setQueryData<ChatRoom[]>(chatKeys.rooms(), prev => {
    if (!prev) return prev;
    return prev.map(room =>
      room.id === chatRoomId
        ? { ...room, unreadCount: unreadChatMessageCount }
        : room,
    );
  });
};
