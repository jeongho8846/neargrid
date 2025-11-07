// /src2/common/components/AppText.tsx
import React, { memo } from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FONT } from '@/common/styles/tokens/typography';
import { COLORS } from '@/common/styles/tokens/colors';

type Variant = 'title' | 'body' | 'caption' | 'button' | 'label';
type Align = 'auto' | 'left' | 'right' | 'center' | 'justify';

type Props = Omit<TextProps, 'children'> & {
  tKey: string;
  values?: Record<string, any>;
  variant?: Variant;
  align?: Align;
  /** 동적 값만 children 허용 */
  children?: React.ReactNode;
};

function AppTextBase({
  tKey,
  values,
  variant = 'body',
  align = 'left',
  numberOfLines,
  selectable,
  onPress,
  children,
  ...rest
}: Props) {
  const { t } = useTranslation();

  // ✅ i18next 객체 반환 방지: returnObjects:false 보장 + 문자열로 강제
  const raw = t(tKey, { ...(values ?? {}), returnObjects: false });
  const content: string = typeof raw === 'string' ? raw : String(raw);

  return (
    <Text
      {...rest}
      onPress={onPress}
      numberOfLines={numberOfLines}
      selectable={selectable}
      style={[styles.base, variantStyles[variant], alignStyles[align]]}
    >
      {content}
      {children}
    </Text>
  );
}

const AppText = memo(AppTextBase);
export default AppText;

/* ===================== Styles ===================== */

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

const variantStyles = StyleSheet.create({
  title: { ...FONT.title },
  body: { ...FONT.body },
  caption: { ...FONT.caption },
  button: { ...FONT.button },
  label: { ...FONT.label },
});

const alignStyles: Record<Align, TextStyle> = StyleSheet.create({
  auto: { textAlign: 'auto' },
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  justify: { textAlign: 'justify' },
});
