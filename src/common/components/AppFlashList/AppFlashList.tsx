// 📄 src/common/components/AppFlashList/AppFlashList.tsx
import React, { useRef } from 'react';
import {
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import Animated from 'react-native-reanimated'; // ✅ 추가
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../AppText';

type EmptyType = React.ComponentType<any> | React.ReactElement | null;

// ✅ Reanimated용 FlashList 래퍼
const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList,
) as typeof FlashList;

export type AppFlashListProps<T> = {
  containerStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyComponent?: EmptyType;
  loadingMore?: boolean;
  isHorizontal?: boolean;
  isLoading?: boolean;
  skeletonCount?: number;
  renderSkeletonItem?: ({ index }: { index: number }) => React.ReactElement;
  estimatedItemSize?: number;
  onScroll?: any; // ✅ Reanimated scrollHandler 지원
  scrollEventThrottle?: number;
} & React.ComponentProps<typeof FlashList<T>>;

// ✅ 기본 Empty 컴포넌트
const DefaultEmpty: React.FC = () => (
  <View style={styles.emptyWrap}>
    <AppText i18nKey="STR_NO_DATA" variant="caption" />
  </View>
);

function AppFlashList<T>({
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
  isLoading = false,
  skeletonCount = 5,
  renderSkeletonItem,
  estimatedItemSize = 400,
  onScroll,
  scrollEventThrottle = 16, // ✅ Reanimated에 최적
  ...rest
}: AppFlashListProps<T>) {
  const flatRef = useRef<FlashList<T>>(null);
  const bottomRef = useRef<BottomSheetFlatListMethods>(null);

  const resolvedEmpty: EmptyType = emptyComponent ?? DefaultEmpty;
  const { isVisible, height } = useKeyboardStore();
  const { bottom } = useSafeAreaInsets();

  // ✅ BottomSheet 내부 여부 감지
  let isInsideBottomSheet = false;
  try {
    const internal = useBottomSheetInternal();
    isInsideBottomSheet = !!internal?.animatedIndex;
  } catch {
    isInsideBottomSheet = false;
  }

  // ✅ 스켈레톤 모드
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

  // ✅ 하단 여백 (키보드 + SafeArea 대응)
  const bottomPadding = isVisible
    ? height + bottom + SPACING.xl
    : bottom + SPACING.xl;

  // ✅ 공통 리스트 속성
  const baseListProps = {
    horizontal: isHorizontal,
    showsVerticalScrollIndicator: !isHorizontal && showsVerticalScrollIndicator,
    showsHorizontalScrollIndicator: isHorizontal ? false : undefined,
    keyboardShouldPersistTaps,
    contentContainerStyle: [
      {
        flexGrow: 1,
        minHeight: '100%',
        paddingBottom: bottomPadding + SPACING.xs * 2,
      },
      contentContainerStyle,
    ],
    onEndReached,
    onEndReachedThreshold,
    onScroll, // ✅ Reanimated scrollHandler 연결
    scrollEventThrottle,
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

  // ✅ BottomSheet 내부일 경우 (gorhom)
  if (isInsideBottomSheet) {
    return (
      <BottomSheetFlatList
        ref={bottomRef}
        {...(rest as any)}
        {...baseListProps}
        refreshControl={refreshControl}
        style={containerStyle}
      />
    );
  }

  // ✅ 기본 FlashList → Reanimated 래핑 버전 사용
  return (
    <AnimatedFlashList
      ref={flatRef}
      {...(rest as any)}
      {...baseListProps}
      refreshControl={refreshControl}
      estimatedItemSize={estimatedItemSize}
      decelerationRate={Platform.OS === 'ios' ? 0.993 : 0.985}
      style={containerStyle}
    />
  );
}

export default AppFlashList;

const styles = StyleSheet.create({
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
