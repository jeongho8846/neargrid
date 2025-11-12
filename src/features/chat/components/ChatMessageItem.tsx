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
  hideNick?: boolean;
  hideTime?: boolean;
};

/**
 * ✅ 개별 채팅 메시지 아이템 (3분할 레이아웃)
 * Left: 프로필 이미지
 * Center: 닉네임 → 메시지 → 리액션 박스
 * Right: 안읽은 수 + 시간
 */
const ChatMessageItem: React.FC<Props> = ({ message, hideNick, hideTime }) => {
  const { member } = useCurrentMember();
  const isMine = message.senderId === member?.id;
  const time = formatChatTime(message.createdAt);

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
    <View
      style={[hideNick ? styles.card_SameSender : styles.card_NoSameSender]}
    >
      <View style={[styles.row, isMine ? styles.rowRight : styles.rowLeft]}>
        {/* 🔹 Left (상대방만 프로필 표시) */}
        {!isMine && !hideNick ? (
          <View style={[styles.row, isMine ? styles.left_isMine : styles.left]}>
            <AppProfileImage
              imageUrl={message.senderProfileImageUrl}
              canGoToProfileScreen
              memberId={message.senderId}
            />
          </View>
        ) : (
          <View
            style={[
              styles.row,
              isMine ? styles.left_isMine : styles.leftPlaceholder,
            ]}
          />
        )}

        {/* 🔹 Center */}
        <View style={[styles.center, isMine && { alignItems: 'flex-end' }]}>
          {/* 닉네임 (상대방만 표시) */}
          {!isMine && !hideNick && message.senderNickName && (
            <AppText variant="username" style={styles.nickName}>
              {message.senderNickName}
            </AppText>
          )}

          {/* 메시지 말풍선 */}
          <View
            style={[
              styles.bubble,
              isMine ? styles.myBubble : styles.otherBubble,
            ]}
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
          {/* 안읽은 사람 수 */}
          {message.unreadChatMessageCount ? (
            <AppText variant="caption" style={styles.unreadCount}>
              {message.unreadChatMessageCount}
            </AppText>
          ) : null}

          {/* 시간 (hideTime이 false일 때만 표시) */}
          {!hideTime && (
            <AppText variant="caption" style={styles.timeText}>
              {time}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatMessageItem;

const styles = StyleSheet.create({
  card_SameSender: {
    paddingHorizontal: SPACING.xs,
    marginTop: 4,
    width: '95%',
  },
  card_NoSameSender: {
    paddingHorizontal: SPACING.xs,
    marginTop: 20,
    width: '95%',
  },
  row: {
    flexDirection: 'row',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-start',
    flexDirection: 'row-reverse',
  },
  left: {
    marginRight: 15,
    width: 40,
  },
  left_isMine: {
    left: 0,
  },
  leftPlaceholder: {
    width: 40,
    marginRight: 15,
  },
  center: {
    flexShrink: 1,
    maxWidth: '70%',
  },
  right: {
    justifyContent: 'flex-end',
    marginHorizontal: 6,
  },
  nickName: {
    marginBottom: 2,
  },
  bubble: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  myBubble: {
    backgroundColor: COLORS.button_active,
    borderRadius: 10,
  },
  otherBubble: {
    backgroundColor: COLORS.button_disabled,
    borderRadius: 10,
  },
  messageText: {},
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
    backgroundColor: COLORS.surface_variant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unreadCount: {
    marginBottom: 2,
  },
  timeText: {},
  systemWrap: {
    alignItems: 'center',
    marginVertical: 6,
  },
  systemText: {},
});
