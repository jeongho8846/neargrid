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

import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

const MIN_HEIGHT = 50;
const MAX_HEIGHT = 80;

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const [tabHeight, setTabHeight] = useState(MIN_HEIGHT + insets.bottom);

  const height = useSharedValue(tabHeight);

  // ✅ 제스처 (위로 → 확장, 아래로 → 축소)
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

  // ✅ 컨테이너 높이 애니메이션
  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // ✅ 아이콘 위치 (위로 올리기)
  const iconAnim = useAnimatedStyle(() => {
    const ratio =
      (height.value - (MIN_HEIGHT + insets.bottom)) / (MAX_HEIGHT - MIN_HEIGHT);

    const translateY = interpolate(ratio, [0, 1], [10, -8], Extrapolate.CLAMP);

    return {
      transform: [{ translateY }],
    };
  });

  // ✅ 라벨 애니메이션 값
  const labelAnim = useDerivedValue(() => {
    const visible = height.value > MIN_HEIGHT + insets.bottom + 5;
    return {
      opacity: visible
        ? withTiming(1, { duration: 200 })
        : withTiming(0, { duration: 120 }),
      translateY: visible
        ? withTiming(0, { duration: 200 })
        : withTiming(5, { duration: 120 }),
    };
  });

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelAnim.value.opacity,
    transform: [{ translateY: labelAnim.value.translateY }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          animatedContainerStyle,
          { paddingBottom: insets.bottom },
        ]}
      >
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
              accessibilityRole="button"
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
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginLeft: 1,
    marginRight: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
