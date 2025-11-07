// 📄 src/common/components/AppErrorView.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import AppText from './AppText';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import { LAYOUT } from '../styles/presets';
import { SPACING, COLORS } from '../styles/tokens';

type Props = {
  tKey?: string;
  onRetry?: () => void;
  icon?: string;
};

export default function AppErrorView({
  tKey = 'error.default',
  onRetry,
  icon = 'reload-outline',
}: Props) {
  const rotation = useSharedValue(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    rotation.value = 0;
    rotation.value = withSequence(
      withTiming(360, {
        duration: 600,
        easing: Easing.linear,
      }),
      withTiming(0, { duration: 0 }, () => {
        runOnJS(setIsAnimating)(false);
      }),
    );

    onRetry?.();
  };

  return (
    <View style={[LAYOUT.centered, styles.container]}>
      {/* ✅ 회전 중심 및 색상 전환 */}
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        <AppIcon
          name={icon}
          size={48}
          color={isAnimating ? COLORS.primary : COLORS.text_secondary}
        />
      </Animated.View>

      {onRetry && (
        <View style={styles.buttonWrap}>
          <AppButton
            tKey="common.retry"
            onPress={handlePress}
            variant="secondary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xl,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  buttonWrap: {
    marginTop: SPACING.md,
  },
});
