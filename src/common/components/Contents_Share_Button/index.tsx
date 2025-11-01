// 📄 src/common/components/Contents_Share_Button.tsx
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import AppIcon from '@/common/components/AppIcon';

type Props = {
  onPress?: () => void;
  size?: number;
  isLoading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  variant?: 'primary' | 'secondary' | 'active' | 'liked';
};

/**
 * ✅ ContentsShareButton
 * - 공유(전송) 아이콘 버튼
 * - AppIcon variant 기반으로 색상 자동 처리
 */
const ContentsShareButton: React.FC<Props> = ({
  onPress,
  size = 22,
  isLoading,
  disabled,
  accessibilityLabel = '공유하기',
  variant = 'primary',
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
      variant={variant}
    />
  </TouchableOpacity>
);

export default memo(ContentsShareButton);
