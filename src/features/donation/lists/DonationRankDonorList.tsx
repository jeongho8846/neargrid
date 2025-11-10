import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppFlashList from '@/common/components/AppFlashList/AppFlashList';
import AppText from '@/common/components/AppText';
import { useGetDonationRankDonorByRecipient } from '../hooks/useGetDonationRankDonorByRecipient';
import ThreadDonationRankingItemCard from '../components/ThreadDonationRankingItemCard';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  currentMemberId: string;
  donorId?: string;
};

const DonationRankDonorList: React.FC<Props> = ({
  currentMemberId,
  donorId,
}) => {
  const { items, loadMore, hasNext, loading } =
    useGetDonationRankDonorByRecipient(currentMemberId, donorId);

  return (
    <View style={styles.container}>
      <AppFlashList
        data={items}
        keyExtractor={(item, idx) => `${item.memberId}-${idx}`}
        renderItem={({ item, index }) => (
          <ThreadDonationRankingItemCard
            item={{
              rank: index + 1,
              donorProfileImageUrl: item.profileImageUrl,
              donorNickname: item.nickname,
              totalAmount: item.totalAmount,
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={() => hasNext && !loading && loadMore()}
        isLoading={loading}
        ListEmptyComponent={
          !loading ? <AppText i18nKey="STR_NO_DONATION_DATA" /> : null
        }
      />
    </View>
  );
};

export default DonationRankDonorList;

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
});
