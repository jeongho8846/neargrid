// 📄 src/features/thread/lists/ThreadList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import ThreadListItem from './ThreadListItem';
import ThreadItemDetail from '../components/thread_item_detail';
import { createEmptyThread } from '../model/ThreadModel';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  data?: string[];
  isLoading?: boolean;
  loadingMore?: boolean;
  onEndReached?: () => void;
  contentPaddingTop?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** ✅ Toss-style 헤더 연동용 스크롤 핸들러 */
  onScroll?: any;
  scrollEventThrottle?: number;
};

const ThreadList: React.FC<Props> = ({
  data,
  isLoading,
  loadingMore,
  onEndReached,
  contentPaddingTop = 0,
  onRefresh,
  refreshing,
  onScroll,
  scrollEventThrottle = 16, // ✅ 추가 (Reanimated에 최적)
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
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => onEndReached?.()}
      onEndReachedThreshold={0.2}
      loadingMore={loadingMore}
      onScroll={onScroll} // ✅ 헤더 연동
      scrollEventThrottle={scrollEventThrottle} // ✅ 프레임별 호출
      contentContainerStyle={{
        paddingTop: contentPaddingTop,
        paddingBottom: SPACING.xl * 2,
      }}
      ListEmptyComponent={
        isEmpty ? (
          <View style={styles.emptyContainer}>
            <AppIcon
              type="ion"
              name="chatbubble-ellipses-outline"
              size={40}
              variant="secondary"
            />
            <AppText
              i18nKey="STR_EMPTY_THREAD_LIST"
              variant="caption"
              style={styles.emptyText}
            />
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
