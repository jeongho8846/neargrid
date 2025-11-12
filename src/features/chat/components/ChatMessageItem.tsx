// 📄 src/features/chat/components/ChatMessageItem.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatMessage } from '../model/ChatMessageModel';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { COLORS, SPACING } from '@/common/styles';
import { formatChatTime } from '@/utils/formatTime';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

type Props = {
  message: ChatMessage;
};

/**
 * ✅ 개별 채팅 메시지 아이템
 * - 내 메시지 → 오른쪽 정렬 (파란 말풍선)
 * - 상대 메시지 → 왼쪽 정렬 + 프로필 이미지
 */
const ChatMessageItem: React.FC<Props> = ({ message }) => {
  const { member } = useCurrentMember();
  const isMine = message.senderId === member?.id;
  const time = formatChatTime(message.createdAt);

  return (
    <View
      style={[styles.container, isMine ? styles.rightAlign : styles.leftAlign]}
    >
      {/* 🔹 상대방 메시지일 경우만 프로필 */}
      {!isMine && (
        <AppProfileImage
          imageUrl={message.senderProfileImage}
          size={32}
          canGoToProfileScreen
          memberId={message.senderId}
        />
      )}

      {/* 🔹 말풍선 + 시간 */}
      <View
        style={[
          styles.bubbleWrap,
          isMine ? styles.rightBubbleWrap : styles.leftBubbleWrap,
        ]}
      >
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}
        >
          <AppText variant="body" style={styles.messageText}>
            {message.content}
          </AppText>
        </View>
        <AppText
          variant="caption"
          style={[styles.timeText, isMine ? styles.rightTime : styles.leftTime]}
        >
          {time}
        </AppText>
      </View>
    </View>
  );
};

export default ChatMessageItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: SPACING.xs,
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  bubbleWrap: {
    maxWidth: '75%',
    flexShrink: 1,
  },
  leftBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: SPACING.xs,
  },
  rightBubbleWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    marginRight: SPACING.xs,
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
  timeText: {
    marginHorizontal: 6,
    fontSize: 11,
    color: COLORS.text_secondary,
  },
  rightTime: {
    textAlign: 'right',
  },
  leftTime: {
    textAlign: 'left',
  },
});
