import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { useGetDonationRankRecipientByDonor } from '../hooks/useGetDonationRankRecipientByDonor';
import { useDonationTabStore } from '../state/donationTabStore';
import ThreadDonationRankingItemCard from '../components/ThreadDonationRankingItemCard';

/**
 * ✅ ThreadDonationRankingList
 * - 스레드별 후원 랭킹 표시
 * - Zustand 기반 캐시로 탭 전환 시 유지
 * - 닫을 때만 초기화
 */
type Props = {
  threadId: string;
  currentMemberId: string;
};

const ThreadDonationRankingList: React.FC<Props> = ({
  threadId,
  currentMemberId,
}) => {
  const { clearAll } = useDonationTabStore();
  const { items, loadMore, hasNext, loading } =
    useGetDonationRankRecipientByDonor(threadId, currentMemberId);

  // 디버그 로그
  useEffect(() => {
    console.log('🟢 [ThreadDonationRankingList] mounted');
    return () => {
      console.log('🔴 [ThreadDonationRankingList] unmounted → clearAll() 실행');
      clearAll();
    };
  }, [clearAll]);

  return (
    <View style={styles.container}>
      <AppFlatList
        data={items}
        keyExtractor={item => item.donorId}
        renderItem={({ item, index }) => (
          <ThreadDonationRankingItemCard
            item={{
              rank: item.rank ?? index + 1,
              donorProfileImageUrl: item.donorProfileImageUrl,
              donorNickname: item.donorNickname,
              totalAmount: item.totalAmount,
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNext && !loading) loadMore();
        }}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <AppText variant="caption" color="text_secondary">
              불러오는 중...
            </AppText>
          ) : null
        }
      />
    </View>
  );
};

export default ThreadDonationRankingList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
