// 📄 src/features/thread/screens/FeedScreen.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import ThreadList from '@/features/thread/lists/ThreadList';
import { useFetchFeedThreads } from '@/features/thread/hooks/useFetchFeedThreads';

/**
 * ✅ 피드 화면 (React Query 기반)
 * - useFetchFeedThreads 훅으로 피드 로드
 * - Thread 단위 캐싱 자동 처리
 * - 무한 스크롤 / 풀다운 리프레시 지원
 */
const FeedScreen = () => {
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(0);
  const { member, loading: memberLoading } = useCurrentMember();

  /** 🧭 React Query 피드 훅 */
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
      distance: 100000000, // 기본 거리
      latitude: 37.5,
      longitude: 127.0,
      searchType: 'MOSTRECENT',
    },
    { enabled: !memberLoading && Boolean(member?.id) },
  );

  /** 🧩 threadIds 배열 평탄화 */
  const threadIds = data?.pages.flatMap(page => page.threadIds) ?? [];

  /** 🚀 다음 페이지 로드 */
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AppCollapsibleHeader
        titleKey="STR_FEED"
        headerOffset={headerOffset}
        isAtTop={isAtTop}
        // ✅ Feed는 루트 화면이므로 onBackPress 제거
        right={
          <TouchableOpacity onPress={() => console.log('검색')}>
            <AppIcon type="ion" name="search" size={22} variant="primary" />
          </TouchableOpacity>
        }
      />

      <ThreadList
        data={threadIds}
        isLoading={isLoading}
        loadingMore={isFetchingNextPage}
        onEndReached={handleLoadMore}
        onScroll={handleScroll}
        onRefresh={refetch}
        refreshing={isFetching}
        contentPaddingTop={HEADER_TOTAL}
      />
    </View>
  );
};

export default FeedScreen;
