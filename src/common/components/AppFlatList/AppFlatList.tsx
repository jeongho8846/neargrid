// src/common/components/AppFlatList/AppFlatList.tsx
import React, { useRef, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';
import { COLORS } from '@/common/styles/colors';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../AppIcon';
import AppText from '../AppText';

type EmptyType = React.ComponentType<any> | React.ReactElement | null;

export type AppFlatListProps<T> = FlatListProps<T> & {
  containerStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  useTopButton?: boolean;
  topButtonStyle?: StyleProp<ViewStyle>;
  emptyComponent?: EmptyType;
  loadingMore?: boolean;
  isHorizontal?: boolean;

  /** ✅ Skeleton 렌더링 관련 */
  isLoading?: boolean;
  skeletonCount?: number;
  renderSkeletonItem?: ({ index }: { index: number }) => React.ReactElement;
};

const DefaultEmpty: React.FC = () => (
  <View style={styles.emptyWrap}>
    <AppText i18nKey="STR_NO_DATA" style={styles.emptyText} />
  </View>
);

function AppFlatList<T>({
  containerStyle,
  refreshing = false,
  onRefresh,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  contentContainerStyle,
  onEndReached,
  onEndReachedThreshold = 0.1,
  useTopButton = false,
  topButtonStyle,
  emptyComponent,
  loadingMore = false,
  isHorizontal = false,
  onScroll,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
  // ✅ Skeleton 관련
  isLoading = false,
  skeletonCount = 5,
  renderSkeletonItem,
  ...rest
}: AppFlatListProps<T>) {
  const flatRef = useRef<FlatList<T>>(null);
  const bottomRef = useRef<BottomSheetFlatListMethods>(null);

  const [showButton, setShowButton] = useState(false);
  const [lastOffset, setLastOffset] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const resolvedEmpty: EmptyType = emptyComponent ?? DefaultEmpty;

  // ✅ 키보드/안전영역 대응
  const { isVisible, height } = useKeyboardStore();
  const { bottom } = useSafeAreaInsets();

  const bottomPadding = isVisible ? height + bottom + 100 : bottom + 100;
  // ✅ BottomSheet 내부 감지
  let isInsideBottomSheet = false;
  try {
    const internal = useBottomSheetInternal();
    isInsideBottomSheet = !!internal?.animatedIndex;
  } catch {
    isInsideBottomSheet = false;
  }

  // ✅ 스크롤 감지
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const dy = offsetY - lastOffset;
    setLastOffset(offsetY);

    if (!isHorizontal) {
      if (offsetY >= screenHeight) {
        if (dy < 0 && !showButton) setShowButton(true);
        if (dy > 10 && showButton) setShowButton(false);
      } else {
        if (showButton) setShowButton(false);
      }
    }

    onScroll?.(event);
  };

  // ✅ scrollToTop 버튼 핸들러
  const handleScrollToTop = () => {
    flatRef.current?.scrollToOffset?.({ offset: 0, animated: true });
    bottomRef.current?.scrollToOffset?.({ offset: 0, animated: true });
  };

  // ✅ Skeleton 렌더링
  if (isLoading && renderSkeletonItem) {
    const skeletonItems = Array.from({ length: skeletonCount }).map((_, i) =>
      React.cloneElement(renderSkeletonItem({ index: i }), {
        key: `skeleton-${i}`,
      }),
    );

    return (
      <View
        style={[
          { flex: 1 },
          containerStyle,
          contentContainerStyle as ViewStyle,
        ]}
      >
        {skeletonItems}
      </View>
    );
  }

  // ✅ 공통 속성
  const baseListProps = {
    horizontal: isHorizontal,
    showsVerticalScrollIndicator: !isHorizontal && showsVerticalScrollIndicator,
    showsHorizontalScrollIndicator: isHorizontal ? false : undefined,
    keyboardShouldPersistTaps,
    contentContainerStyle: [{ flexGrow: 1, paddingBottom: bottomPadding }],
    onEndReached,
    onEndReachedThreshold,
    onScroll: handleScroll,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    onScrollEndDrag,
    scrollEventThrottle: 16,
    initialNumToRender: 10,
    windowSize: 10,
    maxToRenderPerBatch: 10,
    removeClippedSubviews: false,
    ListEmptyComponent: resolvedEmpty,
    ListFooterComponent: loadingMore ? (
      <View style={styles.footerWrap}>
        <ActivityIndicator color={COLORS.text} />
      </View>
    ) : null,
  };

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={COLORS.text}
      colors={[COLORS.text]}
    />
  ) : undefined;

  // ✅ BottomSheet 내부라면 BottomSheetFlatList 사용
  if (isInsideBottomSheet) {
    return (
      <BottomSheetFlatList
        ref={bottomRef}
        {...rest}
        {...baseListProps}
        refreshControl={refreshControl}
        style={containerStyle}
      />
    );
  }

  // ✅ 일반 화면이라면 FlatList 사용
  return (
    <>
      <FlatList
        ref={flatRef}
        {...rest}
        {...baseListProps}
        refreshControl={refreshControl}
        style={containerStyle}
      />

      {!isHorizontal && useTopButton && (
        <Animated.View
          style={[
            styles.scrollTopButton,
            topButtonStyle,
            {
              transform: [
                { translateY: new Animated.Value(showButton ? 0 : 100) },
              ],
              opacity: new Animated.Value(showButton ? 1 : 0),
            },
          ]}
        >
          <TouchableOpacity onPress={handleScrollToTop}>
            <AppIcon type="ion" name="arrow-up" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}

export default AppFlatList;

const styles = StyleSheet.create({
  scrollTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 24,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: COLORS.text,
  },
  footerWrap: {
    paddingVertical: 16,
  },
});
