// 📄 src/common/components/Contents_IconCount_Button.tsx
import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';

type IconSpec = {
  type?: 'ion' | 'material';
  name: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'active' | 'liked';
};

type Props = {
  icon?: IconSpec;
  count?: number;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
};

/**
 * ✅ ContentsIconCountButton
 * - 아이콘 + 숫자 조합 버튼
 * - AppIcon / AppText variant 통일
 */
const ContentsIconCountButton: React.FC<Props> = ({
  icon,
  count = 0,
  onPress,
  isLoading,
  disabled,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={[styles.wrap, !icon && styles.wrapNoIcon]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || isLoading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon && (
        <AppIcon
          type={icon.type ?? 'ion'}
          name={icon.name}
          size={icon.size ?? 22}
          variant={icon.variant ?? 'secondary'}
        />
      )}

      <AppText variant="caption" isLoading={isLoading}>
        {count}
      </AppText>
    </TouchableOpacity>
  );
};

export default memo(ContentsIconCountButton);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  wrapNoIcon: {
    gap: 0,
  },
});
