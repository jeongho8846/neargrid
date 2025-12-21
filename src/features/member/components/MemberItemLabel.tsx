import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { SPACING } from '@/common/styles/spacing';

export type MemberItem = {
  id: string;
  nickname: string;
  profileImageUrl?: string | null;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

/**
 * ✅ 팔로워 / 팔로잉 공용 아이템 라벨
 * - 프로필 이미지 + 닉네임
 * - TouchableOpacity로 감싸 클릭 이벤트 지원
 */
const MemberItemLabel: React.FC<{ item: MemberItem }> = ({ item }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={item.onPress}
    >
      <AppProfileImage
        imageUrl={item.profileImageUrl}
        canGoToProfileScreen={false}
        memberId={item.id}
      />
      <View style={styles.textBox}>
        <AppText variant="username">{item.nickname}</AppText>
      </View>
      {item.rightElement}
    </TouchableOpacity>
  );
};

export default MemberItemLabel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  textBox: {
    flex: 1,
  },
});
