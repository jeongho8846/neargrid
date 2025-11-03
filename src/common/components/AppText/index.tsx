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
  | 'caption_bold'
  | 'link'
  | 'button'
  | 'danger';

type Props = TextProps & {
  i18nKey?: string;
  variant?: AppTextVariant;
  color?: keyof typeof COLORS;
  /** ✅ threadType에 따라 자동 색상 + 번역 적용 */
  threadType?: keyof typeof COLORS;
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
  caption_bold: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.caption,
    fontWeight: 'bold',
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
  threadType,
  style,
  children,
  values,
  isLoading = false,
  skeletonWidth = 0.6,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const baseStyle = variantStyles[variant];

  // ✅ 색상 우선순위: threadType > color > 기본 variant color
  const dynamicColor = threadType
    ? { color: COLORS[threadType] }
    : color
    ? { color: COLORS[color] }
    : {};

  // ✅ 번역 처리
  let content: any = children;

  if (i18nKey) {
    content = t(i18nKey, values);
  } else if (threadType) {
    // threadType이 있을 때 자동 번역 key 변환
    const threadTypeKey = `STR_THREAD_TYPE_${threadType}`;
    content = t(threadTypeKey);
  }

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
      style={[baseStyle, dynamicColor, style]}
      allowFontScaling={false}
      {...rest}
    >
      {content}
    </Text>
  );
}
