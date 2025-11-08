import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../styles/tokens';
import AppText from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  tKey: string;
  variant?: Variant;
  disabled?: boolean;
  onPress?: () => void;
};

export default function AppButton({
  tKey,
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
      <AppText tKey={tKey} variant="button" style={{ color: textColor }} />
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
});
