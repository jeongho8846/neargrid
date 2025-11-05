import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { FONT } from '@/common/styles/typography';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_SPACING } from '@/test/styles/spacing';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useScrollStore } from '@/common/state/scrollStore';
import { useTouchStore } from '@/common/state/touchStore'; // ✅ 터치 감지 추가

const TAB_HEIGHT = 60;

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  /** ✅ 상태 구독 */
  const { isOpen } = useBottomSheetStore();
  const { isScrolling } = useScrollStore();
  const { isTouching } = useTouchStore();

  const isSheetOpen = isOpen;
  const hiddenRoutes = [
    'DetailThread',
    'DetailThreadComment',
    'Add',
    'DemoMap',
    'DemoFeed',
    'DemoCreate',
    'DemoAlarm',
    'DemoProfile',
    'DemoSearch',
  ];

  /** ✅ 현재 활성화된 화면 */
  const activeRoute = state.routes[state.index];
  const nestedRouteName =
    getFocusedRouteNameFromRoute(activeRoute) ||
    activeRoute?.state?.routes?.[activeRoute?.state?.index || 0]?.name ||
    activeRoute.name;

  /** ✅ 숨김 여부 */
  const shouldHide =
    hiddenRoutes.includes(nestedRouteName) ||
    isSheetOpen ||
    isScrolling ||
    isTouching;

  /** ✅ 애니메이션 상태값 */
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  /** ✅ 애니메이션 트리거 */
  useEffect(() => {
    if (shouldHide) {
      // 👇 사라질 때
      translateY.value = withTiming(80, { duration: 250 }); // 아래로 슬라이드
      opacity.value = withTiming(0, { duration: 200 });
    } else {
      // 👇 나타날 때
      translateY.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
    }
  }, [shouldHide]);

  /** ✅ 애니메이션 스타일 */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.wrapper,
        animatedStyle,
        { paddingBottom: insets.bottom + 10 },
      ]}
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
          const label = typeof rawLabel === 'string' ? rawLabel : route.name;
          const isFocused = state.index === index;

          const icon =
            options.tabBarIcon &&
            options.tabBarIcon({
              focused: isFocused,
              color: isFocused
                ? TEST_COLORS.primary
                : TEST_COLORS.text_secondary,
              size: 24,
            });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {icon}
              <Animated.Text
                style={[
                  FONT.caption,
                  isFocused ? styles.labelFocused : styles.label,
                ]}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24,24,24,0.85)',
    borderRadius: 42,
    paddingHorizontal: 28,
    paddingVertical: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '88%',
    shadowColor: TEST_COLORS.overlay_dark,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    ...FONT.caption,
    color: TEST_COLORS.text_secondary,
    marginTop: TEST_SPACING.xs / 2,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  labelFocused: {
    marginTop: TEST_SPACING.xs / 2,
    color: TEST_COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
  },
});
