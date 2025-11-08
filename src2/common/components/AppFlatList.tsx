// 📄 src/common/components/AppFlatList.tsx
import React, { useRef } from 'react';
import {
  FlatList,
  FlatListProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useHeaderStore } from '@/common/state/headerStore';
import { useTabBarStore } from '@/common/state/tabBarStore';
import AppIcon from '@/common/components/AppIcon';
import { COLORS, RADIUS, SPACING } from '@/common/styles/tokens';

type Props<T> = FlatListProps<T> & {
  headerAutoHide?: boolean;
  tabBarAutoHide?: boolean;
  isLoading?: boolean;
  ListLoadingComponent?: React.ReactNode;
};

export default function AppFlatList<T>({
  headerAutoHide = false,
  tabBarAutoHide = false,
  isLoading = false,
  ListLoadingComponent,
  ...rest
}: Props<T>) {
  const listRef = useRef<FlatList<T>>(null);
  const lastOffsetY = useRef(0);

  const setHeaderVisible = useHeaderStore(s => s.setVisible);
  const setTabBarVisible = useTabBarStore(s => s.setVisible);
  const isTabBarVisible = useTabBarStore(s => s.visible);

  // ✅ 애니메이션 상태값
  const fabVisible = useSharedValue(0);
  const fabBottom = useSharedValue(SPACING.xl * 2);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const diff = offsetY - lastOffsetY.current;

    if (Math.abs(diff) > 5) {
      const scrollingDown = diff > 0;
      if (headerAutoHide) setHeaderVisible(!scrollingDown);
      if (tabBarAutoHide) setTabBarVisible(!scrollingDown);
    }

    // ✅ 스크롤에 따라 버튼 표시 전환
    fabVisible.value = withTiming(offsetY > 300 ? 1 : 0, { duration: 250 });

    lastOffsetY.current = offsetY;
  };

  // ✅ 탭바 표시 상태에 따른 위치 애니메이션
  React.useEffect(() => {
    const targetBottom = isTabBarVisible ? SPACING.xl * 6.5 : SPACING.xl * 2;
    fabBottom.value = withTiming(targetBottom, { duration: 250 });
  }, [isTabBarVisible]);

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fabVisible.value,
    transform: [{ translateY: withTiming(fabVisible.value ? 0 : 40) }],
    bottom: fabBottom.value,
  }));

  if (isLoading && ListLoadingComponent) {
    return <View style={styles.container}>{ListLoadingComponent}</View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        {...rest}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />

      <Animated.View style={[styles.fabContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <AppIcon name="arrow-up" size={22} color={COLORS.surface_light} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fabContainer: {
    position: 'absolute',
    right: SPACING.lg,
  },
  fab: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 5,
  },
});
