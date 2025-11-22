// 📄 src/common/components/Contents_Heart_Button.tsx
import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import AppIcon from '@/common/components/AppIcon';

type Props = {
  liked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
  isLoading?: boolean;
  accessibilityLabel?: string;
};

/**
 * ✅ ContentsHeartButton
 * - 좋아요 버튼 (애니메이션 포함)
 * - AppIcon variant로 색상 자동 처리
 */
const ContentsHeartButtonComponent: React.FC<Props> = ({
  liked,
  onToggle,
  size = 22,
  disabled,
  isLoading,
  accessibilityLabel = '좋아요',
}) => {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (disabled || isLoading) return;
    scale.value = withSequence(
      withSpring(1.2),
      withTiming(1, { duration: 120 }),
    );
    onToggle();
  }, [onToggle, scale, disabled, isLoading]);

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
          variant={liked ? 'liked' : 'secondary'} // ✅ variant 기반 통일
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ✅ props가 실제로 바뀌지 않으면 리렌더 차단
export const ContentsHeartButton = React.memo(
  ContentsHeartButtonComponent,
  (prev, next) =>
    prev.liked === next.liked &&
    prev.disabled === next.disabled &&
    prev.isLoading === next.isLoading,
);

export default ContentsHeartButton;
