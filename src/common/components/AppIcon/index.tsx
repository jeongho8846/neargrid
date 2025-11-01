// src/common/components/AppIcon.tsx
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/common/styles/colors';

export type AppIconVariant =
  | 'primary'
  | 'secondary'
  | 'active'
  | 'liked'
  | 'onDark'
  | 'badge'
  | 'brand'
  | 'verified';

type IconProps = {
  name: string;
  type?: 'ion' | 'material';
  size?: number;
  /** color가 들어오면 최우선, 없으면 variant로, 그것도 없으면 icon_primary */
  color?: string;
  variant?: AppIconVariant;
  style?: any;
};

/**
 * ✅ AppIcon
 * - 모든 아이콘은 variant 기반 색상 체계를 따른다.
 * - COLORS.icon_{variant} 매핑에서 색상을 자동으로 가져온다.
 * - color prop을 수동으로 넘기면 variant보다 우선된다.
 */
export default function AppIcon({
  name,
  type = 'ion',
  size = 24,
  color,
  variant = 'primary',
  style,
}: IconProps) {
  const variantColorKey = `icon_${variant}` as keyof typeof COLORS;
  let resolvedColor = color ?? COLORS[variantColorKey] ?? COLORS.icon_primary;

  // ⚠️ undefined 색상 방지 + 경고 로그 (개발 모드에서만)
  if (__DEV__ && !resolvedColor) {
    console.warn(
      `[AppIcon] Invalid color variant: "${variant}" → falling back to icon_primary`,
    );
    resolvedColor = COLORS.icon_primary;
  }

  const IconComponent = type === 'material' ? MaterialIcons : Ionicons;

  return (
    <IconComponent
      name={name}
      size={size}
      color={resolvedColor}
      style={style}
    />
  );
}
