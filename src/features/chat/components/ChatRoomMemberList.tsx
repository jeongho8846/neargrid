// 📄 src/features/chat/components/ChatRoomMemberList.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppIcon from '@/common/components/AppIcon';
import { COLORS, SPACING } from '@/common/styles';
import type { ChatMember } from '../model/ChatRoomModel';

type Props = {
  members: ChatMember[];
  showInviteButton?: boolean;
  onInvitePress?: () => void;
};

/**
 * ✅ 채팅방 멤버 리스트
 * - 상단: "초대하기" 아이템
 * - 그 아래: 멤버 리스트
 * - 간격 통일
 */
const ChatRoomMemberList: React.FC<Props> = ({
  members,
  showInviteButton,
  onInvitePress,
}) => {
  const hasMembers = members && members.length > 0;

  return (
    <View style={styles.listContainer}>
      {/* 🔹 초대하기 아이템 (맨 위) */}
      {showInviteButton && (
        <TouchableOpacity
          style={styles.itemRow} // ✅ 동일한 스타일 사용
          activeOpacity={0.8}
          onPress={onInvitePress}
        >
          <View style={styles.inviteIconBox}>
            <AppIcon
              type="ion"
              name="add"
              size={20}
              color={COLORS.icon_brand}
            />
          </View>
          <AppText i18nKey="STR_CHAT_INVITE_MEMBER" style={styles.inviteText} />
        </TouchableOpacity>
      )}

      {/* 🔹 멤버 리스트 */}
      {hasMembers ? (
        members.map(member => (
          <View key={member.memberId} style={styles.itemRow}>
            <AppProfileImage imageUrl={member.profileImage} size={44} />
            <View style={styles.textContainer}>
              <AppText style={styles.nickName}>{member.nickName}</AppText>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>멤버가 없습니다.</AppText>
        </View>
      )}
    </View>
  );
};

export default ChatRoomMemberList;

const styles = StyleSheet.create({
  listContainer: {
    gap: SPACING.sm, // ✅ 전체 간격 통일
    backgroundColor: COLORS.sheet_background,
    borderRadius: 10,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs, // ✅ 모든 아이템 동일
  },
  textContainer: {
    marginLeft: SPACING.md,
  },
  nickName: {},
  emptyContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  emptyText: {},
  inviteIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderBlockColor: COLORS.background,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteText: {
    marginLeft: SPACING.md,
  },
});
