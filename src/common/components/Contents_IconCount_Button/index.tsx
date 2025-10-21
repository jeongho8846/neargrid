import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

type IconSpec = {
  type: 'ion' | 'mat' | string;
  name: string;
  size?: number;
  color?: string;
};

type Props = {
  icon?: IconSpec; // ⬅️ optional 로 변경
  count?: number;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
};

const ContentsIconCountButton: React.FC<Props> = ({
  icon,
  count = 0,
  onPress,
  isLoading,
  disabled,
  accessibilityLabel,
}) => {
  const iconColor = icon?.color ?? COLORS.text;

  return (
    <TouchableOpacity
      style={[styles.wrap, !icon && styles.wrapNoIcon]} // ⬅️ 아이콘 없을 때 여백 조정
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || isLoading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon ? (
        <>
          <AppIcon
            type={icon.type as any}
            name={icon.name}
            size={icon.size ?? 22}
            color={iconColor}
          />
          <AppText style={styles.count} isLoading={isLoading}>
            {count}
          </AppText>
        </>
      ) : (
        // 아이콘 없이 숫자만
        <View>
          <AppText style={styles.countOnly} isLoading={isLoading}>
            {count}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(ContentsIconCountButton);

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wrapNoIcon: { gap: 0 }, // ⬅️ 숫자만일 때 gap 제거
  count: { ...FONT.body, color: COLORS.text },
  countOnly: { ...FONT.body, color: COLORS.text }, // ⬅️ 동일 스타일또렷하게
});
