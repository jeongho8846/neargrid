import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

type Props = {
  count?: number;
  showDot?: boolean; // 🔴 숫자 없이 점 표시
  size?: number; // 배지 크기
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const AppBadge: React.FC<Props> = ({
  count,
  showDot = false,
  size = 22,
  color = COLORS.error,
  style,
}) => {
  // ✅ 아무 값도 없으면 렌더링 안함
  if ((!count && !showDot) || count === 0) return null;

  const isNumber = !showDot && typeof count === 'number';
  const displayCount = count && count > 99 ? '99+' : count?.toString();

  // ✅ 점 모드일 땐 훨씬 작게 (8~10px 정도)
  const badgeSize = showDot ? 10 : size;
  const badgeWidth = isNumber
    ? Math.max(badgeSize, badgeSize + displayCount!.length * 6)
    : badgeSize;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
          width: badgeWidth,
          height: badgeSize,
          borderRadius: Math.max(badgeSize, badgeWidth) / 2,
        },
        style,
      ]}
    >
      {isNumber && (
        <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>
          {displayCount}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...FONT.caption,
    fontSize: 14, // ✅ 고정 폰트
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 14,
  },
});

export default AppBadge;
