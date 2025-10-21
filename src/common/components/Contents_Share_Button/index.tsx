import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';

type Props = {
  onPress?: () => void;
  size?: number;
  isLoading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const ContentsShareButton: React.FC<Props> = ({
  onPress,
  size = 22,
  isLoading,
  disabled,
  accessibilityLabel = '공유하기',
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    disabled={disabled || isLoading}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <AppIcon
      type="ion"
      name="paper-plane-outline"
      size={size}
      color={COLORS.text}
    />
  </TouchableOpacity>
);

export default memo(ContentsShareButton);
