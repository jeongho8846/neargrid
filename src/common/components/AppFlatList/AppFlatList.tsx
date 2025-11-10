// 📄 src/common/components/AppFlatList.tsx
import React, { useRef } from 'react';
import {
  FlatList,
  FlatListProps,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import AppIcon from '@/common/components/AppIcon';
import { COLORS, SPACING } from '@/common/styles';
import { RADIUS } from '@/common/styles/radius';

type Props<T> = FlatListProps<T> & {
  headerAutoHide?: boolean;
  tabBarAutoHide?: boolean;
  isLoading?: boolean;
  ListLoadingComponent?: React.ReactNode;
};

export default function AppFlatList<T>({
  isLoading = false,
  ListLoadingComponent,
  ...rest
}: Props<T>) {
  const listRef = useRef<FlatList<T>>(null);

  // ✅ 애니메이션 상태값
  const fabVisible = useSharedValue(0);
  const fabBottom = useSharedValue(SPACING.xl * 2);

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
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast" // ✅ 인스타그램 느낌으로 감속 늘림
        contentContainerStyle={{ paddingBottom: 300 }}
      />

      <Animated.View style={[styles.fabContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <AppIcon name="arrow-up" size={22} color={COLORS.button_surface} />
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
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.round,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 5,
  },
});
