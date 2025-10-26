// src/common/components/AppText/index.tsx
import React from 'react';
import { Text, TextProps, StyleProp, TextStyle, View } from 'react-native';
import { FONT, COLORS } from '../../styles';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-native-reanimated-skeleton';

type Props = TextProps & {
  i18nKey?: string; // i18n 키 (예: STR_THREAD)
  variant?: keyof typeof FONT; // typography.ts에 정의된 스타일 선택
  color?: keyof typeof COLORS; // colors.ts에 정의된 색상 선택
  style?: StyleProp<TextStyle>;
  values?: Record<string, any>; // i18n interpolation 지원
  isLoading?: boolean;
  skeletonWidth?: number;
};

export default function AppText({
  i18nKey,
  variant = 'body',
  color = 'text',
  style,
  children,
  values,
  isLoading = false,
  skeletonWidth = 0.6,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const content = i18nKey ? t(i18nKey, values) : children;

  // ✅ 로딩 중이면 skeleton 표시
  if (isLoading) {
    return (
      <View style={[{ width: '100%', justifyContent: 'center' }]}>
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
              height: FONT[variant]?.fontSize ?? 14,
              borderRadius: 4,
            },
          ]}
        />
      </View>
    );
  }

  // ✅ 일반 텍스트 렌더링
  return (
    <Text style={[FONT[variant], { color: COLORS[color] }, style]} {...rest}>
      {content}
    </Text>
  );
}
