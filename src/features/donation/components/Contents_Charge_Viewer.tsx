// src/features/donation/components/Contents_Charge_Viewer.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';
import type { PointChargeProduct } from '@/features/donation/api/createPayment';
import {
  BANKS,
  type BankCode,
  findBank,
} from '@/features/donation/api/bankTypes';

type Props = {
  loading: boolean;
  disabled: boolean;
  product: PointChargeProduct;
  quantity: number;
  payerName: string;
  bankCode: BankCode; // ✅ 은행 코드
  accountNo: string; // ✅ 계좌 입력값
  onPickProduct: (p: PointChargeProduct) => void;
  onInc: () => void;
  onDec: () => void;
  onChangePayerName: (v: string) => void;
  onChangeAccountNo: (v: string) => void; // ✅ 추가
  onPickBank: (code: BankCode) => void; // ✅ 추가
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

  // 간단 드롭다운 토글(뷰어 내부 UI 상태)
  const [open, setOpen] = useState(false);
  const selectedBank = findBank(bankCode);

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>포인트 충전</AppText>

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
              <AppText style={styles.cardTitle}>{p.label}</AppText>
              <AppText style={styles.cardPrice}>
                {p.price.toLocaleString()}원
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 수량 */}
      <View style={styles.qtyRow}>
        <AppText style={styles.label}>수량</AppText>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={onDec}>
            <AppText style={styles.stepText}>-</AppText>
          </TouchableOpacity>
          <AppText style={styles.qtyText}>{quantity}</AppText>
          <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
            <AppText style={styles.stepText}>+</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 합계 */}
      <View style={styles.totalRow}>
        <AppText style={styles.totalLabel}>결제 금액</AppText>
        <AppText style={styles.totalValue}>{total.toLocaleString()}원</AppText>
      </View>

      {/* 은행 드롭다운 */}
      <View style={styles.field}>
        <AppText style={styles.label}>입금 은행</AppText>
        <TouchableOpacity
          style={styles.select}
          onPress={() => setOpen(v => !v)}
          activeOpacity={0.9}
        >
          <AppText style={styles.selectText}>
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
                  {/* 한 줄만 보여 길이 줄이기 */}
                  <AppText style={styles.bankKo} numberOfLines={1}>
                    {b.ko}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* 계좌번호 입력 */}
      <View style={styles.field}>
        <AppText style={styles.label}>입금 계좌</AppText>
        <TextInput
          style={styles.input}
          value={accountNo}
          onChangeText={onChangeAccountNo}
          placeholder="예: 100-1234-567890"
          placeholderTextColor={COLORS.text_muted}
          keyboardType="number-pad"
          maxLength={20}
        />
      </View>

      {/* 입금자명 */}
      <View style={styles.field}>
        <AppText style={styles.label}>입금자명</AppText>
        <TextInput
          style={styles.input}
          value={payerName}
          onChangeText={onChangePayerName}
          placeholder="예: 홍길동"
          placeholderTextColor={COLORS.text_muted}
          maxLength={30}
        />
      </View>

      {/* 액션 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={onPressBack}
          disabled={loading}
        >
          <AppText style={styles.btnText}>뒤로가기</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.submitBtn, disabled && { opacity: 0.6 }]}
          onPress={onPressSubmit}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <AppText style={[styles.btnText, { fontWeight: '700' }]}>
            {loading ? '신청 중…' : '충전 신청'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Contents_Charge_Viewer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.sheet_background,
  },
  title: { ...FONT.title, color: COLORS.text, marginBottom: SPACING.md },

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
    borderColor: COLORS.text_bubble_border,
    backgroundColor: COLORS.text_bubble_background,
    padding: 12,
  },
  cardActive: { borderColor: COLORS.button_active },
  cardTitle: { ...FONT.body, color: COLORS.text },
  cardPrice: { ...FONT.caption, color: COLORS.text_secondary, marginTop: 4 },

  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: { ...FONT.caption, color: COLORS.text_secondary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text_bubble_background,
  },
  stepText: { ...FONT.body, color: COLORS.text },
  qtyText: { ...FONT.body, color: COLORS.text },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  totalLabel: { ...FONT.body, color: COLORS.text_secondary },
  totalValue: { ...FONT.body, color: COLORS.text },

  field: { marginBottom: SPACING.lg },

  select: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    backgroundColor: COLORS.text_bubble_background,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectText: { ...FONT.body, color: COLORS.text },

  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    backgroundColor: COLORS.text_bubble_background,
  },

  dropdownGrid: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.text_bubble_border,
    backgroundColor: COLORS.text_bubble_background,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankItem: {
    width: '32%', // ✅ 3열
    marginBottom: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text_bubble_background,
  },
  bankItemActive: {
    borderColor: COLORS.button_active,
  },
  bankKo: { ...FONT.caption, color: COLORS.text },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: { ...FONT.body, color: COLORS.text },
  optionSub: { ...FONT.caption, color: COLORS.text_secondary },

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

  footer: { marginTop: SPACING.lg, flexDirection: 'row', gap: SPACING.md },
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
  btnText: { ...FONT.body, color: COLORS.text },
});
