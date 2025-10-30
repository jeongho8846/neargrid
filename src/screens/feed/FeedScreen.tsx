// src/features/thread/screens/FeedScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCollapsibleHeader } from '@/common/hooks/useCollapsibleHeader';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import ThreadList from '@/features/thread/lists/ThreadList';
import { fetchFeedThreadsDirect } from '@/features/thread/hooks/useFetchFeedThreads'; // ✅ 쿼리 제거 버전 사용
import { Thread } from '@/features/thread/model/ThreadModel';

const FeedScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(0);
  const { member, loading: memberLoading } = useCurrentMember();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  /** ✅ 초기 피드 로드 */
  const loadFeed = async () => {
    if (!member?.id) return;
    try {
      setIsLoading(true);
      const res = await fetchFeedThreadsDirect({
        memberId: member.id,
        distance: 10000000000000000,
        latitude: 37.5,
        longitude: 127.0,
        searchType: 'MOSTRECENT',
      });
      setThreads(res.threads);
      setNextCursor(res.nextCursorMark);
    } catch (e) {
      console.warn('❌ [FeedScreen] 피드 로드 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  /** ✅ 무한 스크롤 추가 로드 */
  const loadMoreFeed = async () => {
    if (isFetchingNext || !nextCursor || !member?.id) return;
    try {
      setIsFetchingNext(true);
      const res = await fetchFeedThreadsDirect({
        memberId: member.id,
        distance: 10000000000000000,
        latitude: 37.5,
        longitude: 127.0,
        searchType: 'MOSTRECENT',
        cursorMark: nextCursor,
      });
      setThreads(prev => [...prev, ...res.threads]);
      setNextCursor(res.nextCursorMark);
    } catch (e) {
      console.warn('❌ [FeedScreen] 추가 피드 로드 실패:', e);
    } finally {
      setIsFetchingNext(false);
    }
  };

  useEffect(() => {
    if (member?.id && !memberLoading) loadFeed();
  }, [member?.id, memberLoading]);

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
        data={threads}
        isLoading={isLoading}
        loadingMore={isFetchingNext}
        onEndReached={loadMoreFeed}
        onScroll={handleScroll}
        contentPaddingTop={HEADER_TOTAL}
      />
    </View>
  );
};

export default FeedScreen;
