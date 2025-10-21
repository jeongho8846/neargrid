import React, { memo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';

type Props = {
  liked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
  isLoading?: boolean;
  accessibilityLabel?: string;
};

const ContentsHeartButton: React.FC<Props> = ({
  liked,
  onToggle,
  size = 22,
  disabled,
  isLoading,
  accessibilityLabel = '좋아요',
}) => {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    // 팝 애니메이션
    scale.value = withSequence(
      withSpring(1.2),
      withTiming(1, { duration: 120 }),
    );
    onToggle();
  }, [onToggle, scale]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled || isLoading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={rStyle}>
        <AppIcon
          type="ion"
          name={liked ? 'heart' : 'heart-outline'}
          size={size}
          color={liked ? COLORS.error : COLORS.text}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(ContentsHeartButton);
