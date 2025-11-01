// src/common/components/AppText/index.tsx
import React from 'react';
import { Text, TextProps, StyleProp, TextStyle, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-native-reanimated-skeleton';
import { COLORS } from '../../styles/colors';

export type AppTextVariant =
  | 'title'
  | 'body'
  | 'username'
  | 'caption'
  | 'link'
  | 'button'
  | 'danger';

type Props = TextProps & {
  i18nKey?: string;
  variant?: AppTextVariant;
  color?: keyof typeof COLORS;
  style?: StyleProp<TextStyle>;
  values?: Record<string, any>;
  isLoading?: boolean;
  skeletonWidth?: number;
};

const variantStyles: Record<AppTextVariant, TextStyle> = {
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.title,
  },
  body: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.body,
  },
  username: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.username,
  },
  caption: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.caption,
  },
  link: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.link_variant,
  },
  button: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.button_variant,
  },
  danger: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.danger_variant,
  },
};

export default function AppText({
  i18nKey,
  variant = 'body',
  color,
  style,
  children,
  values,
  isLoading = false,
  skeletonWidth = 0.6,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const baseStyle = variantStyles[variant];
  const appliedColor = color ? { color: COLORS[color] } : {};

  const content = i18nKey ? t(i18nKey, values) : children;

  if (isLoading) {
    return (
      <View style={{ width: '100%', justifyContent: 'center' }}>
        <Skeleton
          isLoading
          hasFadeIn
          animationType="pulse"
          duration={1200}
          boneColor={COLORS.skeleton_bone_light}
          highlightColor={COLORS.skeleton_highlight_light}
          layout={[
            {
              key: 'textSkeleton',
              width: `${skeletonWidth * 100}%`,
              height: baseStyle.fontSize ?? 14,
              borderRadius: 4,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <Text
      style={[baseStyle, appliedColor, style]}
      allowFontScaling={false}
      {...rest}
    >
      {content}
    </Text>
  );
}
