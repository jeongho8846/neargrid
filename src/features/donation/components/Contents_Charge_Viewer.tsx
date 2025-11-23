// 📄 src/features/donation/components/Contents_Charge_Viewer.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AppText from '@/common/components/AppText';
import AppInput from '@/common/components/Input';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';
import type { PointChargeProduct } from '@/features/donation/api/createPayment';
import {
  BANKS,
  type BankCode,
  findBank,
} from '@/features/donation/api/bankTypes';
import { useKeyboardStore } from '@/common/state/keyboardStore';

type Props = {
  loading: boolean;
  disabled: boolean;
  product: PointChargeProduct;
  quantity: number;
  payerName: string;
  bankCode: BankCode;
  accountNo: string;
  onPickProduct: (p: PointChargeProduct) => void;
  onInc: () => void;
  onDec: () => void;
  onChangePayerName: (v: string) => void;
  onChangeAccountNo: (v: string) => void;
  onPickBank: (code: BankCode) => void;
  onPressSubmit: () => void;
  onPressBack: () => void;
};

const products: Array<{
  key: PointChargeProduct;
  label: string;
  price: number;
}> = [
  { key: 'POINT_1000', label: '1,000 P', price: 11000 },
  { key: 'POINT_2000', label: '2,000 P', price: 22000 },
  { key: 'POINT_3000', label: '3,000 P', price: 33000 },
  { key: 'POINT_5000', label: '5,000 P', price: 55000 },
];

const Contents_Charge_Viewer: React.FC<Props> = ({
  loading,
  disabled,
  product,
  quantity,
  payerName,
  bankCode,
  accountNo,
  onPickProduct,
  onInc,
  onDec,
  onChangePayerName,
  onChangeAccountNo,
  onPickBank,
  onPressSubmit,
  onPressBack,
}) => {
  const sel = products.find(p => p.key === product)!;
  const total = sel.price * quantity;
  const [open, setOpen] = useState(false);
  const [noShow, setNoShow] = useState(true); // ✅ 추가
  const selectedBank = findBank(bankCode);
  const { isVisible, height } = useKeyboardStore();

  // ✅ noShow가 true면 간단한 메시지만 표시
  if (noShow) {
    return (
      <BottomSheetScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.noShowContainer}
      >
        <AppText variant="body" i18nKey="STR_CANT_CHARGE_DONATION_IN_APP_1" />
        <AppText variant="body" i18nKey="STR_CANT_CHARGE_DONATION_IN_APP_2" />
      </BottomSheetScrollView>
    );
  }

  return (
    <BottomSheetScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.scrollContainer,
        isVisible && { paddingBottom: height + 100 },
      ]}
    >
      <View style={styles.header}>
        <AppText variant="title" i18nKey="STR_CHARGE_TITLE" />
      </View>
      {/* 상품 선택 */}
      <View style={styles.grid}>
        {products.map(p => {
          const active = p.key === product;
          return (
            <TouchableOpacity
              key={p.key}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onPickProduct(p.key)}
              activeOpacity={0.9}
            >
              <AppText variant="body">{p.label}</AppText>
              <AppText variant="caption">{p.price.toLocaleString()}원</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 수량 */}
      <View style={styles.qtyRow}>
        <AppText variant="body" i18nKey="STR_CHARGE_QUANTITY" />
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={onDec}>
            <AppText variant="body">-</AppText>
          </TouchableOpacity>
          <AppText variant="body">{quantity}</AppText>
          <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
            <AppText variant="body">+</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 합계 */}
      <View style={styles.totalRow}>
        <AppText variant="body" i18nKey="STR_CHARGE_TOTAL" />
        <AppText variant="body">{total.toLocaleString()}원</AppText>
      </View>

      {/* 은행 선택 */}
      <View style={styles.field}>
        <AppText variant="body" i18nKey="STR_CHARGE_BANK" />
        <TouchableOpacity
          style={styles.select}
          onPress={() => setOpen(v => !v)}
          activeOpacity={0.9}
        >
          <AppText variant="body">
            {selectedBank
              ? `${selectedBank.ko} (${selectedBank.en})`
              : '은행 선택'}
          </AppText>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownGrid}>
            {BANKS.map(b => {
              const active = b.code === bankCode;
              return (
                <TouchableOpacity
                  key={b.code}
                  style={[styles.bankItem, active && styles.bankItemActive]}
                  onPress={() => {
                    onPickBank(b.code);
                    setOpen(false);
                  }}
                  activeOpacity={0.9}
                >
                  <AppText variant="caption" numberOfLines={1}>
                    {b.ko}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* 계좌번호 */}
      <View style={styles.field}>
        <AppText variant="body" i18nKey="STR_CHARGE_ACCOUNT" />
        <AppInput
          value={accountNo}
          onChangeText={onChangeAccountNo}
          placeholder="예: 100-1234-567890"
          keyboardType="number-pad"
          maxLength={20}
        />
      </View>

      {/* 입금자명 */}
      <View style={styles.field}>
        <AppText variant="body" i18nKey="STR_CHARGE_PAYER" />
        <AppInput
          value={payerName}
          onChangeText={onChangePayerName}
          placeholder="예: 홍길동"
          maxLength={30}
        />
      </View>

      {/* 액션 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={onPressBack}
          disabled={loading}
        >
          <AppText variant="button" i18nKey="STR_BACK" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.submitBtn, disabled && { opacity: 0.6 }]}
          onPress={onPressSubmit}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <AppText variant="button">
            {loading ? '신청 중…' : '충전 신청'}
          </AppText>
        </TouchableOpacity>
      </View>
    </BottomSheetScrollView>
  );
};

export default Contents_Charge_Viewer;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 200,
  },
  // ✅ noShow 전용 스타일
  noShowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  noShowText: {
    textAlign: 'center',
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.lg,
  },
  card: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.sheet_background,
    padding: 12,
  },
  cardActive: { borderColor: COLORS.button_active },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.button_active,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  field: { marginBottom: SPACING.lg, gap: 5 },
  select: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    backgroundColor: COLORS.button_active,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownGrid: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    backgroundColor: COLORS.background,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankItem: {
    width: '32%',
    marginBottom: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  bankItemActive: { borderColor: COLORS.button_active },
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
  cancelBtn: { backgroundColor: COLORS.sheet_background },
  submitBtn: {
    backgroundColor: COLORS.button_active,
    borderColor: COLORS.button_active,
  },
});
