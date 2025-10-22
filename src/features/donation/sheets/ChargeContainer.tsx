// src/features/donation/charge/sheets/ChargeContainer.tsx
import React, { useMemo, useState } from 'react';
import { Platform, ToastAndroid, Alert } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import Contents_Charge_Viewer from '@/features/donation/components/Contents_Charge_Viewer';
import {
  createPayment,
  type PointChargeProduct,
} from '@/features/donation/api/createPayment';
import type { BankCode } from '@/features/donation/api/bankTypes';
import { openDonateSheet } from '@/features/donation/sheets/openDonateSheet';

type Props = {
  currentMemberId: string;
  threadId: string;
  currentPoint?: number;
  defaultBank?: BankCode; // 선택: 초기 은행
  defaultAccount?: string; // 선택: 초기 계좌
};

const ChargeContainer: React.FC<Props> = ({
  currentMemberId,
  threadId,
  currentPoint = 0,
  defaultBank = 'SHINHAN',
  defaultAccount = '',
}) => {
  const { close } = useBottomSheetStore();
  const [product, setProduct] = useState<PointChargeProduct>('POINT_1000');
  const [quantity, setQuantity] = useState<number>(1);
  const [payerName, setPayerName] = useState<string>('');
  const [bankCode, setBankCode] = useState<BankCode>(defaultBank); // ✅ 은행 선택 상태
  const [accountNo, setAccountNo] = useState<string>(defaultAccount); // ✅ 계좌 입력 상태
  const [loading, setLoading] = useState(false);

  const toast = (m: string) =>
    Platform.OS === 'android'
      ? ToastAndroid.show(m, ToastAndroid.SHORT)
      : Alert.alert('', m);

  const disabled = useMemo(
    () =>
      !payerName.trim() ||
      quantity <= 0 ||
      !bankCode ||
      !accountNo.trim() ||
      loading,
    [payerName, quantity, bankCode, accountNo, loading],
  );

  const changeQty = (dir: 'inc' | 'dec') =>
    setQuantity(q => Math.max(1, dir === 'inc' ? q + 1 : q - 1));

  const onSubmit = async () => {
    if (!payerName.trim()) return toast('입금자명을 입력해 주세요.');
    if (!accountNo.trim()) return toast('입금 계좌번호를 입력해 주세요.');

    try {
      setLoading(true);
      await createPayment({
        current_member_id: currentMemberId,
        payer_name: payerName.trim(),
        bank_type: bankCode,
        account_no: accountNo.trim(),
        point_charge_product: product,
        quantity,
      });
      toast('충전 신청이 완료되었습니다');
      close();
    } catch (e: any) {
      toast(e?.message ?? '충전 신청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    // 같은 시트 유지한 채 도네이션으로 복귀
    openDonateSheet({ currentMemberId, threadId, currentPoint });
  };

  return (
    <Contents_Charge_Viewer
      loading={loading}
      disabled={disabled}
      product={product}
      quantity={quantity}
      payerName={payerName}
      bankCode={bankCode} // ✅ 변경
      accountNo={accountNo} // ✅ 변경
      onPickProduct={setProduct}
      onInc={() => changeQty('inc')}
      onDec={() => changeQty('dec')}
      onChangePayerName={setPayerName}
      onChangeAccountNo={setAccountNo} // ✅ 추가
      onPickBank={setBankCode} // ✅ 추가
      onPressSubmit={onSubmit}
      onPressBack={onBack}
    />
  );
};

export default ChargeContainer;
