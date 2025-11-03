import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import AppTextField from '@/common/components/AppTextField';
import AppProfileImage from '@/common/components/AppProfileImage';

export type ThreadDonationItem = {
  donorProfileImageUrl?: string;
  donorNickname: string;
  message?: string;
  amount: number;
};

type Props = {
  item: ThreadDonationItem;
};

const ThreadDonationItemCard: React.FC<Props> = ({ item }) => {
  console.log('🧾 [ThreadDonationItemCard] item:', item);

  return (
    <View style={styles.card}>
      <AppProfileImage imageUrl={item.donorProfileImageUrl} size={36} />

      <View style={styles.textContainer}>
        <AppText variant="username">{item.donorNickname}</AppText>
        <AppTextField text={item.message} numberOfLines={2} />
      </View>

      <AppText variant="body">+{item.amount.toLocaleString()} P</AppText>
    </View>
  );
};

export default ThreadDonationItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border_light, // ✅ 시각 확인용
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
