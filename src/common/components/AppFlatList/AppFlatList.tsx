// 📄 src/common/components/AppFlatList/AppFlatList.tsx
import React, { useRef } from 'react';
import {
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { useKeyboardStore } from '@/common/state/keyboardStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../AppText';

type EmptyType = React.ComponentType<any> | React.ReactElement | null;

export type AppFlatListProps<T> = {
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
} & React.ComponentProps<typeof FlashList<T>>;

// ✅ 기본 Empty 컴포넌트
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
  // ✅ Skeleton 관련
  isLoading = false,
  skeletonCount = 5,
  renderSkeletonItem,
  estimatedItemSize = 400,
  ...rest
}: AppFlatListProps<T>) {
  const flatRef = useRef<FlashList<T>>(null);
  const bottomRef = useRef<BottomSheetFlatListMethods>(null);

  const resolvedEmpty: EmptyType = emptyComponent ?? DefaultEmpty;
  const { isVisible, height } = useKeyboardStore();
  const { bottom } = useSafeAreaInsets();

  // ✅ BottomSheet 감지
  let isInsideBottomSheet = false;
  try {
    const internal = useBottomSheetInternal();
    isInsideBottomSheet = !!internal?.animatedIndex;
  } catch {
    isInsideBottomSheet = false;
  }

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
      {
        flexGrow: 1,
        minHeight: '100%',
        paddingBottom: bottomPadding + SPACING.xs * 2,
      },
      contentContainerStyle,
    ],
    onEndReached,
    onEndReachedThreshold,
    scrollEventThrottle: 48,
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

  // ✅ BottomSheet 내부라면 BottomSheetFlatList 유지
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

  // ✅ 일반 화면은 FlashList로
  return (
    <FlashList
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

export default AppFlatList;

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
