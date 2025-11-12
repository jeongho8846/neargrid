import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';
import { PaymentHistory } from '../model/PaymentHistoryModel';

type Props = {
  item: PaymentHistory;
};

const PaymentHistoryItemCard: React.FC<Props> = ({ item }) => {
  const isPending = item.paymentStatus === 'PENDING';
  const isSuccess = item.paymentStatus === 'SUCCESS';

  return (
    <View style={styles.card}>
      {/* 상단 영역 */}
      <View style={styles.headerRow}>
        <AppText variant="caption">{item.createDateTime.split('T')[0]}</AppText>
        <AppText
          variant={isPending ? 'danger' : 'link'}
          style={isPending ? styles.pending : styles.success}
        >
          {isPending ? '결제중' : isSuccess ? '결제완료' : item.paymentStatus}
        </AppText>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 본문 */}
      <AppText variant="body">
        {item.pointChargeProductName} ({item.totalPrice.toLocaleString()}원)
      </AppText>

      <AppText variant="caption">
        {item.paymentMethodName} • {item.bankTypeName} {item.accountNo}
      </AppText>

      <AppText variant="caption">결제자: {item.payerName}</AppText>
    </View>
  );
};

export default PaymentHistoryItemCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.sheet_backdrop,
    borderRadius: 12,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1, // Android 그림자
    gap: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    // height: 1,
    // backgroundColor: COLORS.body,
    // marginVertical: SPACING.xs,
  },
  pending: {
    color: COLORS.error,
  },
  success: {
    color: COLORS.success,
  },
});
