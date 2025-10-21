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

const FeedScreen = () => {
  const navigation = useNavigation();
  const { headerOffset, handleScroll, HEADER_TOTAL, isAtTop } =
    useCollapsibleHeader(56);

  // ✅ React Query 훅
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useFetchFeedThreads({
      memberId: '682867966802399783',
      distance: 10000000000000000,
      latitude: 37.5,
      longitude: 127.0,
      searchType: 'MOSTRECENT',
    });

  // ✅ 스켈레톤용 더미 데이터
  const skeletonData: Thread[] = Array.from({ length: 5 }).map((_, i) =>
    createEmptyThread(`skeleton-${i}`),
  );
  // ✅ 표시 데이터 (로딩 시엔 skeleton, 완료 시엔 실제 데이터)
  const flatData = isLoading ? skeletonData : data || [];

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ 상단 헤더 */}
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

      {/* ✅ 메인 피드 리스트 */}
      <AppFlatList
        data={flatData}
        keyExtractor={item => item.threadId.toString()}
        renderItem={({ item }) => (
          <ThreadItemDetail
            item={item}
            isLoading={isLoading}
            onPress={id => console.log('📄 상세보기:', id)}
          />
        )}
        // ✅ 스켈레톤은 padding 포함해서 자연스럽게 보여야 함
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
        // ✅ 데이터 없음 처리
        ListEmptyComponent={
          !isLoading ? (
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
