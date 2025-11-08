import React, { memo } from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FONT } from '@/common/styles/tokens/typography';
import { formatTime } from '@/utils/time';
import { formatDistance } from '@/utils/distance';
import { formatCompactNumber } from '@/utils/number';

type Variant = 'title' | 'body' | 'caption' | 'button' | 'label';
type Align = 'auto' | 'left' | 'right' | 'center' | 'justify';
type Format = 'time' | 'timeAbsolute' | 'distance' | 'number';

type Props = Omit<TextProps, 'children'> & {
  tKey?: string;
  values?: Record<string, any>;
  format?: Format;
  variant?: Variant;
  align?: Align;
  children?: React.ReactNode;
};

function AppTextBase({
  tKey,
  values,
  format,
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
  let content: string | undefined;

  if (format && children != null) {
    const value = children;
    if (format === 'time') content = formatTime(value, 'relative');
    else if (format === 'timeAbsolute')
      content = formatTime(value, 'absolute'); // ✅ 내부에서 시/날짜 자동 분기
    else if (format === 'distance') content = formatDistance(Number(value));
    else if (format === 'number') content = formatCompactNumber(Number(value));
  } else if (tKey) {
    const raw = t(tKey, { ...(values ?? {}), returnObjects: false });
    content = typeof raw === 'string' ? raw : String(raw);
  } else if (children != null) {
    content = String(children);
  }

  return (
    <Text
      {...rest}
      onPress={onPress}
      onTextLayout={onTextLayout}
      numberOfLines={numberOfLines}
      selectable={selectable}
      style={[
        styles.base,
        variantStyles[variant],
        alignStyles[align],
        rest.style,
      ]}
    >
      {content}
    </Text>
  );
}

const AppText = memo(AppTextBase);
export default AppText;

/* ============ Styles ============ */
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
