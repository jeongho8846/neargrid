// 📄 src/features/chat/components/ChatMessageItem.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ChatMessage } from '../model/ChatMessageModel';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { COLORS, SPACING } from '@/common/styles';
import { formatChatTime } from '@/utils/formatTime';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

type Props = {
  message: ChatMessage;
  prevSenderId?: string;
};

/**
 * ✅ 개별 채팅 메시지 아이템 (3분할 레이아웃)
 * Left: 프로필 이미지
 * Center: 닉네임 → 메시지 → 리액션 박스
 * Right: 안읽은 수 + 시간
 */
const ChatMessageItem: React.FC<Props> = ({ message, prevSenderId }) => {
  const { member } = useCurrentMember();
  const isMine = message.senderId === member?.id;
  const time = formatChatTime(message.createdAt);
  const showSenderInfo = !isMine && message.senderId !== prevSenderId;

  // 🔹 시스템 메시지
  if (message.type === 'SYSTEM') {
    return (
      <View style={styles.systemWrap}>
        <AppText variant="caption" style={styles.systemText}>
          {message.content}
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.row, isMine ? styles.rowRight : styles.rowLeft]}>
      {/* 🔹 Left (상대방만 프로필 표시) */}
      {!isMine && showSenderInfo ? (
        <View style={styles.left}>
          <AppProfileImage
            imageUrl={message.senderProfileImageUrl}
            size={36}
            canGoToProfileScreen
            memberId={message.senderId}
          />
        </View>
      ) : (
        <View style={styles.leftPlaceholder} />
      )}

      {/* 🔹 Center */}
      <View style={[styles.center, isMine && { alignItems: 'flex-end' }]}>
        {/* 닉네임 (상대방만 표시) */}
        {!isMine && showSenderInfo && message.senderNickName && (
          <AppText variant="username" style={styles.nickName}>
            {message.senderNickName}
          </AppText>
        )}

        {/* 메시지 말풍선 */}
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}
        >
          {message.type === 'IMAGE' ? (
            <Image
              source={{ uri: message.content }}
              style={styles.imageBubble}
              resizeMode="cover"
            />
          ) : (
            <AppText variant="body" style={styles.messageText}>
              {message.content}
            </AppText>
          )}
        </View>

        {/* 리액션 박스 자리 */}
        {message.reactions && message.reactions.length > 0 && (
          <View style={styles.reactionBox}>
            {message.reactions.map(r => (
              <AppText
                key={r.type}
                variant="caption"
                style={styles.reactionText}
              >
                {r.type} {r.count}
              </AppText>
            ))}
          </View>
        )}
      </View>

      {/* 🔹 Right (안읽은 수 + 시간) */}
      <View
        style={[
          styles.right,
          isMine ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
        ]}
      >
        {/* 안읽은 사람 수 (예시: 아직 서버 미연동) */}
        <AppText variant="caption" style={styles.unreadCount}>
          {message.unreadCount ?? ''}
        </AppText>

        {/* 시간 */}
        <AppText variant="caption" style={styles.timeText}>
          {time}
        </AppText>
      </View>
    </View>
  );
};

export default ChatMessageItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: SPACING.s,
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  left: {
    marginRight: 8,
  },
  leftPlaceholder: {
    width: 36,
    marginRight: 8,
  },
  center: {
    flexShrink: 1,
    maxWidth: '70%',
  },
  right: {
    justifyContent: 'flex-end',
    marginLeft: 6,
  },
  nickName: {
    marginBottom: 2,
    color: COLORS.text_secondary,
  },
  bubble: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
  },
  otherBubble: {
    backgroundColor: COLORS.surface_variant,
  },
  messageText: {
    color: COLORS.text_primary,
  },
  imageBubble: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
  reactionBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reactionText: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 11,
    color: COLORS.text_secondary,
  },
  unreadCount: {
    fontSize: 11,
    color: COLORS.text_secondary,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.text_tertiary,
  },
  systemWrap: {
    alignItems: 'center',
    marginVertical: 6,
  },
  systemText: {
    fontSize: 12,
    color: COLORS.text_tertiary,
  },
});
