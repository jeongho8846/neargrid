import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppText from '@/common/components/AppText';
import { useGetDonationRankRecipientByDonor } from '../hooks/useGetDonationRankRecipientByDonor';
import ThreadDonationRankingItemCard from '../components/ThreadDonationRankingItemCard';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  currentMemberId: string;
  recipientId?: string;
};

const DonationRankRecipientList: React.FC<Props> = ({
  currentMemberId,
  recipientId,
}) => {
  const { items, loadMore, hasNext, loading } =
    useGetDonationRankRecipientByDonor(currentMemberId, recipientId);

  return (
    <View style={styles.container}>
      <AppFlatList
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

export default DonationRankRecipientList;

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
});
