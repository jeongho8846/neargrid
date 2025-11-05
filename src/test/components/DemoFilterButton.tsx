import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';
import { TEST_SHADOW } from '@/test/styles/shadows'; // ✅ 추가

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/**
 * ✅ DemoFilterButton
 * - 테스트용 필터 버튼 (토글 + 선택 시 그림자 강조)
 */
const DemoFilterButton: React.FC<Props> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected && {
          backgroundColor: TEST_COLORS.primary,
          ...TEST_SHADOW.base, // ✅ 선택 시 공용 그림자
          transform: [{ scale: 1.0 }], // ✅ 살짝 커지는 효과
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText
        variant="body"
        style={[styles.text, selected && { color: TEST_COLORS.text_primary }]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export default DemoFilterButton;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  button: {
    backgroundColor: TEST_COLORS.surface_light,
    borderRadius: TEST_RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    ...TEST_SHADOW.base,
  },
  text: {
    color: TEST_COLORS.text_secondary,
  },
});
