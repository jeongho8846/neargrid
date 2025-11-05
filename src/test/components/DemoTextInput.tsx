import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';

/**
 * ✅ DemoTextInput
 * - 한 줄 입력용 컴포넌트 (단일 라인)
 * - 어두운 배경 + 라운드 + 테두리
 */
const DemoTextInput: React.FC<TextInputProps> = props => {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor={TEST_COLORS.text_secondary}
        cursorColor={TEST_COLORS.primary}
      />
    </View>
  );
};

export default DemoTextInput;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  container: {
    backgroundColor: TEST_COLORS.background, // ✅ 가장 어두운 색
    borderColor: TEST_COLORS.border, // ✅ 미세한 경계선
    borderWidth: 1,
    borderRadius: TEST_RADIUS.md,
    paddingHorizontal: TEST_SPACING.md,
    justifyContent: 'center',
    height: 48, // 한 줄 입력 전용
  },
  input: {
    color: TEST_COLORS.text_primary,
    fontSize: 16,
    paddingVertical: 0, // iOS 기본 패딩 제거
  },
});
