// src/features/donation/components/Contents_Donate_Viewer.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  loading: boolean;
  disabled: boolean;
  currentPoint: number;
  point: string;
  message: string;
  onChangePoint: (v: string) => void;
  onChangeMessage: (v: string) => void;
  onPressDonate: () => void;
  onPressCancel: () => void;
  onPressCharge: () => void;
};

const Contents_Donate_Viewer: React.FC<Props> = ({
  loading,
  disabled,
  currentPoint,
  point,
  message,
  onChangePoint,
  onChangeMessage,
  onPressDonate,
  onPressCancel,
  onPressCharge,
}) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>포인트 후원</AppText>

      {/* 보유 포인트 + 충전 */}
      <View style={styles.pointRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText style={styles.pointLabel}>보유 포인트</AppText>
          <AppText style={styles.pointValue}>
            {currentPoint.toLocaleString()} P
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.chargeBtn}
          onPress={onPressCharge}
          activeOpacity={0.8}
        >
          <AppIcon
            type="ion"
            name="add-circle-outline"
            size={18}
            color={COLORS.text}
          />
          <AppText style={styles.chargeText}>충전</AppText>
        </TouchableOpacity>
      </View>

      {/* 후원 포인트 입력 */}
      <View style={styles.field}>
        <AppText style={styles.label}>후원 포인트</AppText>
        <TextInput
          style={styles.input}
          value={point}
          onChangeText={onChangePoint}
          placeholder="예: 1000"
          placeholderTextColor={COLORS.text_muted}
          keyboardType="number-pad"
          maxLength={9}
        />
      </View>

      {/* 메시지 입력 */}
      <View style={styles.field}>
        <AppText style={styles.label}>메시지 (선택)</AppText>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={message}
          onChangeText={onChangeMessage}
          placeholder="감사/응원 메시지를 남겨보세요"
          placeholderTextColor={COLORS.text_muted}
          multiline
          maxLength={300}
        />
      </View>

      {/* 액션 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={onPressCancel}
          disabled={loading}
        >
          <AppText style={styles.btnText}>취소</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.donateBtn, disabled && { opacity: 0.6 }]}
          onPress={onPressDonate}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <AppText style={[styles.btnText, { fontWeight: '700' }]}>
            {loading ? '기부중…' : '기부'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Contents_Donate_Viewer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.sheet_background, // 시트 내부 배경
  },
  title: {
    ...FONT.title,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pointRow: {
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointLabel: {
    ...FONT.body,
    color: COLORS.text_secondary,
    marginRight: 8,
  },
  pointValue: {
    ...FONT.body,
    color: COLORS.text,
  },
  chargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.text_bubble_background, // 칩 느낌
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
  },
  chargeText: {
    ...FONT.caption,
    color: COLORS.text,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...FONT.caption,
    color: COLORS.text_secondary,
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    backgroundColor: COLORS.text_bubble_background,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...FONT.body,
    color: COLORS.text,
  },
  textarea: {
    height: 96,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.md,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtn: {
    backgroundColor: COLORS.sheet_background,
  },
  donateBtn: {
    backgroundColor: COLORS.button_active, // ✅ 네 팔레트 사용
    borderColor: COLORS.button_active,
  },
  btnText: {
    ...FONT.body,
    color: COLORS.text,
  },
});
