// src/features/donationapi/createPayment.ts
import { apiMember } from '@/services/apiService';

export type PointChargeProduct =
  | 'POINT_1000'
  | 'POINT_2000'
  | 'POINT_3000'
  | 'POINT_5000';

export type BankType = 'SHINHAN' | 'KB' | 'WOORI' | 'NH' | string; // 필요에 따라 확장

export type CreatePaymentParams = {
  current_member_id: string;
  payer_name: string;
  bank_type: BankType;
  account_no: string;
  point_charge_product: PointChargeProduct;
  quantity: number;
  current_type?: 'KRW';
  payment_method?: 'BANK_TRANSFER';
  new_tx_id?: string; // 없으면 내부에서 생성
};

export type CreatePaymentResponse = {
  ok: boolean;
  message?: string;
  paymentId?: string;
};

const genTxId = () =>
  `${Date.now()}${Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')}`;

export async function createPayment(
  params: CreatePaymentParams,
): Promise<CreatePaymentResponse> {
  const {
    current_member_id,
    payer_name,
    bank_type,
    account_no,
    point_charge_product,
    quantity,
    current_type = 'KRW',
    payment_method = 'BANK_TRANSFER',
    new_tx_id = genTxId(),
  } = params;

  // 클라 가드
  if (!current_member_id) throw new Error('current_member_id는 필수입니다.');
  if (!payer_name?.trim()) throw new Error('payer_name은 필수입니다.');
  if (!bank_type) throw new Error('bank_type은 필수입니다.');
  if (!account_no) throw new Error('account_no는 필수입니다.');
  if (!point_charge_product)
    throw new Error('point_charge_product는 필수입니다.');
  if (!Number.isInteger(quantity) || quantity <= 0)
    throw new Error('quantity는 1 이상의 정수여야 합니다.');

  const form = new FormData();
  form.append('new_tx_id', String(new_tx_id));
  form.append('current_member_id', String(current_member_id));
  form.append('payment_method', payment_method);
  form.append('payer_name', payer_name.trim());
  form.append('bank_type', bank_type);
  form.append('account_no', account_no);
  form.append('point_charge_product', point_charge_product);
  form.append('quantity', String(quantity));
  form.append('current_type', current_type);

  // 🔎 로깅용 페이로드(폼데이터와 동일)
  const payloadForLog = {
    new_tx_id: String(new_tx_id),
    current_member_id: String(current_member_id),
    payment_method,
    payer_name: payer_name.trim(),
    bank_type,
    account_no,
    point_charge_product,
    quantity: String(quantity),
    current_type,
  };

  try {
    console.groupCollapsed(
      '%c📤 [createPayment] 요청 전송',
      'color:#7aa2f7;font-weight:bold;',
    );
    console.log('POST /payment/createPayment');
    console.log('▶ 보내는 값(FormData fields):', payloadForLog);
    console.groupEnd();

    const res = await apiMember.post('/payment/createPayment', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const data = res?.data;
    console.groupCollapsed(
      '%c📥 [createPayment] 서버 응답',
      'color:#9ece6a;font-weight:bold;',
    );
    console.log('status:', res?.status);
    console.log('data:', data);
    console.groupEnd();

    return {
      ok: true,
      paymentId: data?.paymentId,
      message: data?.message,
    };
  } catch (err: any) {
    const status = err?.response?.status;
    const errData = err?.response?.data;
    const msg =
      errData?.message ||
      err?.message ||
      '결제(충전) 요청 중 오류가 발생했습니다.';

    console.groupCollapsed(
      '%c❌ [createPayment] 오류',
      'color:#f7768e;font-weight:bold;',
    );
    console.log('status:', status);
    console.log('response data:', errData);
    console.log('message:', msg);
    console.log('▶ 재확인(보낸 값):', payloadForLog);
    console.groupEnd();

    throw new Error(msg);
  }
}
