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
import { COLORS } from '@/common/styles/colors';
import AppIcon from '../AppIcon';
import AppText from '../AppText';

/**
 * ✅ 공용 FlatList
 * - 기본 UX/성능 옵션 적용 (인스타그램 스타일)
 * - EmptyComponent (i18n 지원)
 * - RefreshControl
 * - 무한 스크롤 (onEndReached + Footer 로딩)
 * - 최상단 이동 버튼 (조건1: 화면높이 이상, 조건2: 위로 스크롤 시 표시)
 * - 모든 스크롤 이벤트 지원
 * - isHorizontal: 가로/세로 모드 전환 (기본 세로)
 */

type EmptyType = React.ComponentType<any> | React.ReactElement | null;

type AppFlatListProps<T> = FlatListProps<T> & {
  containerStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  useTopButton?: boolean;
  topButtonStyle?: StyleProp<ViewStyle>;
  emptyComponent?: EmptyType;
  loadingMore?: boolean;
  isHorizontal?: boolean;
};

// ✅ 기본 EmptyComponent는 컴포넌트 외부에 정의
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
  ...rest
}: AppFlatListProps<T>) {
  const listRef = useRef<FlatList<T>>(null);
  const [showButton, setShowButton] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const [lastOffset, setLastOffset] = useState(0);

  const resolvedEmpty: EmptyType = emptyComponent ?? DefaultEmpty;

  // ✅ Animated 값 (Y 위치 & 투명도)
  const slideAnim = useRef(new Animated.Value(100)).current; // 시작은 아래에 숨김
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: showButton ? 0 : 100, // 올라오기 / 내려가기
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: showButton ? 1 : 0, // 페이드 인/아웃
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showButton]);

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

  return (
    <>
      <FlatList
        {...rest}
        ref={listRef}
        style={containerStyle}
        horizontal={isHorizontal}
        showsVerticalScrollIndicator={
          !isHorizontal && showsVerticalScrollIndicator
        }
        showsHorizontalScrollIndicator={isHorizontal ? false : undefined}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.text}
              colors={[COLORS.text]}
            />
          ) : undefined
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onScroll={handleScroll}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={16}
        // ✅ 성능 옵션 (인스타그램 스타일)
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={false}
        ListEmptyComponent={resolvedEmpty}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerWrap}>
              <ActivityIndicator color={COLORS.button_active} />
            </View>
          ) : null
        }
      />

      {/* ✅ Animated Top Button */}
      {!isHorizontal && useTopButton && (
        <Animated.View
          style={[
            styles.scrollTopButton,
            topButtonStyle,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity
            accessibilityLabel="Scroll to top"
            onPress={() =>
              listRef.current?.scrollToOffset({ offset: 0, animated: true })
            }
          >
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
