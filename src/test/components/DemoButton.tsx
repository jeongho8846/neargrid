import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';
import { TEST_SHADOW } from '@/test/styles/shadows';
import { FONT } from '@/test/styles/FONT';

type Props = {
  label: string;
  onPress?: () => void;
  type?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
};

const DemoButton: React.FC<Props> = ({
  label,
  onPress,
  type = 'primary',
  style,
}) => {
  const buttonStyle = [
    styles.buttonBase,
    type === 'primary' && styles.primary,
    type === 'secondary' && styles.secondary,
    type === 'ghost' && styles.ghost,
    style,
  ];

  const textStyle = [
    FONT.button,
    type === 'ghost'
      ? { color: TEST_COLORS.primary }
      : { color: TEST_COLORS.text_primary },
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default DemoButton;

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: TEST_RADIUS.md,
    paddingVertical: TEST_SPACING.md,
    paddingHorizontal: TEST_SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: TEST_SPACING.xs,
    ...TEST_SHADOW.soft,
  },
  primary: {
    backgroundColor: TEST_COLORS.primary,
  },
  secondary: {
    backgroundColor: TEST_COLORS.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: TEST_COLORS.primary,
  },
});
