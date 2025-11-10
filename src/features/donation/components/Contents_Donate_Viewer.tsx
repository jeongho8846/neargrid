// 📄 src/features/donation/components/Contents_Donate_Viewer.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppInput from '@/common/components/Input';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { useKeyboardStore } from '@/common/state/keyboardStore'; // ✅ 전역 키보드 상태 구독

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
  const { isVisible, height } = useKeyboardStore();

  return (
    <BottomSheetScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.scrollContainer,
        isVisible && { paddingBottom: height + 100 }, // ✅ 키보드 높이만큼 여백 추가
      ]}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <AppText variant="title" i18nKey="STR_DONATE_TITLE" />
      </View>

      {/* 보유 포인트 + 충전 */}
      <View style={styles.pointRow}>
        <View style={{ gap: 6 }}>
          <AppText variant="body" i18nKey="STR_DONATE_MYPOINT" />
          <AppText variant="body">{currentPoint.toLocaleString()} P</AppText>
        </View>
        <TouchableOpacity
          style={styles.chargeBtn}
          onPress={onPressCharge}
          activeOpacity={0.8}
        >
          <AppIcon type="ion" name="add-circle-outline" size={18} />
          <AppText variant="body" i18nKey="STR_DONATE_CHARGE" />
        </TouchableOpacity>
      </View>

      {/* 후원 포인트 입력 */}
      <View style={styles.field}>
        <AppText variant="body" i18nKey="STR_DONATE_INPUT_POINT" />
        <AppInput
          value={point}
          onChangeText={onChangePoint}
          placeholder="예: 1000"
          keyboardType="number-pad"
          maxLength={9}
        />
      </View>

      {/* 메시지 입력 */}
      <View style={styles.field}>
        <AppText variant="body" i18nKey="STR_DONATE_MESSAGE_OPTIONAL" />
        <AppInput
          value={message}
          onChangeText={onChangeMessage}
          placeholder="감사/응원 메시지를 남겨보세요"
          multiline
          maxLength={300}
          style={styles.textarea}
        />
      </View>

      {/* 액션 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={onPressCancel}
          disabled={loading}
        >
          <AppText variant="button" i18nKey="STR_CANCEL" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.donateBtn, disabled && { opacity: 0.6 }]}
          onPress={onPressDonate}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <AppText variant="button">{loading ? '기부중…' : '기부'}</AppText>
        </TouchableOpacity>
      </View>
    </BottomSheetScrollView>
  );
};

export default Contents_Donate_Viewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  pointRow: {
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.button_active,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
  },
  field: {
    marginBottom: SPACING.lg,
    gap: 10,
  },
  textarea: {
    height: 96,
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
    backgroundColor: COLORS.button_active,
    borderColor: COLORS.button_active,
  },
});
