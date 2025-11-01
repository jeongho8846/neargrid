// 📄 src/common/components/Contents_Donation_Button.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppIcon from '@/common/components/AppIcon';

type Props = {
  onPress?: () => void;
  size?: number;
  isLoading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

/**
 * ✅ ContentsDonationButton
 * - 후원(도네이션) 아이콘 버튼
 * - AppIcon variant 기반 컬러 적용
 */
const ContentsDonationButton: React.FC<Props> = ({
  onPress,
  size = 22,
  isLoading,
  disabled,
  accessibilityLabel = '후원하기',
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    disabled={disabled || isLoading}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <AppIcon type="ion" name="gift-outline" size={size} variant="primary" />
  </TouchableOpacity>
);

export default ContentsDonationButton;
