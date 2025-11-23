// 📄 src/features/thread/screens/FeedScreen.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import ThreadList from '@/features/thread/lists/ThreadList';
import { useFetchFeedThreads } from '@/features/thread/hooks/useFetchFeedThreads';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useHeaderScroll } from '@/common/hooks/useHeaderScroll';
import { useTabBarStore } from '@/common/state/tabBarStore'; // ✅ 추가
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';

const FeedScreen = () => {
  const { member, loading: memberLoading } = useCurrentMember();
  const { headerStyle, scrollHandler, direction } = useHeaderScroll(56);
  const { hide, show } = useTabBarStore();

  // ✅ 스크롤 방향 감지 후 탭바 제어
  useAnimatedReaction(
    () => direction.value,
    dir => {
      runOnJS(dir === 'down' ? hide : show)();
    },
    [],
  );

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
      <AppCollapsibleHeader titleKey="STR_FEED" animatedStyle={headerStyle} />
      <ThreadList
        data={threadIds}
        isLoading={isLoading}
        loadingMore={isFetchingNextPage}
        onEndReached={handleLoadMore}
        onRefresh={refetch}
        refreshing={isFetching}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <BottomBlurGradient height={80} />
    </View>
  );
};

export default FeedScreen;
