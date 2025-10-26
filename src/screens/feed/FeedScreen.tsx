// src/features/thread/screens/FeedScreen.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { useFetchFeedThreads } from '@/features/thread/hooks/useFetchFeedThreads';
import ThreadItemDetail from '@/features/thread/components/thread_item_detail';
import { createEmptyThread, Thread } from '@/features/thread/model/ThreadModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

const FeedScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(56);

  const { member, loading: memberLoading } = useCurrentMember();

  const { data, isLoading, isFetchingNextPage, fetchNextPage } =
    useFetchFeedThreads(
      {
        memberId: member?.id ?? '',
        distance: 10000000000000000,
        latitude: 37.5,
        longitude: 127.0,
        searchType: 'MOSTRECENT',
      },
      { enabled: !!member?.id && !memberLoading },
    );

  // ✅ 5개의 skeleton dummy threads
  const skeletonData: Thread[] = Array.from({ length: 5 }).map((_, i) =>
    createEmptyThread(`skeleton-${i}`),
  );

  // ✅ 깜빡임 방지용 guard (isLoading → false 후 50ms 유지)
  const [loadingGuard, setLoadingGuard] = React.useState(true);
  React.useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setLoadingGuard(false), 50);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  // ✅ skeleton 우선 조건
  const flatData =
    isLoading || loadingGuard || !data
      ? skeletonData
      : data.length > 0
      ? data
      : [];

  // ✅ 완전 비었을 때만 “데이터 없음” 표시
  const isEmpty = !isLoading && !loadingGuard && data && data.length === 0;

  return (
    <View style={{ flex: 1 }}>
      <AppCollapsibleHeader
        titleKey="STR_FEED"
        headerOffset={headerOffset}
        isAtTop={isAtTop}
        onBackPress={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => console.log('검색')}>
            <AppIcon type="ion" name="search" size={22} color={COLORS.text} />
          </TouchableOpacity>
        }
      />

      <AppFlatList
        data={flatData}
        keyExtractor={item => item.threadId.toString()}
        renderItem={({ item }) => (
          <ThreadItemDetail
            item={item}
            isLoading={isLoading || loadingGuard}
            onPress={id => console.log('📄 상세보기:', id)}
          />
        )}
        contentContainerStyle={{
          paddingTop: HEADER_TOTAL,
          paddingBottom: 40,
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.2}
        useTopButton
        loadingMore={isFetchingNextPage}
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
    </View>
  );
};

export default FeedScreen;

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
