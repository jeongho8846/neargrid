// 📄 src/navigators/components/CustomTabBar.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { FONT } from '@/common/styles/typography';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_SPACING } from '@/test/styles/spacing';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useTouchStore } from '@/common/state/touchStore'; // ✅ 터치 감지만 유지

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { isOpen } = useBottomSheetStore();
  const { isTouching } = useTouchStore();

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

  /** ✅ 숨김 여부 (스크롤 제거, 터치/시트만 유지) */
  const shouldHide =
    hiddenRoutes.includes(nestedRouteName) || isOpen || isTouching;

  if (shouldHide) return null; // 완전히 숨김

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 10 }]}>
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
    </View>
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
