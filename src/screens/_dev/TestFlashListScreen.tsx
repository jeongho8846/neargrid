import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useFetchFeedThreads } from '@/features/thread/hooks/useFetchFeedThreads';
import ThreadItemCard from '@/features/thread/components/thread_item_card';
import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';
import ThreadItemDetail from '@/features/thread/components/thread_item_detail';

/**
 * 🧪 FlashList + useFetchFeedThreads + ThreadItemCard 테스트
 * - 실제 피드 데이터 렌더링
 * - 자동 높이 / 무한 스크롤 / 풀다운 리프레시 포함
 */
export default function TestFlashListScreen() {
  const { member, loading: memberLoading } = useCurrentMember();

  /** ✅ React Query 피드 훅 */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    refetch,
  } = useFetchFeedThreads(
    {
      memberId: member?.id ?? '',
      distance: 100000000,
      latitude: 37.5,
      longitude: 127.0,
      searchType: 'MOSTRECENT',
    },
    { enabled: !memberLoading && Boolean(member?.id) },
  );

  /** 🧩 thread 객체 배열 평탄화 */
  const threads = data?.pages.flatMap(page => page.threads) ?? [];

  /** 🚀 다음 페이지 로드 */
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  /** 🧭 로딩 상태 */
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.icon_primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={threads}
        renderItem={({ item }) => <ThreadItemDetail item={item} />}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        refreshing={isFetching}
        onRefresh={refetch}
        // estimatedItemSize={400}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={COLORS.icon_primary} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <AppText i18nKey="STR_NO_DATA" variant="caption" />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
