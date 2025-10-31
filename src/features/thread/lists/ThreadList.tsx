// src/features/thread/lists/ThreadList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import ThreadListItem from './ThreadListItem';
import ThreadItemDetail from '../components/thread_item_detail';
import { createEmptyThread } from '../model/ThreadModel';

type Props = {
  data?: string[];
  isLoading?: boolean;
  loadingMore?: boolean;
  onEndReached?: () => void;
  onScroll?: (e: any) => void;
  contentPaddingTop?: number;

  /** ✅ 추가 */
  onRefresh?: () => void;
  refreshing?: boolean;
};

const ThreadList: React.FC<Props> = ({
  data,
  isLoading,
  loadingMore,
  onEndReached,
  onScroll,
  contentPaddingTop = 0,
  /** ✅ 추가 */
  onRefresh,
  refreshing,
}) => {
  const isEmpty = !isLoading && (data?.length ?? 0) === 0;

  return (
    <AppFlatList
      data={data ?? []}
      keyExtractor={(id, index) => id?.toString?.() ?? `fallback-${index}`}
      renderItem={({ item }) => <ThreadListItem threadId={item} />}
      isLoading={isLoading || !data}
      renderSkeletonItem={({ index }) => (
        <ThreadItemDetail
          item={createEmptyThread(`skeleton-${index}`)}
          isLoading
        />
      )}
      skeletonCount={5}
      onScroll={onScroll}
      /** ✅ 여기 전달 */
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => onEndReached?.()}
      onEndReachedThreshold={0.2}
      loadingMore={loadingMore}
      contentContainerStyle={{
        paddingTop: contentPaddingTop,
        paddingBottom: 40,
      }}
      ListEmptyComponent={
        isEmpty ? (
          <View style={styles.emptyContainer}>
            <AppIcon
              type="ion"
              name="chatbubble-ellipses-outline"
              size={40}
              color={COLORS.text_secondary}
            />
            <AppText
              variant="body"
              color="text_secondary"
              style={styles.emptyText}
            >
              표시할 쓰레드가 없습니다.
            </AppText>
          </View>
        ) : null
      }
    />
  );
};

export default ThreadList;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
  },
  emptyText: {
    marginTop: 12,
  },
});
