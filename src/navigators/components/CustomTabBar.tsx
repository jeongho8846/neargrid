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
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

const MIN_HEIGHT = 50;
const MAX_HEIGHT = 60;

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

  // ✅ 탭바 높이 애니메이션
  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // ✅ 라벨 애니메이션 (동기화된 opacity + translateY)
  const labelAnim = useDerivedValue(() => {
    const visible = height.value > MIN_HEIGHT + insets.bottom + 5;
    return {
      opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
      translateY: withTiming(visible ? 0 : 5, { duration: 200 }),
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          {
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
            paddingBottom: insets.bottom,
            paddingTop: 15,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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

          // ✅ 라벨 스타일 (동기화된 애니메이션 적용)
          const labelStyle = useAnimatedStyle(() => ({
            opacity: labelAnim.value.opacity,
            transform: [{ translateY: labelAnim.value.translateY }],
          }));

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {icon}
              <Animated.Text
                style={[
                  FONT.caption,
                  {
                    color: isFocused ? COLORS.nav_active : COLORS.nav_inactive,
                    marginTop: 2,
                  },
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
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomTabBar;
