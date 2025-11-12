// 📄 src/features/chat/model/ChatMessageModel.ts

/** 🔹 메시지 타입 정의 */
export type ChatMessageType = 'CHAT' | 'IMAGE' | 'SYSTEM' | string;

/** 🔹 반응(리액션) 타입 — 서버에서 추가될 가능성 대비 */
export type ChatReaction = {
  type: string;
  count: number;
};

/** 🔹 도메인 모델 (앱 내부에서 사용) */
export type ChatMessage = {
  id: string;
  roomId: string;
  senderId: string;
  senderNickName?: string | null;
  senderProfileImageUrl?: string | null;
  type: ChatMessageType;
  content: string;
  createdAt: string;
  isMine: boolean;
  reactions?: ChatReaction[];
};

/* ======================================================
   🔹 서버 DTO 타입
====================================================== */

export type ChatMessageResponseDto = {
  alarmType: string; // e.g. 'CHAT_MESSAGE'
  id: string;
  memberId: string;
  memberNickName: string | null;
  memberProfileImageUrl: string | null;
  memberType: string;
  chatRoomId: string;
  message: string;
  messageType: ChatMessageType;
  createDateTime: string;
  currentMemberReactionType: string | null;
  receiveMemberId: string | null;
  checkReceiveId: string | null;
  requestToChatBotId: string | null;
  reactionCountDtos: {
    reactionType: string;
    count: number;
  }[];
  unreadChatMessageCount: number | null;
};

/** 🔹 메시지 목록 응답 DTO */
export type ChatMessageListResponseDto = {
  chatRoomId: string;
  nextPagingState: string | null;
  chatMessageResponseDtos: ChatMessageResponseDto[];
};

/* ======================================================
   🔹 DTO → Domain Model 변환 함수
====================================================== */

export const mapChatMessageDto = (
  dto: ChatMessageResponseDto,
  currentMemberId: string,
): ChatMessage => {
  return {
    id: dto.id,
    roomId: dto.chatRoomId,
    senderId: dto.memberId,
    senderNickName: dto.memberNickName,
    senderProfileImageUrl: dto.memberProfileImageUrl,
    type: dto.messageType,
    content: dto.message,
    createdAt: dto.createDateTime,
    isMine: dto.memberId === currentMemberId,
    reactions:
      dto.reactionCountDtos?.map(r => ({
        type: r.reactionType,
        count: r.count,
      })) ?? [],
  };
};

/** 🔹 전체 메시지 리스트 변환기 (페이징 포함) */
export const mapChatMessageListDto = (
  response: ChatMessageListResponseDto,
  currentMemberId: string,
): { messages: ChatMessage[]; nextPagingState: string | null } => {
  const messages =
    response.chatMessageResponseDtos?.map(m =>
      mapChatMessageDto(m, currentMemberId),
    ) ?? [];

  return {
    messages,
    nextPagingState: response.nextPagingState ?? null,
  };
};
