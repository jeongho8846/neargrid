import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { useGetDonationThreadByThread } from '../hooks/useGetDonationThreadByThread';
import ThreadDonationItemCard from '../components/ThreadDonationItemCard';

type Props = {
  threadId: string;
  currentMemberId: string;
};

const ThreadDonationList = forwardRef<any, Props>(
  ({ threadId, currentMemberId }, ref) => {
    const { items, loadMore, hasNext, loading } = useGetDonationThreadByThread(
      threadId,
      currentMemberId,
    );

    useImperativeHandle(ref, () => ({ refresh: loadMore }));

    return (
      <View style={styles.container}>
        <AppFlatList
          data={items}
          keyExtractor={item => item.donationId}
          renderItem={({ item }) => (
            <ThreadDonationItemCard
              item={{
                donorProfileImageUrl: item.donorProfileImageUrl,
                donorNickname: item.donorNickname,
                message: item.message, // ← 넘겨야 함
                amount: item.amount,
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
        />
      </View>
    );
  },
);

export default ThreadDonationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
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
  },
  textContainer: {
    flex: 1,
  },
  separator: {},
});
