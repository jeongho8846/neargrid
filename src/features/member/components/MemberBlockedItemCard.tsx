import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppProfileImage from '@/common/components/AppProfileImage';
import AppText from '@/common/components/AppText';
import AppButton from '@/common/components/AppButton';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';

type Props = {
  id: string;
  nickName: string;
  profileImageUrl?: string | null;
  onUnblockPress?: (memberId: string) => void;
  onPressProfile?: (memberId: string) => void;
};

const MemberBlockedItemCard: React.FC<Props> = ({
  id,
  nickName,
  profileImageUrl,
  onUnblockPress,
  onPressProfile,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => onPressProfile?.(id)}
    >
      {/* 프로필 이미지 */}
      <AppProfileImage imageUrl={profileImageUrl} size={44} />

      {/* 닉네임 및 설명 */}
      <View style={styles.info}>
        <AppText variant="username">{nickName}</AppText>
        <AppText i18nKey="STR_BLOCKED_MEMBER" variant="caption" />
      </View>

      {/* 차단 해제 버튼 */}
      <AppButton
        labelKey="STR_UNBLOCK"
        size="sm"
        variant="secondary"
        onPress={() => onUnblockPress?.(id)}
        style={styles.unblockButton}
      />
    </TouchableOpacity>
  );
};

export default MemberBlockedItemCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  info: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  unblockButton: {
    minWidth: 90,
    paddingVertical: 4,
  },
});
