import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/tokens/colors';
import { RADIUS } from '@/common/styles/tokens/radius';
import { SHADOW } from '@/common/styles/tokens/shadow';
import { useTabBarStore } from '@/common/state/tabBarStore';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

const TAB_HEIGHT = 60;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isOpen } = useBottomSheetStore(); // ✅ 바텀시트 상태
  const visible = useTabBarStore(s => s.visible); // ✅ 탭바 수동 표시 상태

  // ✅ 바텀시트가 열리면 자동 숨김 (index ≥ 2 같은 의미로 isOpen=true)
  const shouldShow = visible && !isOpen;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(shouldShow ? 0 : TAB_HEIGHT + 80, {
          duration: 250,
        }),
      },
    ],
    opacity: withTiming(shouldShow ? 1 : 0, { duration: 200 }),
  }));

  const getIconName = (label: string, focused: boolean) => {
    switch (label.toLowerCase()) {
      case 'map':
        return focused ? 'map' : 'map';
      case 'feed':
        return focused ? 'home' : 'home';
      case 'create':
        return focused ? 'plus-circle' : 'plus-circle';
      case 'ranking':
        return focused ? 'award' : 'award';
      case 'profile':
        return focused ? 'user' : 'user';
      default:
        return 'circle';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        animatedContainerStyle,
        { bottom: insets.bottom + 12 }, // ✅ Safe area 보정
      ]}
    >
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

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

          const iconName = getIconName(label.toString(), isFocused);

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={[styles.tab, isFocused && styles.tabFocused]}
            >
              <AppIcon
                name={iconName}
                size={22}
                color={isFocused ? COLORS.primary : COLORS.text_secondary}
              />
              <AppText
                tKey={`tab.${label.toString().toLowerCase()}`}
                variant="label"
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

/* ===================== Styles ===================== */

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    ...SHADOW.soft,
    paddingVertical: 10,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: TAB_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabFocused: {
    borderRadius: RADIUS.md,
  },
});
