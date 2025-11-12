// 📄 src/features/chat/model/ChatRoomModel.ts

/* ======================================================
   🔹 채팅방 타입 정의
====================================================== */

export type ChatRoomType = 'PRIVATE' | 'GROUP';
export type ChatMemberType = 'GENERAL' | 'CHAT_BOT';

/* ======================================================
   🔹 멤버
====================================================== */
export type ChatMember = {
  memberId: string;
  nickName: string;
  profileImage?: string | null;
  isAvailableMember: boolean;
  activeNow: boolean;
  unreadChatMessageCount: number;
  lastReadChatMessageId?: string | null;
  lastReadDateTime?: string | null;
  isMine?: boolean; // ✅ 현재 로그인한 사용자 여부
  memberType?: ChatMemberType; // ✅ 추가
};

/* ======================================================
   🔹 마지막 메시지 (미리보기)
====================================================== */
export type ChatMessagePreview = {
  id: string;
  senderId: string;
  message: string;
  messageType: string; // e.g. 'CHAT', 'IMAGE', ...
  createdAt: string;
};

/* ======================================================
   🔹 채팅방 도메인 모델
====================================================== */
export type ChatRoom = {
  id: string;
  type: ChatRoomType;
  name?: string | null;
  members: ChatMember[];
  lastMessage?: ChatMessagePreview | null;
  unreadCount: number; // ✅ 현재 로그인한 사용자의 안읽은 메시지 수
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
    memberType: ChatMemberType | string; // ✅ 타입 보강
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
  // 🔹 멤버 변환
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
      memberType: (m.memberType as ChatMemberType) ?? undefined, // ✅ 매핑
      isMine: m.memberId === currentMemberId,
    })) ?? [];

  // 🔹 내 정보 기반 unread 계산
  const myInfo = members.find(m => m.isMine);
  const unreadCount = myInfo?.unreadChatMessageCount ?? 0;

  // 🔹 마지막 메시지 매핑
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

  // 🔹 Domain 반환
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
