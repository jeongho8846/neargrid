export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentHistory {
  paymentId: string;
  memberId: string;
  paymentMethodName: string;
  paymentStatus: PaymentStatus;
  payerName: string;
  bankTypeName: string;
  accountNo: string;
  pointChargeProductName: string;
  quantity: number;
  productName: string;
  totalPrice: number;
  totalPoint: number;
  currencyType: string;
  createDateTime: string;
  updateDateTime: string;
}

export interface PaymentHistoryResponse {
  paymentResponseDtos: PaymentHistory[];
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
