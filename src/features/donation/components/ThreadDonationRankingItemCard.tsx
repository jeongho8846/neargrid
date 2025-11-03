import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage'; // ✅ 추가
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';

export type ThreadDonationRankingItem = {
  rank: number;
  donorProfileImageUrl?: string;
  donorNickname: string;
  totalAmount: number;
};

type Props = {
  item: ThreadDonationRankingItem;
};

/**
 * ✅ ThreadDonationRankingItemCard
 * - 후원 랭킹 단일 카드
 * - 순위, 프로필 이미지, 닉네임, 포인트 표시
 */
const ThreadDonationRankingItemCard: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* 순위 */}
      <View style={styles.rankBox}>
        <AppText variant="body">{item.rank}</AppText>
      </View>

      {/* ✅ 프로필 이미지 (공용 컴포넌트 사용) */}
      <AppProfileImage imageUrl={item.donorProfileImageUrl} size={36} />

      {/* 닉네임 */}
      <View style={styles.textContainer}>
        <AppText variant="username">{item.donorNickname}</AppText>
      </View>

      {/* 총 후원 포인트 */}
      <AppText variant="body">
        total {item.totalAmount.toLocaleString()} P
      </AppText>
    </View>
  );
};

export default ThreadDonationRankingItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  rankBox: {
    width: 30,
    alignItems: 'flex-start',
  },
  avatar: {
    borderRadius: 18,
    backgroundColor: COLORS.border,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
