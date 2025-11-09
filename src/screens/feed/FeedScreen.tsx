// 📄 src/features/thread/screens/FeedScreen.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import ThreadList from '@/features/thread/lists/ThreadList';
import { useFetchFeedThreads } from '@/features/thread/hooks/useFetchFeedThreads';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useHeaderScroll } from '@/common/hooks/useHeaderScroll'; // ✅ 추가

/**
 * ✅ 피드 화면 (React Query + Toss 스타일 헤더)
 * - 헤더는 스크롤 방향에 따라 숨김/노출
 * - 리스트는 FlashList 기반
 * - 모든 스크롤 이벤트는 native-thread에서 처리
 */
const FeedScreen = () => {
  const { member, loading: memberLoading } = useCurrentMember();

  // ✅ 헤더 스크롤 훅 (Reanimated 기반)
  const { headerStyle, scrollHandler } = useHeaderScroll(56);

  // ✅ 피드 데이터 쿼리
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

  const threadIds = data?.pages.flatMap(p => p.threadIds) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Toss-style Collapsible Header */}
      <AppCollapsibleHeader
        titleKey="STR_FEED"
        animatedStyle={headerStyle}
        right={
          <TouchableOpacity onPress={() => console.log('검색')}>
            <AppIcon type="ion" name="search" size={22} variant="primary" />
          </TouchableOpacity>
        }
      />

      {/* ✅ FlashList 기반 Thread List */}
      <ThreadList
        data={threadIds}
        isLoading={isLoading}
        loadingMore={isFetchingNextPage}
        onEndReached={handleLoadMore}
        onRefresh={refetch}
        refreshing={isFetching}
        onScroll={scrollHandler} // ✅ 연결
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default FeedScreen;
