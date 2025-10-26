import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { useFetchFeedThreads } from '@/features/thread/hooks/useFetchFeedThreads';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import ThreadList from '@/features/thread/lists/ThreadList';

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

      <ThreadList
        data={data}
        isLoading={isLoading}
        loadingMore={isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
        onScroll={handleScroll}
        contentPaddingTop={HEADER_TOTAL}
      />
    </View>
  );
};

export default FeedScreen;
