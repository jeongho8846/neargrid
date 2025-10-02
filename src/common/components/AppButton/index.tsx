import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING } from '../../styles';
import AppText from '../AppText';

type Props = {
  label?: string; // 직접 라벨 텍스트
  labelKey?: string; // i18n 키 (예: STR_LOGIN)
  onPress: () => void;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  label,
  labelKey,
  onPress,
  variant = 'filled',
  disabled,
  loading,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'filled'
          ? isDisabled
            ? styles.filledDisabled
            : styles.filled
          : isDisabled
          ? styles.outlineDisabled
          : styles.outline,
        style, // ✅ 부모에서 width/flex 제어
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'filled' ? '#fff' : COLORS.button_active}
        />
      ) : (
        <AppText
          i18nKey={labelKey}
          style={
            variant === 'filled'
              ? styles.labelFilled
              : isDisabled
              ? styles.labelOutlineDisabled
              : styles.labelOutline
          }
          variant="body"
        >
          {label}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Filled
  filled: {
    backgroundColor: COLORS.button_active,
  },
  filledDisabled: {
    backgroundColor: COLORS.button_disabled,
  },

  // Outline
  outline: {
    borderWidth: 1,
    borderColor: COLORS.button_active,
    backgroundColor: 'transparent',
  },
  outlineDisabled: {
    borderWidth: 1,
    borderColor: COLORS.button_disabled,
    backgroundColor: 'transparent',
  },

  // Label
  labelFilled: {
    color: '#fff',
    fontWeight: '700',
  },
  labelOutline: {
    color: COLORS.button_active,
    fontWeight: '700',
  },
  labelOutlineDisabled: {
    color: COLORS.button_disabled,
    fontWeight: '700',
  },
});
