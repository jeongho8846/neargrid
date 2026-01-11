// 📄 src/features/chat/components/ChatRoomItemCard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { ChatRoom } from '../model/ChatRoomModel';
import ChatRoomAvatarGroup from './ChatRoomAvatarGroup';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles';
import { formatChatTime } from '@/utils/formatTime';

type Props = {
  item: ChatRoom;
  onPress?: (roomId: string) => void;
};

/**
 * 🔹 채팅방 리스트 카드
 * 좌: 아바타 / 센터: 이름 + 마지막 메시지 / 우: 시간 + 뱃지
 */
const ChatRoomItemCard: React.FC<Props> = ({ item, onPress }) => {
  const isGroup = item.type === 'GROUP';
  const displayMembers = item.members.filter(m => !m.isMine);

  const name = isGroup
    ? displayMembers
        .slice(0, 4)
        .map(m => m.nickName)
        .join(', ')
    : displayMembers[0]?.nickName || '알 수 없는 사용자';

  const lastMsg = item.lastMessage?.message || '(메시지 없음)';
  const unread = item.unreadCount || 0;

  const lastTime = item.updatedAt || item.lastMessage?.createdAt;
  const time = formatChatTime(lastTime);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(item.id)}
      activeOpacity={0.7}
    >
      {/* 🔹 왼쪽 섹션: 프로필 그룹 */}
      <View style={styles.leftSection}>
        <ChatRoomAvatarGroup members={displayMembers} />
      </View>

      {/* 🔹 중앙 섹션: 이름 + 마지막 메시지 */}
      <View style={styles.centerSection}>
        <AppText style={styles.name} numberOfLines={1} variant="username">
          {name}
        </AppText>
        <AppText
          style={styles.lastMessage}
          numberOfLines={1}
          ellipsizeMode="tail"
          variant="caption"
        >
          {lastMsg}
        </AppText>
      </View>

      {/* 🔹 오른쪽 섹션: 시간 + 안 읽은 수 */}
      <View style={styles.rightSection}>
        {time ? (
          <AppText style={styles.timeText} variant="caption">
            {time}
          </AppText>
        ) : (
          <View style={{ height: 12 }} />
        )}

        <View style={styles.badge}>
          {unread > 0 && <AppText style={styles.badgeText}>{unread}</AppText>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRoomItemCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + SPACING.xs,
  },
  leftSection: {
    marginRight: SPACING.sm,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
  },
  rightSection: {
    alignItems: 'flex-end',

    minWidth: 50,
    gap: 4,
  },
  name: {
    flexShrink: 1,
    maxWidth: '80%',
  },
  lastMessage: {
    maxWidth: '90%',
    color: '#666',
  },
  timeText: {
    color: '#999',
    fontSize: 12,
  },
  badge: {
    minWidth: 20,
    height: 20,

    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
});
