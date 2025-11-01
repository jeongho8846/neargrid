// 📄 src/common/components/AppFlatList/AppFlatList.tsx
import React, { useRef, useState, useEffect } from 'react';
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
import { SPACING } from '@/common/styles/spacing';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../AppIcon';
import AppText from '../AppText';

type EmptyType = React.ComponentType<any> | React.ReactElement | null;

export type AppFlatListProps<T> = FlatListProps<T> & {
  containerStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyComponent?: EmptyType;
  loadingMore?: boolean;
  isHorizontal?: boolean;
  isLoading?: boolean;
  skeletonCount?: number;
  renderSkeletonItem?: ({ index }: { index: number }) => React.ReactElement;
};

// ✅ 기본 Empty 컴포넌트 (번역/스켈레톤 일관)
const DefaultEmpty: React.FC = () => (
  <View style={styles.emptyWrap}>
    <AppText i18nKey="STR_NO_DATA" variant="caption" />
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
  const fadeAnim = useRef(new Animated.Value(0));

  const resolvedEmpty: EmptyType = emptyComponent ?? DefaultEmpty;

  // ✅ 키보드 & safe area 대응
  const { isVisible, height } = useKeyboardStore();
  const { bottom } = useSafeAreaInsets();

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
      if (offsetY >= screenHeight * 1) {
        if (dy < 0 && !showButton) setShowButton(true);
        if (dy > 10 && showButton) setShowButton(false);
      } else {
        if (showButton) setShowButton(false);
      }
    }

    onScroll?.(event);
  };

  // ✅ 위로 스크롤
  const handleScrollToTop = () => {
    flatRef.current?.scrollToOffset?.({ offset: 0, animated: true });
    bottomRef.current?.scrollToOffset?.({ offset: 0, animated: true });
  };

  // ✅ 버튼 등장 애니메이션
  useEffect(() => {
    Animated.timing(fadeAnim.current, {
      toValue: showButton ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [showButton]);

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

  // ✅ 리스트 공통 속성
  const bottomPadding = isVisible
    ? height + bottom + SPACING.xl
    : bottom + SPACING.xl;

  const baseListProps = {
    horizontal: isHorizontal,
    showsVerticalScrollIndicator: !isHorizontal && showsVerticalScrollIndicator,
    showsHorizontalScrollIndicator: isHorizontal ? false : undefined,
    keyboardShouldPersistTaps,
    contentContainerStyle: [
      { flexGrow: 1, paddingBottom: bottomPadding },
      contentContainerStyle,
    ],
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
        <ActivityIndicator color={COLORS.icon_primary} />
      </View>
    ) : null,
  };

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={COLORS.icon_primary}
      colors={[COLORS.icon_primary]}
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

      {/* ✅ 스크롤 위로가기 버튼 */}
      {!isHorizontal && (
        <Animated.View
          style={[
            styles.scrollTopButton,
            {
              bottom: isVisible ? height + bottom + 20 : bottom + 20,
              opacity: fadeAnim.current,
              transform: [
                {
                  translateY: fadeAnim.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleScrollToTop}
            activeOpacity={0.8}
            style={styles.topButtonInner}
          >
            <AppIcon type="ion" name="arrow-up" size={18} variant="primary" />
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
    right: 10,
  },
  topButtonInner: {
    backgroundColor: COLORS.sheet_background,
    padding: 12,
    borderRadius: 24,
    elevation: 5,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  footerWrap: {
    paddingVertical: 16,
  },
});
