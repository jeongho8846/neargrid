import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../styles/tokens';
import AppText from './AppText';
import AppIcon from './AppIcon';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  tKey?: string; // ✅ 텍스트는 선택
  icon?: string; // ✅ 아이콘도 선택
  variant?: Variant;
  disabled?: boolean;
  onPress?: () => void;
};

export default function AppButton({
  tKey,
  icon,
  variant = 'primary',
  disabled,
  onPress,
}: Props) {
  const bgColor =
    variant === 'secondary'
      ? COLORS.surface_light
      : variant === 'ghost'
      ? 'transparent'
      : COLORS.primary;

  const textColor =
    variant === 'ghost'
      ? COLORS.text_primary
      : variant === 'secondary'
      ? COLORS.text_secondary
      : COLORS.text_primary;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: bgColor, opacity: disabled ? 0.5 : 1 },
      ]}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && <AppIcon name={icon} size={18} color={textColor} />}
        {tKey && (
          <AppText
            tKey={tKey}
            variant="button"
            style={[styles.text, { color: textColor }]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs, // ✅ 아이콘-텍스트 간격
  },
  text: {
    includeFontPadding: false,
  },
});
