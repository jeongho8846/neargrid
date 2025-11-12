// 📄 src/features/chat/model/ChatRoomModel.ts
export type ChatRoomType = 'PRIVATE' | 'GROUP';

export type ChatMember = {
  memberId: string;
  nickName: string;
  profileImage?: string | null;
  isAvailableMember: boolean;
  activeNow: boolean;
  unreadChatMessageCount: number;
  lastReadChatMessageId?: string | null;
  lastReadDateTime?: string | null;
  isMine?: boolean; // ✅ 내가 보낸 멤버인지 여부
};

export type ChatMessagePreview = {
  id: string;
  senderId: string;
  message: string;
  messageType: string; // e.g. 'CHAT', 'IMAGE', ...
  createdAt: string;
};

export type ChatRoom = {
  id: string;
  type: ChatRoomType;
  name?: string | null;
  members: ChatMember[];
  lastMessage?: ChatMessagePreview | null;
  unreadCount: number; // ✅ 현재 로그인한 사용자의 unread 합산
  updatedAt?: string | null;
};

/* ======================================================
   🔹 서버 응답 DTO 타입
====================================================== */

export type ChatRoomResponseDto = {
  chatRoomId: string;
  chatRoomType: ChatRoomType;
  chatRoomName: string | null;
  memberChatRoomResponseDtos: {
    alarmType: string | null;
    memberId: string;
    memberType: string;
    nickName: string;
    chatRoomId: string;
    profileImage: string | null;
    isAvailableMember: boolean;
    lastReadChatMessageId: string | null;
    unreadChatMessageCount: number;
    lastReadDateTime: string | null;
    activeNow: boolean;
  }[];
  lastChatMessageResponseDto: {
    alarmType: string;
    id: string;
    memberId: string;
    memberNickName: string | null;
    memberProfileImageUrl: string | null;
    memberType: string | null;
    chatRoomId: string;
    message: string;
    messageType: string;
    createDateTime: string;
    currentMemberReactionType: string | null;
    receiveMemberId: string | null;
    checkReceiveId: string | null;
    requestToChatBotId: string | null;
    reactionCountDtos: any[];
    unreadChatMessageCount: number | null;
  } | null;
};

/* ======================================================
   🔹 DTO → Domain Model 변환 함수
====================================================== */

export const mapChatRoomDto = (
  dto: ChatRoomResponseDto,
  currentMemberId: string,
): ChatRoom => {
  const members: ChatMember[] =
    dto.memberChatRoomResponseDtos?.map(m => ({
      memberId: m.memberId,
      nickName: m.nickName,
      profileImage: m.profileImage,
      isAvailableMember: m.isAvailableMember,
      activeNow: m.activeNow,
      unreadChatMessageCount: m.unreadChatMessageCount ?? 0,
      lastReadChatMessageId: m.lastReadChatMessageId,
      lastReadDateTime: m.lastReadDateTime,
      isMine: m.memberId === currentMemberId, // ✅ 현재 사용자 구분 추가
    })) ?? [];

  const myInfo = members.find(m => m.isMine);
  const unreadCount = myInfo?.unreadChatMessageCount ?? 0;

  const lastMessageDto = dto.lastChatMessageResponseDto;

  const lastMessage: ChatMessagePreview | null = lastMessageDto
    ? {
        id: lastMessageDto.id,
        senderId: lastMessageDto.memberId,
        message: lastMessageDto.message,
        messageType: lastMessageDto.messageType,
        createdAt: lastMessageDto.createDateTime,
      }
    : null;

  return {
    id: dto.chatRoomId,
    type: dto.chatRoomType,
    name: dto.chatRoomName,
    members,
    lastMessage,
    unreadCount,
    updatedAt: lastMessage?.createdAt ?? null,
  };
};
