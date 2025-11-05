import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import ThreadListItem from './ThreadListItem';
import ThreadItemDetail from '../components/thread_item_detail';
import { createEmptyThread } from '../model/ThreadModel';
import { SPACING } from '@/common/styles/spacing';
import { useScrollStore } from '@/common/state/scrollStore';

type Props = {
  data?: string[];
  isLoading?: boolean;
  loadingMore?: boolean;
  onEndReached?: () => void;
  onScroll?: (e: any) => void;
  contentPaddingTop?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
};

const SCROLL_THRESHOLD = 20; // ✅ 몇 px 이상일 때 스크롤 중으로 판단
const DEBOUNCE_DELAY = 200; // ✅ 스크롤 멈춘 후 감지 대기 시간(ms)

const ThreadList: React.FC<Props> = ({
  data,
  isLoading,
  loadingMore,
  onEndReached,
  onScroll,
  contentPaddingTop = 0,
  onRefresh,
  refreshing,
}) => {
  const { setScrolling } = useScrollStore();
  const lastOffset = useRef(0);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  /** ✅ 부하를 최소화한 스크롤 감지 로직 */
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const delta = Math.abs(offsetY - lastOffset.current);

    // 스크롤 이동량이 거의 없으면 무시
    if (delta < 3) return;

    // 일정 거리 이상 내려갔을 때만 한번만 setScrolling(true)
    if (offsetY > SCROLL_THRESHOLD && !isScrollingRef.current) {
      isScrollingRef.current = true;
      setScrolling(true);
    }

    // 기존 타이머 초기화 후 재시작 (디바운스)
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      isScrollingRef.current = false;
      setScrolling(false);
    }, DEBOUNCE_DELAY);

    lastOffset.current = offsetY;
    onScroll?.(e);
  };

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
      onScroll={handleScroll}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => onEndReached?.()}
      onEndReachedThreshold={0.2}
      loadingMore={loadingMore}
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
