import React, { memo } from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FONT } from '@/common/styles/tokens/typography';

type Variant = 'title' | 'body' | 'caption' | 'button' | 'label';
type Align = 'auto' | 'left' | 'right' | 'center' | 'justify';

type Props = Omit<TextProps, 'children'> & {
  /** 번역 키 (정적 텍스트용) */
  tKey?: string;
  /** 직접 문자열 전달 (데이터 기반 텍스트용) */
  text?: string;
  values?: Record<string, any>;
  variant?: Variant;
  align?: Align;
  /** 동적 children 허용 */
  children?: React.ReactNode;
};

function AppTextBase({
  tKey,
  text,
  values,
  variant = 'body',
  align = 'left',
  numberOfLines,
  selectable,
  onPress,
  onTextLayout,
  children,
  ...rest
}: Props) {
  const { t } = useTranslation();

  // ✅ 번역 키가 있으면 i18n, 없으면 text 그대로 사용
  const raw = tKey
    ? t(tKey, { ...(values ?? {}), returnObjects: false })
    : text;
  const content: string | undefined =
    typeof raw === 'string' ? raw : raw ? String(raw) : undefined;

  return (
    <Text
      {...rest}
      onPress={onPress}
      onTextLayout={onTextLayout}
      numberOfLines={numberOfLines}
      ellipsizeMode={rest.ellipsizeMode ?? 'tail'} // ✅ 기본값 tail
      selectable={selectable}
      style={[styles.base, variantStyles[variant], alignStyles[align]]}
    >
      {content ?? children}
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
