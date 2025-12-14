// 📄 src/navigators/components/CustomTabBar.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native'; // ✅ useNavigation 추가

import { FONT } from '@/common/styles/typography';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_SPACING } from '@/test/styles/spacing';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useTouchStore } from '@/common/state/touchStore';
import { useTabBarStore } from '@/common/state/tabBarStore';
import { COLORS } from '@/common/styles';

const TABBAR_HEIGHT = 80;

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { isOpen } = useBottomSheetStore();
  const { isTouching } = useTouchStore();
  const { visible } = useTabBarStore();
  const rootNavigation = useNavigation(); // ✅ Root Navigator 접근

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
    'ChatRoomScreen',
    'ChatRoomMenuScreen',
    'AttachMyThreadModal',
  ];

  const activeRoute = state.routes[state.index];
  const nestedRouteName =
    getFocusedRouteNameFromRoute(activeRoute) ||
    activeRoute?.state?.routes?.[activeRoute?.state?.index || 0]?.name ||
    activeRoute.name;

  const shouldHideCompletely =
    hiddenRoutes.includes(nestedRouteName) || isOpen || isTouching;

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = withSpring(visible ? 0 : TABBAR_HEIGHT + insets.bottom, {
      damping: 150,
      stiffness: 150,
    });
    return {
      transform: [{ translateY }],
    };
  }, [visible, insets.bottom]);

  if (shouldHideCompletely) return null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { paddingBottom: insets.bottom + 10 },
        animatedStyle,
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
            // ✅ Add 탭이면 Modal 열기
            if (route.name === 'Add') {
              console.log('➕ [CustomTabBar] Add 버튼 클릭 - Modal 열기');
              rootNavigation.navigate('ContentsCreate' as never);
              return;
            }

            // ✅ 일반 탭 이동
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
              <Text
                style={[
                  FONT.caption,
                  isFocused ? styles.labelFocused : styles.label,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default CustomTabBar;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.input_background,
    borderRadius: 42,
    paddingHorizontal: 28,
    paddingVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '88%',
    shadowColor: TEST_COLORS.overlay_dark,
    shadowOpacity: 0.4,
    shadowRadius: 1,
    shadowOffset: { width: 1, height: 6 },
    elevation: 2,
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
