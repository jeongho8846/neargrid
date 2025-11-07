import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import AppIcon from './AppIcon';

type Props = {
  active: boolean;
  onToggle: () => void;
  activeIcon: string;
  inactiveIcon: string;
  activeColor: string;
  inactiveColor: string;
  size?: number;
};

export default function AppToggleIcon({
  active,
  onToggle,
  activeIcon,
  inactiveIcon,
  activeColor,
  inactiveColor,
  size = 28,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // ✅ 먼저 커지고
    scale.value = withSpring(
      1.2,
      {
        damping: 8,
        stiffness: 140,
        mass: 0.7,
      },
      () => {
        // ✅ 스프링 끝나면 다시 자연스럽게 원래 크기로 복귀
        scale.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        });
      },
    );

    runOnJS(onToggle)();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={animatedStyle}>
        <AppIcon
          name={active ? activeIcon : inactiveIcon}
          size={size}
          color={active ? activeColor : inactiveColor}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
