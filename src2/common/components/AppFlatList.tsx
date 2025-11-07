// 📄 src/common/components/AppFlatList.tsx
import React, { useRef, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useHeaderStore } from '@/common/state/headerStore';
import { useTabBarStore } from '@/common/state/tabBarStore';
import AppIcon from '@/common/components/AppIcon';
import { COLORS, RADIUS, SPACING } from '@/common/styles/tokens';

type Props<T> = FlatListProps<T> & {
  headerAutoHide?: boolean;
  tabBarAutoHide?: boolean;
  isLoading?: boolean;
  /** ✅ 로딩 중일 때 보여줄 뷰 (스켈레톤 프리셋, 커스텀 컴포넌트 등) */
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  const setHeaderVisible = useHeaderStore(s => s.setVisible);
  const setTabBarVisible = useTabBarStore(s => s.setVisible);
  const isTabBarVisible = useTabBarStore(s => s.visible);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const diff = offsetY - lastOffsetY.current;

    if (Math.abs(diff) > 5) {
      const scrollingDown = diff > 0;
      if (headerAutoHide) setHeaderVisible(!scrollingDown);
      if (tabBarAutoHide) setTabBarVisible(!scrollingDown);
    }

    setShowScrollTop(offsetY > 300);
    lastOffsetY.current = offsetY;
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // ✅ 로딩 중이면 외부에서 전달받은 컴포넌트 렌더링
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

      {showScrollTop && (
        <TouchableOpacity
          style={[
            styles.fab,
            { bottom: isTabBarVisible ? SPACING.xl * 6.5 : SPACING.xl * 2 },
          ]}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <AppIcon name="arrow-up" size={22} color={COLORS.surface_light} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xl * 2,
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
