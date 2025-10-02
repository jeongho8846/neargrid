// src/common/components/AppText/index.tsx
import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { FONT, COLORS } from '../../styles';
import { useTranslation } from 'react-i18next';

type Props = TextProps & {
  i18nKey?: string; // i18n 키 (예: STR_THREAD)
  variant?: keyof typeof FONT; // typography.ts에 정의된 스타일 선택
  color?: keyof typeof COLORS; // colors.ts에 정의된 색상 선택
  style?: StyleProp<TextStyle>;
};

export default function AppText({
  i18nKey,
  variant = 'body',
  color = 'text',
  style,
  children,
  ...rest
}: Props) {
  const { t } = useTranslation();

  return (
    <Text style={[FONT[variant], { color: COLORS[color] }, style]} {...rest}>
      {i18nKey ? t(i18nKey) : children}
    </Text>
  );
}
