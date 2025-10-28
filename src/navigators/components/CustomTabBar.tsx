import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  useDerivedValue,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

const MIN_HEIGHT = 20;
const MAX_HEIGHT = 30;

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const [tabHeight, setTabHeight] = useState(MIN_HEIGHT + insets.bottom);
  const height = useSharedValue(tabHeight);

  /** ✅ Gesture (위로 확장 / 아래로 축소) */
  const gesture = Gesture.Pan().onEnd(e => {
    if (e.translationY < -30) {
      runOnJS(setTabHeight)(MAX_HEIGHT + insets.bottom);
      height.value = withSpring(MAX_HEIGHT + insets.bottom, {
        damping: 20,
        stiffness: 200,
      });
    } else if (e.translationY > 30) {
      runOnJS(setTabHeight)(MIN_HEIGHT + insets.bottom);
      height.value = withSpring(MIN_HEIGHT + insets.bottom, {
        damping: 20,
        stiffness: 200,
      });
    }
  });

  /** ✅ 탭 전체 높이 애니메이션 */
  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  /** ✅ 아이콘 Y 이동 애니메이션 */
  const iconAnim = useAnimatedStyle(() => {
    const ratio =
      (height.value - (MIN_HEIGHT + insets.bottom)) / (MAX_HEIGHT - MIN_HEIGHT);
    const translateY = interpolate(ratio, [0, 1], [10, -8], Extrapolate.CLAMP);
    return { transform: [{ translateY }] };
  });

  /** ✅ 라벨 애니메이션 (opacity / translateY 분리) */
  const isVisible = useDerivedValue(
    () => height.value > MIN_HEIGHT + insets.bottom + 5,
  );

  const opacity = useDerivedValue(() =>
    withTiming(isVisible.value ? 1 : 0, {
      duration: isVisible.value ? 200 : 120,
    }),
  );

  const translateY = useDerivedValue(() =>
    withTiming(isVisible.value ? 0 : 5, {
      duration: isVisible.value ? 200 : 120,
    }),
  );

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  /** ✅ 현재 스택의 활성화된 화면 이름 */
  const activeRouteKey = state.routes[state.index].key;
  const focusedRouteName =
    getFocusedRouteNameFromRoute(descriptors[activeRouteKey]?.route) ??
    state.routes[state.index].name;

  /** ✅ 특정 화면에서 탭바 숨김 */
  const hiddenRoutes = ['DetailThread', 'DetailThreadComment'];
  const shouldHide = hiddenRoutes.includes(focusedRouteName);
  if (shouldHide) {
    return <Animated.View style={{ height: 0 }} />; // 또는 return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const rawLabel =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const label = typeof rawLabel === 'string' ? rawLabel : route.name;
          const isFocused = state.index === index;

          const icon =
            options.tabBarIcon &&
            options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? COLORS.nav_active : COLORS.nav_inactive,
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
              <Animated.View style={iconAnim}>{icon}</Animated.View>
              <Animated.Text
                style={[
                  FONT.caption,
                  isFocused ? styles.labelFocused : styles.label,
                  labelStyle,
                ]}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.border,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginLeft: 1,
    marginRight: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 999,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    color: COLORS.nav_inactive,
  },
  labelFocused: {
    marginTop: 2,
    color: COLORS.nav_active,
  },
});

export default CustomTabBar;
