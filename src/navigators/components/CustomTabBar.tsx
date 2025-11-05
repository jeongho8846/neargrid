// 📄 src/navigators/components/CustomTabBar.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

const TAB_HEIGHT = 60; // ✅ 고정 높이

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  /** ✅ 탭 전체 높이 고정 */
  const height = useSharedValue(TAB_HEIGHT + insets.bottom);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  /** ✅ 라벨 애니메이션 (탭 전환 시 부드럽게 표시) */
  const opacity = useDerivedValue(() => withTiming(1, { duration: 200 }));

  const translateY = useDerivedValue(() => withTiming(0, { duration: 200 }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  /** ✅ 현재 스택의 활성화된 화면 이름 (첫 스크린 포함) */
  const activeRoute = state.routes[state.index];
  const nestedRouteName =
    getFocusedRouteNameFromRoute(activeRoute) ||
    activeRoute?.state?.routes?.[activeRoute?.state?.index || 0]?.name ||
    activeRoute.name;

  /** ✅ 특정 화면에서 탭바 숨김 */
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
  const shouldHide = hiddenRoutes.includes(nestedRouteName);

  if (shouldHide) {
    return <Animated.View style={{ height: 0 }} />;
  }

  return (
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
            {icon}
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
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginLeft: 1,
    marginRight: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
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
