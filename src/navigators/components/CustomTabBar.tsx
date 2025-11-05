import React from 'react';
import { View } from 'react-native';
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

import { FONT } from '@/common/styles/typography';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_SPACING } from '@/test/styles/spacing';

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

  /** ✅ 라벨 애니메이션 */
  const opacity = useDerivedValue(() => withTiming(1, { duration: 200 }));
  const translateY = useDerivedValue(() => withTiming(0, { duration: 200 }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  /** ✅ 현재 활성화된 화면 감지 */
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
    <Animated.View style={[styles.wrapper, animatedContainerStyle]}>
      <View style={styles.container}>
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
                  labelStyle,
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

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24,24,24,0.85)', // ✅ 반투명 다크
    borderRadius: 42,
    paddingHorizontal: 28,
    paddingVertical: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '88%',
    shadowColor: TEST_COLORS.overlay_dark, // ✅ 어두운 그림자 톤 적용
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
    color: TEST_COLORS.primary, // ✅ 선택 시 브랜드 컬러
    fontSize: 11,
    fontWeight: '600',
  },
});

export default CustomTabBar;
